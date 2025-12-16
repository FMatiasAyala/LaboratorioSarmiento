const LAB_API = process.env.LAB_API;
const LAB_KEY = process.env.LAB_KEY;

exports.pacientes = async (req, res) => {
  try {
    const dniParam = req.params.dni;
    const user = req.user;

    // 🔒 Seguridad base
    if (!user || !user.rol) {
      return res.status(401).json({
        ok: false,
        error: "No autenticado",
      });
    }

    // 🔒 Paciente solo puede consultar su propio DNI
    if (user.rol === "paciente") {
      if (String(user.dni) !== String(dniParam)) {
        return res.status(403).json({
          ok: false,
          error: "Acceso denegado",
        });
      }
    }

    // 🔒 Solo roles permitidos
    if (user.rol !== "admin" && user.rol !== "paciente") {
      return res.status(403).json({
        ok: false,
        error: "Rol no autorizado",
      });
    }

    // 🔗 Llamada al laboratorio
    const response = await fetch(
      `${LAB_API}/api/pacientes/${dniParam}?key=${LAB_KEY}`
    );

    if (!response.ok) {
      return res.status(404).json({
        ok: false,
        error: "Paciente no encontrado",
      });
    }

    const data = await response.json();

    // 🧹 Sanitización (CLAVE)
    const pacienteSeguro = {
      dni: data.dni,
      nombre: data.nombre,
      apellido: data.apellido,
      fecha_nac: data.fecha_nac,
      nro_historia: data.nro_historia,
      obra_social: data.obra_social,
    };

    res.json({
      ok: true,
      paciente: pacienteSeguro,
    });
  } catch (err) {
    console.error("PACIENTES ERROR:", err);
    res.status(500).json({
      ok: false,
      error: "Error al conectar con el laboratorio",
    });
  }
};
