const LAB_API = process.env.LAB_API;
const LAB_KEY = process.env.LAB_KEY;
const jwt = require("jsonwebtoken");

async function ingresoPerteneceAPaciente(ingreso, nro_historia) {
  const resp = await fetch(
    `${LAB_API}/api/estudios/resultados/${nro_historia}?key=${LAB_KEY}`
  );

  if (!resp.ok) return false;

  const data = await resp.json();

  const ingresos = data?.ingresos || [];

  return ingresos.some((i) => String(i.ingreso) === String(ingreso));
}

exports.pdfUrl = async (req, res) => {
  try {
    const ingreso = req.params.ingreso;
    const user = req.user;

    // Validar existencia del PDF ANTES
    const test = await fetch(
      `${LAB_API}/api/estudios/pdf/${ingreso}?key=${LAB_KEY}`
    );

    if (!test.ok) {
      return res.status(404).json({
        ok: false,
        error: "El PDF no se encuentra disponible",
      });
    }

    const tempToken = jwt.sign(
      {
        dni: user.dni,
        ingreso,
        jti: crypto.randomUUID(),
      },
      process.env.JWT_TEMP_SECRET,
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
      return res.status(401).json({
        ok: false,
        error: "Token temporal requerido",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(temp, process.env.JWT_TEMP_SECRET);
    } catch (err) {
      return res.status(401).json({
        ok: false,
        error: "Token temporal inválido o expirado",
      });
    }

    if (String(decoded.ingreso) !== String(ingreso)) {
      return res.status(403).json({
        ok: false,
        error: "Ingreso inválido",
      });
    }

    const response = await fetch(
      `${LAB_API}/api/estudios/pdf/${ingreso}?key=${LAB_KEY}`
    );

    if (!response.ok) {
      return res.status(404).json({
        ok: false,
        error: "El PDF no está disponible",
      });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=Ingreso-${ingreso}.pdf`
    );

    const { Readable } = require("stream");
    Readable.from(response.body).pipe(res);

  } catch (err) {
    console.error("PDF VPS ERROR:", err);
    res.status(500).json({
      ok: false,
      error: "Error procesando PDF",
    });
  }
};


exports.resultados = async (req, res) => {
  try {
    const codigo = req.params.codigo;
    const user = req.user;

    // 🔒 Seguridad por rol
    if (user.rol === "paciente") {
      if (String(user.nro_historia) !== String(codigo)) {
        return res.status(403).json({
          ok: false,
          error: "Acceso denegado",
        });
      }
    }

    // (opcional pero claro)
    if (user.rol !== "paciente" && user.rol !== "admin") {
      return res.status(403).json({
        ok: false,
        error: "Rol no autorizado",
      });
    }

    // 🔗 Llamada al laboratorio
    const response = await fetch(
      `${LAB_API}/api/estudios/resultados/${codigo}?key=${LAB_KEY}`
    );

    if (!response.ok) {
      return res.status(500).json({
        ok: false,
        error: "Error consultando resultados del laboratorio",
      });
    }

    const data = await response.json();

    return res.json({
      ok: true,
      origen: "laboratorio",
      codigo,
      resultados: data,
    });
  } catch (err) {
    console.error("Error resultados:", err);
    res.status(500).json({
      ok: false,
      error: "Error interno",
    });
  }
};

exports.detalles = async (req, res) => {
  try {
    const ingreso = req.params.ingreso;
    const user = req.user;

    // 🔒 Seguridad por rol
    if (user.rol === "paciente") {
      const pertenece = await ingresoPerteneceAPaciente(
        ingreso,
        user.nro_historia
      );

      if (!pertenece) {
        return res.status(403).json({
          ok: false,
          error: "Acceso denegado",
        });
      }
    }

    // explícito (opcional)
    if (user.rol !== "paciente" && user.rol !== "admin") {
      return res.status(403).json({
        ok: false,
        error: "Rol no autorizado",
      });
    }

    // 🔗 Detalle real
    const response = await fetch(
      `${LAB_API}/api/estudios/detalles/${ingreso}?key=${LAB_KEY}`
    );

    if (!response.ok) {
      return res.status(500).json({
        ok: false,
        error: "Error consultando detalles",
      });
    }

    const data = await response.json();

    res.json({
      ok: true,
      ingreso,
      detalles: data,
    });
  } catch (err) {
    console.error("DETALLES ERROR:", err);
    res.status(500).json({
      ok: false,
      error: "Error interno",
    });
  }
};
