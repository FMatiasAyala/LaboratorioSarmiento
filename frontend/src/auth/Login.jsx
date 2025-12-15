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
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#A63A3A]/10 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/logos/logo.jpg"
            alt="Laboratorio Clínico"
            className="h-14 object-contain rounded-md"
          />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-center text-[#A63A3A] mb-1">
          Portal de Pacientes
        </h1>
        <p className="text-center text-gray-600 text-sm mb-6">
          Acceda a sus estudios y resultados
        </p>

        {/* ===== PASO 1 ===== */}
        {step === 1 && (
          <form onSubmit={verificarDni} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                DNI
              </label>
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                placeholder="Ingrese su DNI"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5
              focus:outline-none focus:ring-2 focus:ring-[#A63A3A]"
                required
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#A63A3A] text-white py-2.5 rounded-lg font-semibold
            hover:bg-[#8F2F2F] transition"
            >
              Continuar
            </button>
          </form>
        )}

        {/* ===== PASO 2 ===== */}
        {step === 2 && (
          <form onSubmit={login} className="space-y-5">
            <p className="text-gray-700 text-center text-sm">
              Ingrese su contraseña para continuar
            </p>

            <div>
              <input
                ref={inputRef}
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5
              focus:outline-none focus:ring-2 focus:ring-[#A63A3A]"
                required
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#A63A3A] text-white py-2.5 rounded-lg font-semibold
            hover:bg-[#8F2F2F] transition"
            >
              Ingresar
            </button>

            {/* Olvidé contraseña */}
            <button
              type="button"
              className="block w-full text-sm text-[#A63A3A] underline text-center mt-1"
              onClick={() => alert("Funcionalidad en desarrollo")}
            >
              Olvidé mi contraseña
            </button>

            <button
              type="button"
              className="block w-full text-sm text-gray-500 text-center"
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
