const LAB_API = process.env.LAB_API;
const LAB_KEY = process.env.LAB_KEY;

exports.pacientes = async (req, res) => {
  try {
    const dni = req.params.dni;

    // Llamada interna al laboratorio (WireGuard)
    const response = await fetch(
      `${LAB_API}/api/pacientes/${dni}?key=${LAB_KEY}`
    );
    const data = await response.json();

    res.json({
      origen: "laboratorio",
      dni,
      resultados: data,
    });
  } catch (err) {
    console.error("Error al consultar el laboratorio:", err);
    res.status(500).json({ error: "Error al conectar con el laboratorio" });
  }
};
