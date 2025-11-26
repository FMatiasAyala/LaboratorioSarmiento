const LAB_API = process.env.LAB_API;
const LAB_KEY = process.env.LAB_KEY;
const jwt = require("jsonwebtoken");
const { Readable } = require("stream");

exports.pdfUrl = async (req, res) => {
  try {
    const ingreso = req.params.ingreso;
    const user = req.user; // { id, dni }

    // Token temporal (30 segundos)
    const tempToken = jwt.sign(
      { dni: user.dni, ingreso },
      process.env.JWT_SECRET,
      { expiresIn: "30s" }
    );

    res.json({
      ok: true,
      url: `${process.env.PUBLIC_BACKEND_URL}/api/pdf/${ingreso}?temp=${tempToken}`,
    });
  } catch (err) {
    console.error("Error pdfUrl:", err);
    res.status(500).json({ error: "Error al generar URL segura" });
  }
};

exports.pdf = async (req, res) => {
  try {
    const ingreso = req.params.ingreso;
    const temp = req.query.temp;

    if (!temp) {
      return res.status(401).json({ ok: false, error: "Token temporal requerido" });
    }

    let decoded;
    try {
      decoded = jwt.verify(temp, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ ok: false, error: "Token temporal inválido o expirado" });
    }

    // Validación del DNI
    if (String(decoded.ingreso) !== String(ingreso)) {
      return res.status(403).json({ ok: false, error: "Ingreso inválido" });
    }

    // Llamada al laboratorio
    const response = await fetch(`${LAB_API}/api/estudios/pdf/${ingreso}?key=${LAB_KEY}`);

    if (!response.ok) {
      return res.status(500).json({ ok: false, error: "Error obteniendo el PDF" });
    }

    // Copiar headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=Ingreso-${ingreso}.pdf`);

    // Convertir webStream → nodeStream
    const { Readable } = require("stream");
    const nodeStream = Readable.from(response.body);

    return nodeStream.pipe(res);

  } catch (err) {
    console.error("PDF VPS ERROR:", err);
    res.status(500).json({ error: "Error procesando PDF" });
  }
};


exports.resultados = async (req, res) => {
  try {
    const codigo = req.params.codigo;
    console.log("HEADERS REALES QUE LLEGAN:", req.headers);

    // Llamada interna al laboratorio (WireGuard)
    const response = await fetch(
      `${LAB_API}/api/estudios/resultados/${codigo}?key=${LAB_KEY}`
    );
    const data = await response.json();

    res.json({
      origen: "laboratorio",
      codigo,
      resultados: data,
    });
  } catch (err) {
    console.error("Error al consultar el laboratorio:", err);
    res.status(500).json({ error: "Error al conectar con el laboratorio" });
  }
};
exports.detalles = async (req, res) => {
  try {
    const ingreso = req.params.ingreso;
    console.log("HEADERS REALES QUE LLEGAN:", req.headers);
    // Llamada interna al laboratorio (WireGuard)
    const response = await fetch(
      `${LAB_API}/api/estudios/detalles/${ingreso}?key=${LAB_KEY}`
    );
    const data = await response.json();

    res.json(data);
  } catch (err) {
    console.error("Error al consultar el laboratorio:", err);
    res.status(500).json({ error: "Error al conectar con el laboratorio" });
  }
};
