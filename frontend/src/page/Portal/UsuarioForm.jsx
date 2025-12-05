import React, { useState, useEffect } from "react";
import ModalUsuario from "../../components/Portal/ModalUsuario";
import { UsuariosAPI } from "../../../api/UsuariosAPI";

export default function UsuarioForm({ open, onClose, usuario, onSaved }) {
  const isEdit = !!usuario?.id;

  const [form, setForm] = useState({
    dni: "",
    nombre: "",
    apellido: "",
    fecha_nac: "",
    nro_historia: "",
    rol: "paciente",
    password: "",
  });

  const [loadingDni, setLoadingDni] = useState(false);
  const [dniStatus, setDniStatus] = useState(null);
  const [allowPassword, setAllowPassword] = useState(false);

  // ============================
  // CARGAR DATOS SI EDITA
  // ============================
  useEffect(() => {
    if (isEdit && usuario) {
      setForm({
        dni: usuario.dni,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        fecha_nac: usuario.fecha_nac || "",
        nro_historia: usuario.nro_historia || "",
        rol: usuario.rol || "paciente",
        password: "",
      });
      setDniStatus("edit");
      setAllowPassword(true);
    }
  }, [usuario]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ============================
  // VALIDAR DNI
  // ============================
  const validarDni = async () => {
    if (!form.dni || form.dni.length < 6) {
      toast.error("DNI inválido.");
      setDniStatus("invalid");
      return;
    }

    setLoadingDni(true);
    setDniStatus("checking");

    const data = await UsuariosAPI.buscarAvanzado(form.dni);

    setLoadingDni(false);

    if (!data.ok && data.error) {
      toast.error("El DNI no pertenece a un paciente registrado.");
      setDniStatus("no-paciente");
      return;
    }

    if (!data.existe_mysql && data.existe_dbf) {
      toast.success("Paciente encontrado en el laboratorio. Datos completados.");
      setForm((f) => ({
        ...f,
        nombre: data.usuario.nombre,
        apellido: data.usuario.apellido,
        fecha_nac: data.usuario.fecha_nac,
        nro_historia: data.usuario.nro_historia,
      }));
      setDniStatus("nuevo");
      setAllowPassword(true);
      return;
    }

    if (data.existe_mysql) {
      toast("El usuario ya está registrado. Puedes editarlo.", {
        icon: "ℹ️",
      });
      setForm((f) => ({
        ...f,
        nombre: data.usuario.nombre,
        apellido: data.usuario.apellido,
        fecha_nac: data.usuario.fecha_nac,
        nro_historia: data.usuario.nro_historia,
        rol: data.usuario.rol,
      }));
      setDniStatus("registrado");
      setAllowPassword(true);
      return;
    }
  };

  // ============================
  // SUBMIT
  // ============================
  const submit = async (e) => {
    e.preventDefault();

    if (!isEdit) {
      if (!dniStatus || dniStatus === "checking") {
        return toast.error("Primero debe validar el DNI.");
      }
      if (dniStatus === "no-paciente") {
        return toast.error("DNI no válido para registro.");
      }
      if (allowPassword && form.password.trim() === "") {
        return toast.error("Debe ingresar una contraseña.");
      }
    }

    let data = isEdit
      ? await UsuariosAPI.update(usuario.id, form)
      : await UsuariosAPI.create(form);

    if (data.ok) {
      toast.success(isEdit ? "Usuario actualizado" : "Usuario creado");
      onSaved();
      onClose();
    } else {
      toast.error(data.error || "Error al guardar");
    }
  };

  // ============================
  // RENDER
  // ============================
  return (
    <ModalUsuario open={open} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4">
        {isEdit ? "Editar Usuario" : "Crear Usuario"}
      </h2>

      <form onSubmit={submit} className="space-y-3">

        {/* DNI */}
        <div>
          <label className="font-medium">DNI</label>
          <div className="flex gap-2">
            <input
              name="dni"
              value={form.dni}
              onChange={handleChange}
              disabled={isEdit}
              required
              className="border p-2 rounded w-full"
            />

            {!isEdit && (
              <>
                <button
                  type="button"
                  onClick={validarDni}
                  className="bg-blue-600 text-white px-3 rounded"
                >
                  {loadingDni ? "..." : "Validar"}
                </button>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="bg-gray-600 text-white px-3 rounded"
                >
                  Limpiar
                </button>
              </>
            )}
          </div>
        </div>

        {/* CAMPOS */}
        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />

        <input
          name="apellido"
          placeholder="Apellido"
          value={form.apellido}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />

        <input
          type="date"
          name="fecha_nac"
          value={form.fecha_nac}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <input
          name="nro_historia"
          placeholder="Nro Historia"
          value={form.nro_historia}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <select
          name="rol"
          value={form.rol}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="paciente">Paciente</option>
          <option value="admin">Administrador</option>
        </select>

        {allowPassword && (
          <input
            name="password"
            type="password"
            placeholder={isEdit ? "Nueva contraseña (opcional)" : "Contraseña"}
            value={form.password}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-400 text-white"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded bg-green-600 text-white"
          >
            {isEdit ? "Guardar" : "Crear"}
          </button>
        </div>

      </form>
    </ModalUsuario>
  );
}
