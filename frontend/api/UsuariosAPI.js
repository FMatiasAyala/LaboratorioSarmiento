const API_URL = import.meta.env.VITE_API_URL;

function getHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export const UsuariosAPI = {
  async getAll() {
    const res = await fetch(`${API_URL}/api/usuarios`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  async getOne(id) {
    const res = await fetch(`${API_URL}/api/usuarios/${id}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  async create(data) {
    const res = await fetch(`${API_URL}/api/usuarios`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async update(id, data) {
    const res = await fetch(`${API_URL}/api/usuarios/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async remove(id) {
    const res = await fetch(`${API_URL}/api/usuarios/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return res.json();
  },
  async buscarAvanzado(dni) {
    const res = await fetch(`${API_URL}/api/usuarios/buscar/${dni}`, {
      headers: getHeaders(),
    });
    return res.json();
  },
  async credencialesPdf(id) {
    const res = await fetch(`${API_URL}/api/usuarios/${id}/credenciales-pdf`, {
      method: "GET",
      headers: getHeaders(),
    });
    return res.blob();
  }

};


