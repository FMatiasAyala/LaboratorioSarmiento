import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");


  const navigate = useNavigate();
  const { login: loginContext } = useAuth();

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [step]);

  // ============================================================
  // PASO 1 — VERIFICAR DNI
  // ============================================================
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

      if (!data.ok) {
        setError(data.error || "El DNI no es válido");
        return;
      }

      if (data.existe_mysql) {
        setStep(2); // pedir contraseña
        return;
      }

      // 👉 NO existe → AUTO REGISTRO
      navigate(`/autoregistro?dni=${dni}`);

    } catch (err) {
      setError("No se pudo conectar al servidor");
    }
  };


  // ============================================================
  // PASO 2 — LOGIN
  // ============================================================
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

      if (!data.ok) {
        setError(data.error || "Contraseña incorrecta");
        return;
      }

      loginContext(data.user, data.token);
      navigate("/portal");

    } catch {
      setError("Error de red");
    }
  };



  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">

        <h1 className="text-2xl font-bold text-center text-[#A63A3A] mb-6">
          Acceso al Portal de Pacientes
        </h1>

        {/* ========== PASO 1 — DNI ========== */}
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

            {error && <p className="text-red-600 text-center text-sm">{error}</p>}

            <button className="w-full bg-[#A63A3A] text-white py-2 rounded-md font-semibold hover:bg-[#8F2F2F] transition">
              Continuar
            </button>
          </form>
        )}

        {/* ========== PASO 2 — LOGIN ========== */}
        {step === 2 && (
          <form onSubmit={login} className="space-y-5">

            <p className="text-gray-700 text-center">Ingrese su contraseña.</p>

            <div>
              <input
                ref={inputRef}
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 
                focus:outline-none focus:ring-2 focus:ring-[#A63A3A]"
              />
            </div>

            {error && <p className="text-red-600 text-center text-sm">{error}</p>}

            <button className="w-full bg-[#A63A3A] text-white py-2 rounded-md font-semibold hover:bg-[#8F2F2F] transition">
              Ingresar
            </button>

            <button
              type="button"
              className="underline text-gray-600 w-full mt-2"
              onClick={() => setStep(1)}
            >
              Volver atrás
            </button>

          </form>
        )}
      </div>
    </section>
  );
}
