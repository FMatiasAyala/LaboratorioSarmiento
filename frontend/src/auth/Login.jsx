import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1); // 1 = DNI | 2 = password | 3 = crear password | 99 = registrarte
  const [error, setError] = useState("");

  // Registro por email
  const [modalEmail, setModalEmail] = useState(false);
  const [modalToken, setModalToken] = useState(false);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

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
        setStep(2); // Pedir contraseña
      } else {
        // Mostrar botón REGISTRARME
        setStep(99);
      }

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

  // ============================================================
  // PASO REGISTRO — ENVIAR EMAIL
  // ============================================================
  const enviarEmail = async () => {
    setLoading(true);
    setError("");

    try {
      const resp = await fetch(`${API_URL}/api/enviar-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni, email }),
      });

      const data = await resp.json();
      setLoading(false);

      if (!data.ok) return setError(data.error);

      // Abrir modal token
      setModalEmail(false);
      setModalToken(true);

    } catch {
      setLoading(false);
      setError("No se pudo enviar el correo");
    }
  };

  // ============================================================
  // PASO REGISTRO — VALIDAR TOKEN
  // ============================================================
  const validarToken = async () => {
    setLoading(true);
    setError("");

    try {
      const resp = await fetch(`${API_URL}/api/validar-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni, token }),
      });

      const data = await resp.json();
      setLoading(false);

      if (!data.ok) return setError(data.error);

      setModalToken(false);
      setStep(3); // Crear contraseña

    } catch {
      setLoading(false);
      setError("Error verificando token");
    }
  };

  // ============================================================
  // PASO 3 — CREAR PASSWORD
  // ============================================================
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

      if (!data.ok) return setError(data.error);

      loginContext(data.user, data.token);
      navigate("/portal");

    } catch {
      setError("Error creando cuenta");
    }
  };

  // ============================================================
  // UI
  // ============================================================
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
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate("/autoregistro")}
                className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300"
              >
                Registrarme
              </button>
            </div>
          </form>
        )}

        {/* ========== PASO 99 — MOSTRAR REGISTRARME ========== */}
        {step === 99 && (
          <div className="text-center space-y-4">
            <p className="text-gray-600">No encontramos una cuenta asociada.</p>

            <button
              onClick={() => setModalEmail(true)}
              className="w-full bg-[#A63A3A] text-white py-2 rounded-md font-semibold hover:bg-[#8F2F2F]"
            >
              Registrarme
            </button>

            <button
              className="underline text-gray-600"
              onClick={() => setStep(1)}
            >
              Volver
            </button>
          </div>
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

        {/* ========== PASO 3 — CREAR PASSWORD ========== */}
        {step === 3 && (
          <form onSubmit={crearPassword} className="space-y-5">
            <p className="text-gray-700 text-center">
              Cree una contraseña para finalizar el registro.
            </p>

            <input
              ref={inputRef}
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 
              focus:outline-none focus:ring-2 focus:ring-[#A63A3A]"
            />

            {error && <p className="text-red-600 text-center text-sm">{error}</p>}

            <button className="w-full bg-[#A63A3A] text-white py-2 rounded-md font-semibold hover:bg-[#8F2F2F] transition">
              Crear cuenta
            </button>
          </form>
        )}
      </div>

      {/* ========== MODAL EMAIL ========== */}
      <Modal open={modalEmail} onClose={() => setModalEmail(false)} title="Ingrese su email">
        <input
          className="border p-2 rounded w-full"
          type="email"
          placeholder="tuemail@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        <button
          onClick={enviarEmail}
          className="w-full bg-[#A63A3A] text-white py-2 rounded-md mt-4"
        >
          {loading ? "Enviando..." : "Enviar código"}
        </button>
      </Modal>

      {/* ========== MODAL TOKEN ========== */}
      <Modal open={modalToken} onClose={() => setModalToken(false)} title="Ingrese el código recibido">
        <input
          className="border p-2 rounded w-full"
          type="text"
          placeholder="Código"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        <button
          onClick={validarToken}
          className="w-full bg-[#A63A3A] text-white py-2 rounded-md mt-4"
        >
          {loading ? "Validando..." : "Validar código"}
        </button>
      </Modal>

    </section>
  );
}
