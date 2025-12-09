const pool = require("../db");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// =======================================================
// 1) ENVIAR TOKEN POR EMAIL
// =======================================================
exports.enviarToken = async (req, res) => {
  try {
    const { dni, email } = req.body;

    if (!dni || !email)
      return res.status(400).json({ ok: false, error: "Faltan datos" });

    // Generar token random
    const token = crypto.randomBytes(20).toString("hex");

    // Expira en 1 hora
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Guardar en MySQL
    await pool.query(
      `INSERT INTO usuario_autoreg_tokens (dni, token, expires_at)
       VALUES (?, ?, ?)`,
      [dni, token, expiresAt]
    );

    // Enviar email
    await transporter.sendMail({
      from: `"Laboratorio Clínico" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Código de verificación",
      html: `
        <h2>Verificación de Identidad</h2>
        <p>Tu código de acceso es:</p>
        <h1 style="font-size:22px; color:#A63A3A">${token}</h1>
        <p>Este código expira en 1 hora.</p>
      `,
    });

    res.json({ ok: true, message: "Código enviado por email" });
  } catch (err) {
    console.error("ERROR enviarToken:", err);
    res.status(500).json({ ok: false, error: "Error enviando token" });
  }
};

// =======================================================
// 2) VALIDAR TOKEN
// =======================================================
exports.validarToken = async (req, res) => {
  try {
    const { dni, token } = req.body;

    if (!dni || !token)
      return res.status(400).json({ ok: false, error: "Faltan datos" });

    const [rows] = await pool.query(
      `SELECT * FROM usuario_autoreg_tokens 
       WHERE dni = ? AND token = ? AND used = 0 
       ORDER BY id DESC LIMIT 1`,
      [dni, token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ ok: false, error: "Token inválido" });
    }

    const registro = rows[0];

    // Verificar expiración
    if (new Date(registro.expires_at) < new Date()) {
      return res.status(400).json({ ok: false, error: "Token expirado" });
    }

    // Marcar como usado
    await pool.query(
      `UPDATE usuario_autoreg_tokens SET used = 1 WHERE id = ?`,
      [registro.id]
    );

    res.json({ ok: true, message: "Token validado correctamente" });
  } catch (err) {
    console.error("ERROR validarToken:", err);
    res.status(500).json({ ok: false, error: "Error verificando token" });
  }
};
