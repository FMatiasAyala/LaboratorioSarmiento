import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export default function Perfil() {
    const { usuario, token, loginContext } = useAuth();

    const [loading, setLoading] = useState(true);
    const [perfil, setPerfil] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        fecha_nac: "",
        dni: "",
    });

    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
        repeatPassword: "",
    });

    // ============================================================
    // Cargar datos al entrar
    // ============================================================
    useEffect(() => {
        cargarPerfil();
    }, []);

    const cargarPerfil = async () => {
        setLoading(true);

        const resp = await fetch(`${API_URL}/api/mi-perfil`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await resp.json();
        setLoading(false);

        if (!data.ok) {
            toast.error("Error cargando perfil");
            return;
        }

        setPerfil(data.user);
    };

    // ============================================================
    // Guardar datos personales
    // ============================================================
    const guardarPerfil = async (e) => {
        e.preventDefault();

        const resp = await fetch(`${API_URL}/api/mi-perfil`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(perfil),
        });

        const data = await resp.json();

        if (!data.ok) {
            toast.error(data.error || "Error actualizando perfil");
            return;
        }

        toast.success("Perfil actualizado");
    };

    // ============================================================
    // Cambiar contraseña
    // ============================================================
    const cambiarPassword = async (e) => {
        e.preventDefault();

        if (passwordForm.newPassword !== passwordForm.repeatPassword) {
            return toast.error("Las contraseñas no coinciden");
        }

        const resp = await fetch(`${API_URL}/api/mi-perfil/password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(passwordForm),
        });

        const data = await resp.json();

        if (!data.ok) {
            toast.error(data.error || "Error cambiando contraseña");
            return;
        }

        toast.success("Contraseña actualizada correctamente");

        setPasswordForm({
            oldPassword: "",
            newPassword: "",
            repeatPassword: "",
        });
    };

    // ============================================================
    // Render
    // ============================================================
    if (loading) {
        return <p className="text-center py-10 text-gray-600">Cargando perfil...</p>;
    }

    return (
        <div className="w-full space-y-8">

            {/* TÍTULO */}
            <h1 className="text-2xl sm:text-3xl font-bold text-[#A63A3A] mb-8">
                Mi Cuenta
            </h1>

            {/* ================= DATOS PERSONALES ================= */}
            <section className="bg-white rounded-2xl shadow border border-gray-200 mb-10">
                <div className="border-b px-6 py-4">
                    <h2 className="text-lg font-semibold text-[#A63A3A]">
                        Datos personales
                    </h2>
                    <p className="text-sm text-gray-600">
                        Actualizá tu información de contacto
                    </p>
                </div>

                <form
                    onSubmit={guardarPerfil}
                    className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    {/* DNI */}
                    <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">
                            DNI
                        </label>
                        <input
                            className="w-full mt-1 rounded-lg border bg-gray-100 px-3 py-2 text-gray-600"
                            value={perfil.dni}
                            disabled
                        />
                    </div>

                    {/* Nombre */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Nombre
                        </label>
                        <input
                            className="w-full mt-1 rounded-lg border px-3 py-2
            focus:outline-none focus:ring-2 focus:ring-[#A63A3A]"
                            value={perfil.nombre}
                            onChange={(e) =>
                                setPerfil({ ...perfil, nombre: e.target.value })
                            }
                        />
                    </div>

                    {/* Apellido */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Apellido
                        </label>
                        <input
                            className="w-full mt-1 rounded-lg border px-3 py-2
            focus:outline-none focus:ring-2 focus:ring-[#A63A3A]"
                            value={perfil.apellido}
                            onChange={(e) =>
                                setPerfil({ ...perfil, apellido: e.target.value })
                            }
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full mt-1 rounded-lg border px-3 py-2
            focus:outline-none focus:ring-2 focus:ring-[#A63A3A]"
                            value={perfil.email || ""}
                            onChange={(e) =>
                                setPerfil({ ...perfil, email: e.target.value })
                            }
                        />
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Teléfono
                        </label>
                        <input
                            className="w-full mt-1 rounded-lg border px-3 py-2
            focus:outline-none focus:ring-2 focus:ring-[#A63A3A]"
                            value={perfil.telefono || ""}
                            onChange={(e) =>
                                setPerfil({ ...perfil, telefono: e.target.value })
                            }
                        />
                    </div>

                    {/* BOTÓN */}
                    <div className="md:col-span-2 flex justify-end pt-4">
                        <button
                            type="submit"
                            className="bg-[#A63A3A] text-white px-6 py-2 rounded-lg
            hover:bg-[#8F2F2F] transition"
                        >
                            Guardar cambios
                        </button>
                    </div>
                </form>
            </section>

            {/* ================= CAMBIAR CONTRASEÑA ================= */}
            <section className="bg-white rounded-2xl shadow border border-gray-200">
                <div className="border-b px-6 py-4">
                    <h2 className="text-lg font-semibold text-[#A63A3A]">
                        Seguridad
                    </h2>
                    <p className="text-sm text-gray-600">
                        Cambiá tu contraseña de acceso
                    </p>
                </div>

                <form
                    onSubmit={cambiarPassword}
                    className="px-6 py-6 space-y-4"
                >
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Contraseña actual
                        </label>
                        <input
                            type="password"
                            className="w-full mt-1 rounded-lg border px-3 py-2
            focus:outline-none focus:ring-2 focus:ring-[#A63A3A]"
                            value={passwordForm.oldPassword}
                            onChange={(e) =>
                                setPasswordForm({
                                    ...passwordForm,
                                    oldPassword: e.target.value,
                                })
                            }
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Nueva contraseña
                        </label>
                        <input
                            type="password"
                            className="w-full mt-1 rounded-lg border px-3 py-2
            focus:outline-none focus:ring-2 focus:ring-[#A63A3A]"
                            value={passwordForm.newPassword}
                            onChange={(e) =>
                                setPasswordForm({
                                    ...passwordForm,
                                    newPassword: e.target.value,
                                })
                            }
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Repetir nueva contraseña
                        </label>
                        <input
                            type="password"
                            className="w-full mt-1 rounded-lg border px-3 py-2
            focus:outline-none focus:ring-2 focus:ring-[#A63A3A]"
                            value={passwordForm.repeatPassword}
                            onChange={(e) =>
                                setPasswordForm({
                                    ...passwordForm,
                                    repeatPassword: e.target.value,
                                })
                            }
                            required
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="bg-[#A63A3A] text-white px-6 py-2 rounded-lg
            hover:bg-[#8F2F2F] transition"
                        >
                            Actualizar contraseña
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );

}
