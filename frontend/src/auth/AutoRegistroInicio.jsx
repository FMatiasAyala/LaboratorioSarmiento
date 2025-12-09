import React, { useState } from "react";
import toast from "react-hot-toast";
import LoadingModal from "../components/Portal/LoadingModal";

const API_URL = import.meta.env.VITE_API_URL;

export default function AutoRegistroInicio() {
  const [dni, setDni] = useState("");
  const [acepta, setAcepta] = useState(false);
  const [loading, setLoading] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();

    if (!dni || dni.length < 6) {
      return toast.error("Ingrese un DNI válido.");
    }

    if (!acepta) {
      return toast.error("Debe aceptar los términos y condiciones.");
    }

    setLoading(true);

    try {
      const resp = await fetch(`${API_URL}/api/iniciar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni, acepta }),
      });

      const data = await resp.json();
      setLoading(false);

      if (!data.ok) return toast.error(data.error || "No se pudo iniciar el registro.");

      toast.success("Correo enviado. Revise su casilla.");
      window.location.href = "/autoregistro/confirmar";

    } catch (err) {
      setLoading(false);
      toast.error("Error de red. Intente más tarde.");
      console.error(err);
    }
  };

  return (
    <>
      {/* 🔥 Modal de carga */}
      <LoadingModal open={loading} mensaje="Enviando correo..." />

      <div className="max-w-md mx-auto mt-16 bg-white shadow-lg p-6 rounded-lg">

        <h1 className="text-2xl font-bold mb-4 text-center text-[#A63A3A]">
          Auto Registro de Pacientes
        </h1>

        <p className="text-gray-700 mb-4">
          Ingrese su DNI para comenzar el proceso de creación de cuenta.
        </p>

        <form className="space-y-4" onSubmit={enviar}>
          
          <div>
            <label className="font-medium">DNI</label>
            <input
              type="text"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              className="border rounded w-full p-2"
              placeholder="Ej: 12345678"
            />
          </div>

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={acepta}
              onChange={(e) => setAcepta(e.target.checked)}
            />
            <span className="text-gray-700">
              Acepto los <b>términos y condiciones</b> del servicio.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#A63A3A] text-white py-2 rounded mt-4 hover:bg-[#8F2F2F] transition disabled:opacity-50"
          >
            Continuar
          </button>

        </form>
      </div>
    </>
  );
}
