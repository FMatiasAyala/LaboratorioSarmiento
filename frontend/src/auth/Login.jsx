import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1); // 1 = DNI | 2 = password | 3 = crear password
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Auto-focus en cada paso
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [step]);

  // =============================
  // Helpers para reset de estado
  // =============================
  const resetAll = () => {
    setDni("");
    setPassword("");
    setError("");
    setStep(1);
  };

  const resetPassword = () => {
    setPassword("");
    setError("");
  };

  // =============================
  // PASO 1 → Verificar DNI
  // =============================
  const verificarDni = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const resp = await fetch(`${API_URL}/api/verificar-dni`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni }),
      });

      const data = await resp.json();

      if (!resp.ok || !data.ok) {
        setError(data.error || "El DNI no es válido");
        return;
      }

      // Usuario ya tiene cuenta → pedir contraseña
      if (data.existe_mysql) {
        resetPassword();
        setStep(2);
      }

      // Paciente existe pero no tiene cuenta → crear contraseña
      else if (data.existe_dbf && !data.existe_mysql) {
        resetPassword();
        setStep(3);
      }

    } catch (err) {
      setError("No se pudo conectar al servidor");
    }
  };

  // =============================
  // PASO 2 → Login normal
  // =============================
  const login = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const resp = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni, password }),
      });

      const data = await resp.json();

      if (!resp.ok || !data.ok) {
        setError(data.error || "Contraseña incorrecta");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.user));

      navigate("/portal");

    } catch (err) {
      setError("Error de red");
    }
  };

  // =============================
  // PASO 3 → Crear Password
  // =============================
  const crearPassword = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const resp = await fetch(`${API_URL}/api/crear-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni, password }),
      });

      const data = await resp.json();

      if (!resp.ok || !data.ok) {
        setError(data.error || "No se pudo crear la cuenta");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.user));

      navigate("/portal");

    } catch (err) {
      setError("Error de red");
    }
  };

  // =============================
  // UI
  // =============================
  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">

        <h1 className="text-2xl font-bold text-center text-[#A63A3A] mb-6">
          Acceso al Portal de Pacientes
        </h1>

        {/* ========= PASO 1 → DNI ========= */}
        {step === 1 && (
          <form onSubmit={verificarDni} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1">DNI</label>

              <input
                ref={inputRef}
                type="text"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2
                focus:outline-none focus:ring-2 focus:ring-[#A63A3A]"
                required
              />
            </div>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#A63A3A] text-white py-2 rounded-md font-semibold hover:bg-[#8F2F2F] transition"
            >
              Continuar
            </button>
          </form>
        )}

        {/* ========= PASO 2 → PASSWORD ========= */}
        {step === 2 && (
          <form onSubmit={login} className="space-y-5">

            <p className="text-center text-gray-700">
              Usuario encontrado. Ingrese su contraseña.
            </p>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Contraseña</label>

              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A63A3A]"
                required
              />
            </div>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#A63A3A] text-white py-2 rounded-md font-semibold hover:bg-[#8F2F2F] transition"
            >
              Ingresar
            </button>

            <button
              type="button"
              className="text-sm mt-2 underline text-gray-600 w-full"
              onClick={resetAll}
            >
              Volver atrás
            </button>
          </form>
        )}

        {/* ========= PASO 3 → CREAR PASSWORD ========= */}
        {step === 3 && (
          <form onSubmit={crearPassword} className="space-y-5">

            <p className="text-center text-gray-700">
              Bienvenido. Cree una contraseña para continuar.
            </p>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Crear contraseña</label>

              <input
                ref={inputRef}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2
                focus:outline-none focus:ring-2 focus:ring-[#A63A3A]"
                required
              />
            </div>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[#A63A3A] text-white py-2 rounded-md font-semibold hover:bg-[#8F2F2F] transition"
            >
              Crear cuenta y entrar
            </button>

            <button
              type="button"
              className="text-sm mt-2 underline text-gray-600 w-full"
              onClick={resetAll}
            >
              Volver atrás
            </button>
          </form>
        )}

      </div>
    </section>
  );
}
