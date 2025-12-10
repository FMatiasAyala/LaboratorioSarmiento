const pool = require("../db");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
require("dotenv").config();

const LAB_API = process.env.LAB_API;
const LAB_KEY = process.env.LAB_KEY;
const FRONT_URL = process.env.FRONT_URL;

/* ---------------------------------------------------
   🔧 NORMALIZADOR DE CAMPOS DEL LABORATORIO
--------------------------------------------------- */
function limpiarCampos(obj) {
  const limpio = {};
  for (const key in obj) {
    if (typeof obj[key] === "string") limpio[key] = obj[key].trim();
    else limpio[key] = obj[key];
  }
  return limpio;
}

/* ---------------------------------------------------
   📧 FUNCIÓN ENVIAR CORREO
--------------------------------------------------- */
async function enviarCorreo(destino, idPublico) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  // NUEVA URL limpia y segura
  const url = `${FRONT_URL}/registro/verificar/${idPublico}`;

  await transporter.sendMail({
    from: `"Laboratorio" <${process.env.MAIL_USER}>`,
    to: destino,
    subject: "Confirmación de registro",
    html: `
      <h2>Confirmación de registro</h2>
      <p>Para continuar con el registro, haga clic en el siguiente enlace:</p>
      <p><a href="${url}">${url}</a></p>
      <p>Este enlace expirará en 24 horas.</p>
    `,
  });
}

/* =========================================================
   1️⃣  INICIAR AUTO REGISTRO
========================================================= */
exports.iniciar = async (req, res) => {
  const { dni, acepta } = req.body;

  if (!acepta) {
    return res.json({
      ok: false,
      error: "Debe aceptar los términos y condiciones.",
    });
  }

  try {
    // Buscar en LAB_API
    const resp = await fetch(`${LAB_API}/api/pacientes/${dni}?key=${LAB_KEY}`);
    let paciente = await resp.json();

    if (!paciente || !paciente.ndoc) {
      return res.json({
        ok: false,
        error: "El DNI no pertenece a ningún paciente.",
      });
    }

    paciente = limpiarCampos(paciente);

    if (!paciente.email) {
      return res.json({
        ok: false,
        error:
          "El paciente no tiene correo registrado. Debe actualizarlo en recepción.",
      });
    }

    // Comprobar si ya existe en MySQL
    const [user] = await pool.query(
      "SELECT id FROM usuarios WHERE dni = ? LIMIT 1",
      [dni]
    );

    if (user.length > 0) {
      return res.json({
        ok: false,
        error: "Ya existe una cuenta registrada con este DNI.",
      });
    }

    // Crear token
    const idPublico = crypto.randomBytes(5).toString("hex").toUpperCase();
    const tokenReal = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(tokenReal)
      .digest("hex");

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Guardar SOLO hash
    await pool.query(
      `INSERT INTO usuario_autoreg_tokens (id_publico, token_hash, dni, expires_at)
   VALUES (?, ?, ?, ?)`,
      [idPublico, tokenHash, dni, expires]
    );

    await enviarCorreo(paciente.email, idPublico);

    return res.json({
      ok: true,
      mensaje: "Se envió un correo de confirmación.",
    });
  } catch (err) {
    console.error("ERROR INICIAR AUTOREGISTRO:", err);
    res.status(500).json({ ok: false, error: "Error interno del servidor." });
  }
};

/* =========================================================
   2️⃣  CONFIRMAR TOKEN
========================================================= */
exports.confirmar = async (req, res) => {
  const { idPublico } = req.params;

  const [rows] = await pool.query(
    "SELECT * FROM usuario_autoreg_tokens WHERE id_publico = ? AND used = 0 LIMIT 1",
    [idPublico]
  );

  if (rows.length === 0) {
    return res.json({ ok: false, error: "Enlace inválido o expirado." });
  }

  if (new Date(rows[0].expires_at) < new Date()) {
    return res.json({ ok: false, error: "El enlace ha expirado." });
  }

  return res.json({ ok: true, dni: rows[0].dni });
};

/* =========================================================
   3️⃣  FINALIZAR REGISTRO
========================================================= */
exports.finalizar = async (req, res) => {
  const { idPublico, password } = req.body;

  if (!password) {
    return res.json({ ok: false, error: "Debe ingresar una contraseña." });
  }

  const [rows] = await pool.query(
    "SELECT * FROM usuario_autoreg_tokens WHERE id_publico = ? AND used = 0 LIMIT 1",
    [idPublico]
  );

  if (rows.length === 0) {
    return res.json({ ok: false, error: "Enlace inválido o ya utilizado." });
  }

  const registro = rows[0];

  // Buscar paciente real
  const resp = await fetch(
    `${LAB_API}/api/pacientes/${registro.dni}?key=${LAB_KEY}`
  );
  let paciente = await resp.json();

  if (!paciente || !paciente.ndoc) {
    return res.json({ ok: false, error: "Paciente no encontrado." });
  }

  paciente = limpiarCampos(paciente);

  const fechaNac = paciente.fechanac
    ? paciente.fechanac.substring(0, 10)
    : null;

  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO usuarios (dni, nombre, apellido, fecha_nac, nro_historia, email, password_hash, rol)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      registro.dni,
      paciente.nompac,
      paciente.apellido,
      fechaNac,
      paciente.codigo,
      paciente.email,
      hash,
      "paciente",
    ]
  );

  await pool.query(
    "UPDATE usuario_autoreg_tokens SET used = 1 WHERE id_publico = ?",
    [idPublico]
  );

  return res.json({ ok: true, mensaje: "Registro completado." });
};
