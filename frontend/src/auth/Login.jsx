import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
    const [dni, setDni] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError(""); // limpiar error

        try {
            const resp = await fetch(`${API_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ dni, password })
            });

            const data = await resp.json();

            if (!resp.ok || !data.ok ) {
                setError(data.error || "Error al iniciar sesión");
                return;
            }

            // Guardamos token y usuario
            localStorage.setItem("token", data.token);
            localStorage.setItem("usuario", JSON.stringify(data.user));
            navigate("/portal");

        } catch (err) {
            console.error("Error de red:", err);
            setError("No se pudo conectar con el servidor");
        }
    };

    return (
        <section className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
                <h1 className="text-2xl font-bold text-center text-[#A63A3A] mb-6">
                    Acceso al Portal de Pacientes
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            DNI
                        </label>
                        <input
                            type="text"
                            value={dni}
                            onChange={(e) => setDni(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A63A3A]"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#A63A3A]"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-red-600 text-sm text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-[#A63A3A] text-white py-2 rounded-md font-semibold hover:bg-[#8F2F2F] transition"
                    >
                        Ingresar
                    </button>
                </form>
            </div>
        </section>
    )
}
