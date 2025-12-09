import React, { useEffect, useState } from "react";
import { UsuariosAPI } from "../../../api/UsuariosAPI";
import UsuarioForm from "./UsuarioForm";
import ModalConfirm from "../../components/Portal/ModalConfirm";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

export default function UsuariosList() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);


  const cargarUsuarios = async () => {
    setLoading(true);
    const data = await UsuariosAPI.getAll();
    if (data.ok) {
      setUsuarios(data.usuarios);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleDelete = async () => {
    const data = await UsuariosAPI.remove(deleteId);
    if (data.ok) {
      toast.success("Usuario eliminado correctamente");
      cargarUsuarios();
    } else {
      toast.error(data.error || "No se pudo eliminar el usuario");
    }
    setDeleteId(null);
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* TÍTULO */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#A63A3A]">Gestión de Usuarios</h1>

        <button
          onClick={() => setSelected({})}
          className="flex items-center gap-2 bg-[#A63A3A] text-white px-4 py-2 rounded-md shadow hover:bg-[#8F2F2F] transition"
        >
          <FaPlus /> Crear Usuario
        </button>
      </div>

      {/* FORMULARIO MODAL */}
      {selected && (
        <UsuarioForm
          open={true}
          usuario={selected}
          onClose={() => setSelected(null)}
          onSaved={() => {
            setSelected(null);
            cargarUsuarios();
          }}
        />
      )}

      {deleteId !== null && (
        <ModalConfirm
          open={true}
          onClose={() => setDeleteId(null)}
          title="Eliminar usuario"
          message="¿Estás seguro que querés eliminar este usuario? Esta acción no se puede deshacer."
          onConfirm={handleDelete}
        />
      )}

      {/* LOADING */}
      {loading ? (
        <div className="text-center py-8 text-gray-600">Cargando usuarios...</div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">DNI</th>
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Apellido</th>
                <th className="px-4 py-2 text-left">Rol</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-2">{u.id}</td>
                  <td className="px-4 py-2">{u.dni}</td>
                  <td className="px-4 py-2">{u.nombre}</td>
                  <td className="px-4 py-2">{u.apellido}</td>
                  <td className="px-4 py-2 capitalize">
                    {u.rol || "paciente"}
                  </td>

                  <td className="px-4 py-2 flex gap-3">
                    <button
                      onClick={() => setSelected(u)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => setDeleteId(u.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}

              {usuarios.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-600">
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
