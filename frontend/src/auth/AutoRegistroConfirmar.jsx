import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export default function AutoRegistroConfirmar() {
  const navigate = useNavigate();
  const { idPublico } = useParams(); // nuevo nombre de parámetro limpio

  const [dni, setDni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const maskDni = (dni) => {
    if (!dni) return "";
    return dni.slice(0, dni.length - 2) + "**";
  };

  useEffect(() => {
    const validar = async () => {
      const resp = await fetch(`${API_URL}/api/registro/verificar/${idPublico}`);
      const data = await resp.json();

      if (!data.ok) {
        toast.error(data.error || "Token inválido");
        setLoading(false);
        return;
      }

      setDni(data.dni);
      setLoading(false);
    };

    validar();
  }, [idPublico]);

  const finalizar = async () => {
    if (password.length < 6) {
      return toast.error("La contraseña debe tener al menos 6 caracteres.");
    }

    if (password !== password2) {
      return toast.error("Las contraseñas no coinciden.");
    }

    const resp = await fetch(`${API_URL}/api/registro/finalizar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idPublico, password }),
    });

    const data = await resp.json();

    if (!data.ok) {
      return toast.error(data.error || "No se pudo completar el registro.");
    }

    toast.success("Registro completado. Ya puede iniciar sesión.");
    navigate("/portal/login");
  };

  if (loading) {
    return <p className="text-center mt-20 text-gray-600">Validando enlace...</p>;
  }

  if (!dni) {
    return (
      <p className="text-center mt-20 text-red-600 text-lg font-semibold">
        Token inválido o expirado.
      </p>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white shadow-xl p-8 rounded-xl border border-gray-200">
      <h1 className="text-2xl font-bold mb-2 text-center text-[#A63A3A]">
        Crear Contraseña
      </h1>

      <p className="text-gray-600 text-sm mb-4 text-center flex items-center justify-center gap-1">
        <span className="text-blue-600 text-lg">ℹ️</span>
        La contraseña debe tener <strong>al menos 6 caracteres</strong>.
      </p>

      <p className="text-gray-700 mb-6 text-center">
        DNI asociado: <span className="font-semibold">{maskDni(dni)}</span>
      </p>


      <div className="space-y-4">

        {/* --- Campo 1: Nueva contraseña --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nueva contraseña
          </label>

          <input
            type="password"
            placeholder="Ingrese una contraseña"
            className={`border p-3 rounded-lg w-full focus:outline-none transition
        ${password.length === 0 ? "border-gray-300" :
                password.length < 6 ? "border-red-500" : "border-green-600"}
      `}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Validación dinámica */}
          {password.length > 0 && password.length < 6 && (
            <p className="text-red-500 text-sm mt-1">
              La contraseña debe tener al menos 6 caracteres.
            </p>
          )}
        </div>

        {/* --- Campo 2: Repetir contraseña --- */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Repetir contraseña
          </label>

          <input
            type="password"
            placeholder="Repita la contraseña"
            className={`border p-3 rounded-lg w-full focus:outline-none transition
        ${password2.length === 0 ? "border-gray-300" :
                password !== password2 ? "border-red-500" : "border-green-600"}
      `}
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />

          {/* Validación dinámica */}
          {password2.length > 0 && password !== password2 && (
            <p className="text-red-500 text-sm mt-1">
              Las contraseñas no coinciden.
            </p>
          )}
        </div>

        <button
          onClick={finalizar}
          className="w-full bg-[#A63A3A] text-white p-3 rounded-lg hover:bg-[#922f2f] transition font-semibold mt-2"
        >
          Crear Cuenta
        </button>

        <button
          onClick={() => navigate("/portal/login")}
          className="w-full text-gray-600 underline mt-3 text-sm"
        >
          Volver al inicio de sesión
        </button>
      </div>

    </div>
  );
}
