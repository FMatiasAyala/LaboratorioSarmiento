import React, { useState, useEffect } from "react";
import { UsuariosAPI } from "../../../api/UsuariosAPI";
import { FaTimes } from "react-icons/fa";

export default function UsuarioForm({ usuario, onClose, onSaved }) {
  const isEdit = !!usuario.id;

  const [form, setForm] = useState({
    dni: "",
    nombre: "",
    apellido: "",
    fecha_nac: "",
    nro_historia: "",
    rol: "paciente",
    password: "",
  });

  useEffect(() => {
    if (isEdit) {
      setForm({
        dni: usuario.dni || "",
        nombre: usuario.nombre || "",
        apellido: usuario.apellido || "",
        fecha_nac: usuario.fecha_nac || "",
        nro_historia: usuario.nro_historia || "",
        rol: usuario.rol || "paciente",
        password: "",
      });
    }
  }, [usuario]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (isEdit) {
      const data = await UsuariosAPI.update(usuario.id, form);
      if (data.ok) {
        alert("Usuario actualizado correctamente");
        onSaved();
      } else {
        alert(data.error || "Error al actualizar");
      }
    } else {
      if (!form.password) return alert("La contraseña es obligatoria");

      const data = await UsuariosAPI.create(form);
      if (data.ok) {
        alert("Usuario creado correctamente");
        onSaved();
      } else {
        alert(data.error || "Error creando usuario");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative">

        {/* BOTÓN CERRAR */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        >
          <FaTimes size={20} />
        </button>

        {/* TÍTULO */}
        <h2 className="text-2xl font-bold text-[#A63A3A] mb-5">
          {isEdit ? "Editar Usuario" : "Crear Usuario"}
        </h2>

        <form onSubmit={submit} className="space-y-4">

          {/* DNI */}
          <div>
            <label className="block text-sm font-medium mb-1">DNI</label>
            <input
              name="dni"
              value={form.dni}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#A63A3A]"
              required
            />
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#A63A3A]"
              required
            />
          </div>

          {/* Apellido */}
          <div>
            <label className="block text-sm font-medium mb-1">Apellido</label>
            <input
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#A63A3A]"
              required
            />
          </div>

          {/* Fecha de nacimiento */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Fecha de Nacimiento
            </label>
            <input
              name="fecha_nac"
              type="date"
              value={form.fecha_nac}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#A63A3A]"
            />
          </div>

          {/* Número de historia */}
          <div>
            <label className="block text-sm font-medium mb-1">Nro Historia</label>
            <input
              name="nro_historia"
              value={form.nro_historia}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#A63A3A]"
            />
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm font-medium mb-1">Rol</label>
            <select
              name="rol"
              value={form.rol}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#A63A3A]"
            >
              <option value="paciente">Paciente</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          {/* Contraseña solo al crear */}
          {!isEdit && (
            <div>
              <label className="block text-sm font-medium mb-1">Contraseña</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-[#A63A3A]"
                required
              />
            </div>
          )}

          {/* BOTONES */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-[#A63A3A] text-white rounded-md hover:bg-[#8F2F2F] transition"
            >
              {isEdit ? "Guardar cambios" : "Crear usuario"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
