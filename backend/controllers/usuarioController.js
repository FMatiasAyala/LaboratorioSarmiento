const pool = require("../db");
const bcrypt = require("bcrypt");

// ================================
// CREAR USUARIO DESDE ADMIN
// ================================
exports.crearUsuario = async (req, res) => {
  try {
    const { dni, nombre, apellido, fecha_nac, nro_historia, password, rol } =
      req.body;

    const [exists] = await pool.query(
      "SELECT id FROM usuarios WHERE dni = ? LIMIT 1",
      [dni]
    );

    if (exists.length > 0)
      return res.status(400).json({ ok: false, error: "El usuario ya existe" });

    const passHash = await bcrypt.hash(password, 10);

    const [insert] = await pool.query(
      `INSERT INTO usuarios (dni, nombre, apellido, fecha_nac, nro_historia, rol, password_hash)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [dni, nombre, apellido, fecha_nac, nro_historia, rol, passHash]
    );

    res.json({
      ok: true,
      user: { id: insert.insertId, dni, nombre, apellido, fecha_nac, nro_historia, rol },
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
  try {
    const [rows] = await pool.query(
      "SELECT id, dni, nombre, apellido, fecha_nac, nro_historia, rol FROM usuarios"
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
      "SELECT id, dni, nombre, apellido, fecha_nac, nro_historia, rol FROM usuarios WHERE id = ?",
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
    const { nombre, apellido, fecha_nac, nro_historia, rol } = req.body;

    await pool.query(
      `UPDATE usuarios SET nombre=?, apellido=?, fecha_nac=?, nro_historia=?, rol=? WHERE id=?`,
      [nombre, apellido, fecha_nac, nro_historia, rol, id]
    );

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
