import React, { useState, useEffect } from "react";
import { UsuariosAPI } from "../../../api/UsuariosAPI";

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

  const [loadingDni, setLoadingDni] = useState(false);
  const [dniStatus, setDniStatus] = useState(null); // mensaje resumen
  const [allowEditPassword, setAllowEditPassword] = useState(false);

  // ============================
  // SI ES EDICIÓN → CARGA DIRECTA
  // ============================
  useEffect(() => {
    if (isEdit) {
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
    }
  }, [usuario]);

  // ============================
  // HANDLER DE CAMBIO
  // ============================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (e.target.name === "dni" && !isEdit) {
      setDniStatus(null);
      triggerDniCheck(e.target.value);
    }
  };

  // ============================
  // CHEQUEAR DNI AUTOMÁTICAMENTE
  // ============================
  let dniTimer = null;
  const triggerDniCheck = (dni) => {
    if (!dni || dni.length < 6) return;

    clearTimeout(dniTimer);
    dniTimer = setTimeout(() => verificarDni(dni), 600);
  };

  const verificarDni = async (dni) => {
    setLoadingDni(true);
    setDniStatus("checking");

    const data = await UsuariosAPI.buscarAvanzado(dni);

    setLoadingDni(false);

    // ❌ NO ES PACIENTE
    if (!data.ok && data.error) {
      setDniStatus("no-paciente");
      return;
    }

    // 🟢 PACIENTE EXISTE EN LAB Y NO REGISTRADO EN MYSQL
    if (!data.existe_mysql && data.existe_dbf) {
      setForm((f) => ({
        ...f,
        dni,
        nombre: data.usuario.nombre,
        apellido: data.usuario.apellido,
        fecha_nac: data.usuario.fecha_nac,
        nro_historia: data.usuario.nro_historia,
      }));
      setDniStatus("nuevo");
      setAllowEditPassword(true);
      return;
    }

    // 🟡 USUARIO YA REGISTRADO
    if (data.existe_mysql) {
      setForm((f) => ({
        ...f,
        dni,
        nombre: data.usuario.nombre,
        apellido: data.usuario.apellido,
        fecha_nac: data.usuario.fecha_nac,
        nro_historia: data.usuario.nro_historia,
        rol: data.usuario.rol,
      }));
      setDniStatus("registrado");
      setAllowEditPassword(true);
      return;
    }
  };

  // ============================
  // SUBMIT
  // ============================
  const submit = async (e) => {
    e.preventDefault();

    if (!isEdit && dniStatus === "no-paciente") {
      alert("El DNI no pertenece a un paciente del laboratorio.");
      return;
    }

    if (!isEdit && !allowEditPassword) {
      alert("Debe generar contraseña para registrar este usuario.");
      return;
    }

    if (!isEdit && form.password.trim() === "") {
      alert("La contraseña es obligatoria.");
      return;
    }

    let data;
    if (isEdit) {
      data = await UsuariosAPI.update(usuario.id, form);
    } else {
      data = await UsuariosAPI.create(form);
    }

    if (data.ok) {
      alert(isEdit ? "Usuario actualizado" : "Usuario creado");
      onSaved();
    } else {
      alert(data.error || "Error al guardar");
    }
  };

  // ============================
  // UI DE ESTADO DE DNI
  // ============================
  const renderDniStatus = () => {
    if (loadingDni) return <p className="text-blue-600">🔍 Chequeando paciente...</p>;

    switch (dniStatus) {
      case "no-paciente":
        return <p className="text-red-600">❌ El DNI NO pertenece a ningún paciente.</p>;
      case "nuevo":
        return <p className="text-green-700">🟢 Paciente encontrado. Completado automáticamente.</p>;
      case "registrado":
        return <p className="text-orange-600">🟡 Usuario ya registrado, completado desde MySQL.</p>;
      default:
        return null;
    }
  };

  // ============================
  // FORMULARIO
  // ============================
  return (
    <div style={{ background: "#f5f5f5", padding: 20, marginTop: 20, borderRadius: 10 }}>
      <h2>{isEdit ? "Editar Usuario" : "Crear Usuario"}</h2>

      <form onSubmit={submit} className="space-y-3">

        {/* DNI */}
        <div>
          <label>DNI</label>
          <input
            name="dni"
            value={form.dni}
            onChange={handleChange}
            disabled={isEdit}
            required
            className="border p-2 rounded w-full"
          />
          {renderDniStatus()}
        </div>

        {/* NOMBRE */}
        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />

        {/* APELLIDO */}
        <input
          name="apellido"
          placeholder="Apellido"
          value={form.apellido}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          required
        />

        {/* FECHA NAC */}
        <input
          type="date"
          name="fecha_nac"
          value={form.fecha_nac}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        {/* HISTORIA */}
        <input
          name="nro_historia"
          placeholder="Nro Historia"
          value={form.nro_historia}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        {/* ROL */}
        <select
          name="rol"
          value={form.rol}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="paciente">Paciente</option>
          <option value="admin">Administrador</option>
        </select>

        {/* PASSWORD */}
        {(!isEdit || dniStatus === "registrado") && (
          <input
            name="password"
            type="password"
            placeholder={isEdit ? "Nueva contraseña (opcional)" : "Contraseña"}
            value={form.password}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        )}

        {/* BOTONES */}
        <div className="flex gap-2 mt-3">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            {isEdit ? "Guardar cambios" : "Crear usuario"}
          </button>
          <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">
            Cerrar
          </button>
        </div>

      </form>
    </div>
  );
}
