import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const { login: loginContext } = useAuth(); // ⬅ usamos el contexto
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1); // 1 = DNI | 2 = password | 3 = crear password
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const inputRef = useRef(null);

  // ======== Auto focus en cada step ========
  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  // ======== Helpers ========
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

  // ========================================
  // PASO 1 → Verificar DNI
  // ========================================
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

      if (data.existe_mysql) {
        resetPassword();
        setStep(2); // pedir contraseña
      } else if (data.existe_dbf) {
        resetPassword();
        setStep(3); // crear contraseña
      }

    } catch (err) {
      setError("No se pudo conectar al servidor");
    }
  };

  // ========================================
  // PASO 2 → Login normal
  // ========================================
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

      // Usamos el AUTH CONTEXT
      loginContext(data.user, data.token);

      navigate("/portal");

    } catch (err) {
      setError("Error de red");
    }
  };

  // ========================================
  // PASO 3 → Crear contraseña
  // ========================================
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

      // Guardamos en AuthContext
      loginContext(data.user, data.token);

      navigate("/portal");

    } catch (err) {
      setError("Error de red");
    }
  };

  // ========================================
  // UI
  // ========================================
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
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A63A3A]"
                required
              />
            </div>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <button className="w-full bg-[#A63A3A] text-white py-2 rounded-md font-semibold hover:bg-[#8F2F2F] transition">
              Continuar
            </button>
          </form>
        )}

        {/* ========= PASO 2 → PASSWORD ========= */}
        {step === 2 && (
          <form onSubmit={login} className="space-y-5">
            <p className="text-center text-gray-700">Ingrese su contraseña.</p>

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

            <button className="w-full bg-[#A63A3A] text-white py-2 rounded-md font-semibold hover:bg-[#8F2F2F] transition">
              Ingresar
            </button>

            <button type="button" onClick={resetAll} className="text-sm mt-2 underline text-gray-600 w-full">
              Volver atrás
            </button>
          </form>
        )}

        {/* ========= PASO 3 → CREAR PASSWORD ========= */}
        {step === 3 && (
          <form onSubmit={crearPassword} className="space-y-5">
            <p className="text-center text-gray-700">Cree una contraseña.</p>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Contraseña nueva</label>
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

            <button className="w-full bg-[#A63A3A] text-white py-2 rounded-md font-semibold hover:bg-[#8F2F2F] transition">
              Crear cuenta y entrar
            </button>

            <button type="button" onClick={resetAll} className="text-sm mt-2 underline text-gray-600 w-full">
              Volver atrás
            </button>
          </form>
        )}

      </div>
    </section>
  );
}
