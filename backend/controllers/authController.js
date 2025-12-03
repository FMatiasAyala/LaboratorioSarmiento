const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

// URL de tu backend del laboratorio (el que usa ADODB)
const LAB_API = process.env.LAB_API;
const LAB_KEY = process.env.LAB_KEY;

exports.verificarDni = async (req, res) => {
  const { dni } = req.body;

  try {
    // Buscar en MySQL
    const [rows] = await pool.query(
      "SELECT id FROM usuarios WHERE dni = ? LIMIT 1",
      [dni]
    );

    if (rows.length > 0) {
      // Está en MySQL → ya está registrado
      return res.json({
        ok: true,
        existe_mysql: true,
        existe_dbf: true,
      });
    }

    // Buscar en DBF (LAB)
    const resp = await fetch(`${LAB_API}/api/pacientes/${dni}?key=${LAB_KEY}`);
    const data = await resp.json();

    if (data && data.ndoc) {
      // Está en laboratorio → pero NO en MySQL → debe CREAR password
      return res.json({
        ok: true,
        existe_mysql: false,
        existe_dbf: true,
      });
    }

    // Ni en MySQL ni en DBF → NO es paciente
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
      `INSERT INTO usuarios (dni, nombre, apellido, fecha_nac, nro_historia, password_hash)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        pac.ndoc,
        pac.nombre.trim(),
        pac.apellido.trim(),
        fechaNac,
        pac.codigo,
        passHash,
      ]
    );

    const user = {
      id: insert.insertId,
      dni: pac.ndoc,
      nombre: pac.nombre.trim(),
      apellido: pac.apellido.trim(),
      fecha_nac: fechaNac,
      nro_historia: pac.codigo,
    };

    const token = jwt.sign(
      { id: user.id, dni: user.dni },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ ok: true, user, token });
  } catch (err) {
    console.error("ERROR crearPassword:", err);
    res.status(500).json({ ok: false, error: "Error interno" });
  }
};

exports.login = async (req, res) => {
  const { dni, password } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE dni = ? LIMIT 1",
      [dni]
    );

    if (rows.length === 0) {
      return res.status(404).json({ ok: false, error: "El usuario no existe" });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);

    if (!ok)
      return res
        .status(400)
        .json({ ok: false, error: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user.id, dni: user.dni },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ ok: true, user, token });

  } catch (err) {
    console.error("ERROR login:", err);
    res.status(500).json({ ok: false, error: "Error interno" });
  }
};

