import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export default function AutoRegistroConfirmar() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useParams();

  const [email, setEmail] = useState(null);
  const [dni, setDni] = useState(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const maskDni = (dni) => {
    if (!dni) return "";
    return dni.slice(0, dni.length - 2) + "**";
  };
  const maskMail = (email) => {
    if (!email) return ""; 
    const [user, domain] = email.split("@");
    const maskedUser = user[0] + "***" + user.slice(-1);
    return maskedUser + "@" + domain;
  };

  useEffect(() => {
    const validar = async () => {
      const resp = await fetch(`${API_URL}/api/confirmar/${token}`);
      const data = await resp.json();

      if (!data.ok) {
        toast.error(data.error || "Token inválido");
        setLoading(false);
        return;
      }
      setEmail(data.email);
      setDni(data.dni);
      setLoading(false);
    };

    validar();
  }, [token]);

  const finalizar = async () => {
    if (password.length < 6) {
      return toast.error("La contraseña debe tener al menos 6 caracteres.");
    }

    if (password !== password2) {
      return toast.error("Las contraseñas no coinciden.");
    }

    const resp = await fetch(`${API_URL}/api/finalizar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await resp.json();

    if (!data.ok) {
      return toast.error(data.error || "No se pudo completar el registro.");
    }

    toast.success("Registro completado. Ya puede iniciar sesión.");
    navigate("/portal/login");
  };

  if (loading) {
    return <p className="text-center mt-20">Validando enlace...</p>;
  }

  if (!dni) {
    return (
      <p className="text-center mt-20 text-red-600">
        Token inválido o expirado.
      </p>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white shadow p-6 rounded">
      <h1 className="text-xl font-bold mb-4 text-center">Crear Contraseña</h1>

      <p className="text-gray-700 mb-4">
        E-MAIL asociado: <strong>{maskMail(email)}</strong>
        DNI asociado: <strong>{maskDni(dni)}</strong>
      </p>

      <input
        type="password"
        placeholder="Nueva contraseña"
        className="border p-2 rounded w-full mb-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Repetir contraseña"
        className="border p-2 rounded w-full mb-4"
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
      />

      <button
        onClick={finalizar}
        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
      >
        Crear Cuenta
      </button>
    </div>
  );
}
