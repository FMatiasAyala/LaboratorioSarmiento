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
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-[#A63A3A] mb-6">Mi Cuenta</h1>

      {/* ===================================================== */}
      {/* DATOS PERSONALES */}
      {/* ===================================================== */}
      <div className="bg-white shadow rounded-lg p-6 border border-gray-200 mb-10">
        <h2 className="text-xl font-semibold mb-4 text-[#A63A3A]">Datos personales</h2>

        <form onSubmit={guardarPerfil} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div className="col-span-2">
            <label className="text-sm font-medium">DNI (no editable)</label>
            <input
              className="w-full border p-2 rounded bg-gray-100"
              value={perfil.dni}
              disabled
            />
          </div>

          <div>
            <label className="text-sm font-medium">Nombre</label>
            <input
              className="w-full border p-2 rounded"
              value={perfil.nombre}
              onChange={(e) => setPerfil({ ...perfil, nombre: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Apellido</label>
            <input
              className="w-full border p-2 rounded"
              value={perfil.apellido}
              onChange={(e) => setPerfil({ ...perfil, apellido: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              className="w-full border p-2 rounded"
              value={perfil.email || ""}
              onChange={(e) => setPerfil({ ...perfil, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Teléfono</label>
            <input
              className="w-full border p-2 rounded"
              value={perfil.telefono || ""}
              onChange={(e) => setPerfil({ ...perfil, telefono: e.target.value })}
            />
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              className="bg-[#A63A3A] text-white px-6 py-2 rounded-lg hover:bg-[#8F2F2F] transition mt-3"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>

      {/* ===================================================== */}
      {/* CAMBIAR CONTRASEÑA */}
      {/* ===================================================== */}
      <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-[#A63A3A]">Cambiar contraseña</h2>

        <form onSubmit={cambiarPassword} className="space-y-4">

          <div>
            <label className="text-sm font-medium">Contraseña actual</label>
            <input
              type="password"
              className="w-full border p-2 rounded"
              value={passwordForm.oldPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Nueva contraseña</label>
            <input
              type="password"
              className="w-full border p-2 rounded"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, newPassword: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Repetir nueva contraseña</label>
            <input
              type="password"
              className="w-full border p-2 rounded"
              value={passwordForm.repeatPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, repeatPassword: e.target.value })
              }
              required
            />
          </div>

          <button
            type="submit"
            className="bg-[#A63A3A] text-white px-6 py-2 rounded-lg hover:bg-[#8F2F2F] transition"
          >
            Actualizar contraseña
          </button>
        </form>
      </div>
    </div>
  );
}
