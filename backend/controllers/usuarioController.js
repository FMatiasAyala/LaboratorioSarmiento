const pool = require("../db");
const bcrypt = require("bcrypt");
const PDFDocument = require("pdfkit");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const path = require("path");
const logoPath = path.join(__dirname, "../public/logo2.jpg");
exports.buscarPorDniAvanzado = async (req, res) => {
  const dni = req.params.dni;

  try {
    // Buscar en MySQL
    const [usuarios] = await pool.query(
      "SELECT * FROM usuarios WHERE dni = ? LIMIT 1",
      [dni]
    );

    if (usuarios.length > 0) {
      return res.json({
        ok: true,
        existe_mysql: true,
        existe_dbf: true,
        origen: "mysql",
        usuario: usuarios[0],
      });
    }

    // Buscar en DBF (LAB)
    const resp = await fetch(
      `${process.env.LAB_API}/api/pacientes/${dni}?key=${process.env.LAB_KEY}`
    );
    const pac = await resp.json();

    if (pac && pac.ndoc) {
      return res.json({
        ok: true,
        existe_mysql: false,
        existe_dbf: true,
        origen: "laboratorio",
        usuario: {
          dni: pac.ndoc,
          nombre: pac.nompac.trim(),
          apellido: pac.apellido.trim(),
          fecha_nac: pac.fechanac ? pac.fechanac.split("T")[0] : null,
          nro_historia: pac.codigo,
          email: pac.email || "",
          rol: "paciente",
        },
      });
    }

    // No existe en ningún lado → NO ES PACIENTE
    return res.status(404).json({
      ok: false,
      existe_mysql: false,
      existe_dbf: false,
      error: "El DNI no pertenece a ningún paciente",
    });
  } catch (err) {
    console.error("ERROR buscarPorDniAvanzado:", err);
    res.status(500).json({ ok: false, error: "Error interno" });
  }
};

// ================================
// CREAR USUARIO DESDE ADMIN
// ================================
exports.crearUsuario = async (req, res) => {
  try {
    const {
      dni,
      nombre,
      apellido,
      fecha_nac,
      nro_historia,
      email,
      password,
      rol,
    } = req.body;

    const [exists] = await pool.query(
      "SELECT id FROM usuarios WHERE dni = ? LIMIT 1",
      [dni]
    );

    if (exists.length > 0)
      return res.status(400).json({ ok: false, error: "El usuario ya existe" });

    const passHash = await bcrypt.hash(password, 10);

    const [insert] = await pool.query(
      `INSERT INTO usuarios (dni, nombre, apellido, fecha_nac, nro_historia, email,rol, password_hash)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [dni, nombre, apellido, fecha_nac, nro_historia, email, rol, passHash]
    );

    res.json({
      ok: true,
      user: {
        id: insert.insertId,
        dni,
        nombre,
        apellido,
        fecha_nac,
        nro_historia,
        email,
        rol,
      },
    });
  } catch (err) {
    console.error("ERROR crearUsuario:", err);
    res.status(500).json({ ok: false, error: "Error interno" });
  }
};

// ================================
// LISTAR USUARIOS
// ================================
exports.listarUsuarios = async (req, res) => {
  console.log("requested by user:", req.user);
  try {
    const [rows] = await pool.query(
      "SELECT id, dni, nombre, apellido, fecha_nac, nro_historia, email, rol FROM usuarios"
    );

    res.json({ ok: true, usuarios: rows });
  } catch (err) {
    console.error("ERROR listarUsuarios:", err);
    res.status(500).json({ ok: false, error: "Error interno" });
  }
};

// ================================
// OBTENER UN USUARIO
// ================================
exports.obtenerUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT id, dni, nombre, apellido, fecha_nac, nro_historia, email, rol FROM usuarios WHERE id = ?",
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ ok: false, error: "No encontrado" });

    res.json({ ok: true, usuario: rows[0] });
  } catch (err) {
    console.error("ERROR obtenerUsuario:", err);
    res.status(500).json({ ok: false, error: "Error interno" });
  }
};

// ================================
// EDITAR USUARIO
// ================================
exports.editarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      apellido,
      fecha_nac,
      nro_historia,
      email,
      rol,
      password, // 👈 ahora sí
    } = req.body;

    // Armamos query dinámica
    let query = `
      UPDATE usuarios
      SET nombre=?, apellido=?, fecha_nac=?, nro_historia=?, email=?, rol=?
    `;
    const params = [nombre, apellido, fecha_nac, nro_historia, email, rol];

    // Si viene password, la actualizamos
    if (password && password.trim() !== "") {
      const hash = await bcrypt.hash(password, 10);
      query += `, password_hash=?`;
      params.push(hash);
    }

    query += ` WHERE id=?`;
    params.push(id);

    await pool.query(query, params);

    res.json({ ok: true });
  } catch (err) {
    console.error("ERROR editarUsuario:", err);
    res.status(500).json({ ok: false, error: "Error interno" });
  }
};

// ================================
// ELIMINAR USUARIO
// ================================
exports.eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);

    res.json({ ok: true });
  } catch (err) {
    console.error("ERROR eliminarUsuario:", err);
    res.status(500).json({ ok: false, error: "Error interno" });
  }
};

exports.credencialesPdfUrl = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔒 Solo admin puede generar credenciales
    if (req.user.rol !== "admin") {
      return res.status(403).json({ ok: false, error: "No autorizado" });
    }

    // Token temporal (1 minuto)
    const tempToken = jwt.sign(
      { userId: id, jti: crypto.randomUUID() },
      process.env.JWT_TEMP_SECRET,
      { expiresIn: "1m" }
    );

    res.json({
      ok: true,
      url: `${process.env.PUBLIC_BACKEND_URL}/api/usuarios/${id}/credenciales-pdf?temp=${tempToken}`,
    });
  } catch (err) {
    console.error("Error credencialesPdfUrl:", err);
    res.status(500).json({ ok: false, error: "Error generando credenciales" });
  }
};

exports.credencialesPdf = async (req, res) => {
  try {
    const { id } = req.params;
    const { temp, password } = req.query;

    if (!temp || !password) {
      return res.status(401).json({
        error: "Token o contraseña faltante",
      });
    }

    // 🔐 Verificar token temporal
    let decoded;
    try {
      decoded = jwt.verify(temp, process.env.JWT_TEMP_SECRET);
    } catch {
      return res.status(401).json({
        error: "Token inválido o expirado",
      });
    }

    if (String(decoded.userId) !== String(id)) {
      return res.status(403).json({
        error: "Token inválido",
      });
    }

    // 🔍 Buscar usuario
    const [rows] = await pool.query(
      "SELECT dni FROM usuarios WHERE id = ? LIMIT 1",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Usuario no encontrado",
      });
    }

    const u = rows[0];

    // ======================
    // 📄 GENERAR PDF
    // ======================
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=credenciales-${u.dni}.pdf`
    );

    doc.pipe(res);

    // 🖼 LOGO
    if (require("fs").existsSync(logoPath)) {
      doc.image(logoPath, {
        width: 120,
        align: "center",
      });
    }

    doc.moveDown(2);

    // 🏷 TÍTULO
    doc.font("Helvetica-Bold").fontSize(22).text("Credenciales de Acceso", {
      align: "center",
    });

    doc.moveDown(2);

    // 👤 USUARIO
    doc.font("Helvetica-Bold").fontSize(14).text("Usuario:");
    doc.font("Helvetica").fontSize(18).text(u.dni);

    doc.moveDown(1.5);

    // 🔑 CONTRASEÑA
    doc.font("Helvetica-Bold").fontSize(14).text("Contraseña:");
    doc.font("Helvetica").fontSize(18).text(password);

    doc.moveDown(2);

    // 🌐 PORTAL
    doc.font("Helvetica-Bold").fontSize(14).text("Portal de pacientes:");
    doc
      .font("Helvetica")
      .fontSize(14)
      .fillColor("blue")
      .text(process.env.PORTAL_URL, {
        link: process.env.PORTAL_URL,
        underline: true,
      });

    doc.fillColor("black");
    doc.moveDown(2);

    // 📘 EXPLICACIÓN SIMPLE
    doc.font("Helvetica").fontSize(13);

    doc.text("¿Cómo ver sus resultados?", { underline: true });
    doc.moveDown(1);

    doc.text("1) Ingrese al portal desde su celular o computadora.");
    doc.text("2) Escriba su USUARIO y CONTRASEÑA.");
    doc.text("3) Presione el botón 'Ingresar'.");
    doc.text("4) Allí podrá ver y descargar sus resultados.");

    doc.moveDown(1.5);

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("IMPORTANTE:", { underline: true });

    doc
      .font("Helvetica")
      .fontSize(12)
      .text(
        "Guarde este papel. No comparta su contraseña.\nAnte cualquier duda, comuníquese con el laboratorio."
      );

    doc.end();
  } catch (err) {
    console.error("Error PDF credenciales:", err);
    res.status(500).json({
      error: "Error generando PDF",
    });
  }
};
