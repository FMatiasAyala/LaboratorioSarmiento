import React, { useState, useEffect } from "react";
import ModalUsuario from "../../components/Portal/ModalUsuario";
import { UsuariosAPI } from "../../../api/UsuariosAPI";
import toast from "react-hot-toast";

export default function UsuarioForm({ open, onClose, usuario, onSaved }) {
  const isEdit = !!usuario?.id;
  const [modo, setModo] = useState("crear");


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
        fecha_nac: usuario.fecha_nac
          ? usuario.fecha_nac.split("T")[0]
          : "",
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
      setModo("invalido");
      return;
    }

    setLoadingDni(true);
    setDniStatus("checking");

    const data = await UsuariosAPI.buscarAvanzado(form.dni);
    setLoadingDni(false);

    if (!data || data.ok === false) {
      toast.error(data?.error || "Error validando DNI.");
      setModo("invalido");
      return;
    }

    // 👉 NUEVO usuario
    if (!data.existe_mysql && data.existe_dbf) {
      toast.success("Paciente encontrado. Datos importados.");
      setModo("crear");
      setForm((f) => ({
        ...f,
        nombre: data.usuario?.nombre || "",
        apellido: data.usuario?.apellido || "",
        fecha_nac: data.usuario?.fecha_nac
          ? new Date(data.usuario.fecha_nac).toISOString().split("T")[0]
          : "",
        nro_historia: data.usuario?.nro_historia || "",
      }));
      setAllowPassword(true);
      setDniStatus("nuevo");
      return;
    }

    // 👉 USUARIO EXISTENTE
    if (data.existe_mysql) {
      toast("El usuario ya está registrado.", { icon: "ℹ️" });
      setModo("editar");
      setForm((f) => ({
        ...f,
        nombre: data.usuario?.nombre || "",
        apellido: data.usuario?.apellido || "",
        fecha_nac: data.usuario?.fecha_nac
          ? new Date(data.usuario.fecha_nac).toISOString().split("T")[0]
          : "",
        nro_historia: data.usuario?.nro_historia || "",
        rol: data.usuario?.rol || "paciente",
      }));
      setAllowPassword(true);
      setDniStatus("registrado");
      return;
    }

    // 👉 DNI NO EXISTE EN NINGUNA DB
    toast.error("Este DNI no pertenece a ningún paciente.");
    setModo("invalido");
    setDniStatus("no-paciente");
  };



  const limpiarDatos = () => {
    setForm({
      dni: "",
      nombre: "",
      apellido: "",
      fecha_nac: "",
      nro_historia: "",
      rol: "paciente",
      password: "",
    });
    setDniStatus(null);
    setAllowPassword(false);
    setModo("crear");
  }

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
    <ModalUsuario open={open}
      onClose={onClose}
      title={isEdit ? "Editar Usuario" : "Crear Usuario"}>
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
                  onClick={limpiarDatos}
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
            disabled={modo === "invalido"}
            className={`px-4 py-2 rounded text-white ${modo === "invalido"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
              }`}
          >
            {isEdit
              ? "Guardar"
              : modo === "editar"
                ? "Editar"
                : modo === "crear"
                  ? "Crear"
                  : "..."}
          </button>

        </div>

      </form>
    </ModalUsuario>
  );
}
