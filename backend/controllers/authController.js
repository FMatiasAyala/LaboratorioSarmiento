const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const {
  checkAttempts,
  registerFail,
  clearAttempts,
} = require("../utils/loginAttempts");
const LAB_API = process.env.LAB_API;
const LAB_KEY = process.env.LAB_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

// =====================================================
// 1) Verificar DNI antes del login
// =====================================================
exports.verificarDni = async (req, res) => {
  const { dni } = req.body;

  try {
    // 1 — Buscar en MySQL
    const [rows] = await pool.query(
      "SELECT id FROM usuarios WHERE dni = ? LIMIT 1",
      [dni]
    );

    if (rows.length > 0) {
      return res.json({
        ok: true,
        existe_mysql: true,
        existe_dbf: true,
      });
    }

    // 2 — Buscar en DBF (LABORATORIO)
    const resp = await fetch(`${LAB_API}/api/pacientes/${dni}?key=${LAB_KEY}`);
    const pac = await resp.json();

    if (pac && pac.ndoc) {
      return res.json({
        ok: true,
        existe_mysql: false,
        existe_dbf: true,
      });
    }

    // 3 — No existe en ningún lado
    return res.status(404).json({
      ok: false,
      existe_mysql: false,
      existe_dbf: false,
      error: "El DNI no pertenece a ningún paciente",
    });
  } catch (err) {
    console.error("ERROR verificarDni:", err);
    res.status(500).json({ ok: false, error: "Error interno" });
  }
};

// =====================================================
// 2) Crear contraseña cuando existe en DBF pero NO en MySQL
// =====================================================
exports.crearPassword = async (req, res) => {
  const { dni, password } = req.body;

  try {
    const resp = await fetch(`${LAB_API}/api/pacientes/${dni}?key=${LAB_KEY}`);
    const pac = await resp.json();

    if (!pac || !pac.ndoc) {
      return res
        .status(404)
        .json({ ok: false, error: "Paciente no encontrado en DBF" });
    }

    let fechaNac = null;
    if (pac.fechanac) fechaNac = pac.fechanac.split("T")[0];

    const passHash = await bcrypt.hash(password, 10);

    const [insert] = await pool.query(
      `INSERT INTO usuarios (dni, nombre, apellido, fecha_nac, nro_historia, rol, password_hash)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        pac.ndoc,
        pac.nompac.trim(),
        pac.apellido.trim(),
        fechaNac,
        pac.codigo,
        "paciente", // 👈 siempre paciente
        passHash,
      ]
    );

    const user = {
      id: insert.insertId,
      dni: pac.ndoc,
      nombre: pac.nompac.trim(),
      apellido: pac.apellido.trim(),
      fecha_nac: fechaNac,
      nro_historia: pac.codigo,
      rol: "paciente",
    };

    // TOKEN — unificado
    const token = jwt.sign(
      { id: user.id, dni: user.dni, rol: user.rol },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ ok: true, user, token });
  } catch (err) {
    console.error("ERROR crearPassword:", err);
    res.status(500).json({ ok: false, error: "Error interno" });
  }
};

// =====================================================
// 3) Login con usuario ya registrado en MySQL
// =====================================================

exports.login = async (req, res) => {
  const { dni, password } = req.body;
  const key = `${dni}:${req.ip}`;

  try {
    // 🔒 Bloqueo por intentos
    if (checkAttempts(key)) {
      return res.status(429).json({
        ok: false,
        error: "Demasiados intentos. Intente más tarde.",
      });
    }

    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE dni = ? LIMIT 1",
      [dni]
    );

    // ❗ mensaje único
    if (rows.length === 0) {
      registerFail(key);
      return res.status(401).json({
        ok: false,
        error: "Credenciales inválidas",
      });
    }

    const user = rows[0];

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      registerFail(key);
      return res.status(401).json({
        ok: false,
        error: "Credenciales inválidas",
      });
    }

    // ✅ login OK → limpiar intentos
    clearAttempts(key);

    const rolFinal = user.rol || "paciente";

    const token = jwt.sign(
      { id: user.id, dni: user.dni, rol: rolFinal },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      ok: true,
      user: {
        id: user.id,
        dni: user.dni,
        nombre: user.nombre,
        apellido: user.apellido,
        fecha_nac: user.fecha_nac,
        nro_historia: user.nro_historia,
        email: user.email,
        telefono: user.telefono,
        rol: rolFinal,
      },
      token,
    });
  } catch (err) {
    console.error("ERROR login:", err);
    res.status(500).json({ ok: false, error: "Error interno" });
  }
};
