const pool = require("../db");
const bcrypt = require("bcrypt");

exports.getMiPerfil = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      "SELECT id, dni, nombre, apellido, email, telefono, fecha_nac, rol FROM usuarios WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ ok: false, error: "Usuario no encontrado" });
    }

    res.json({ ok: true, user: rows[0] });

  } catch (err) {
    console.error("Error getMiPerfil:", err);
    res.status(500).json({ ok: false, error: "Error interno" });
  }
};

exports.updateMiPerfil = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nombre, apellido, email, telefono } = req.body;

    await pool.query(
      `UPDATE usuarios 
       SET nombre=?, apellido=?, email=?, telefono=? 
       WHERE id=?`,
      [nombre, apellido, email, telefono, userId]
    );

    res.json({ ok: true, message: "Perfil actualizado" });

  } catch (err) {
    console.error("Error updateMiPerfil:", err);
    res.status(500).json({ ok: false, error: "Error interno" });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    const [rows] = await pool.query(
      "SELECT password_hash FROM usuarios WHERE id = ?",
      [userId]
    );

    if (rows.length === 0)
      return res.status(404).json({ ok: false, error: "Usuario no encontrado" });

    const ok = await bcrypt.compare(oldPassword, rows[0].password_hash);
    if (!ok)
      return res.status(400).json({ ok: false, error: "La contraseña actual es incorrecta" });

    const newHash = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE usuarios SET password_hash=? WHERE id=?",
      [newHash, userId]
    );

    res.json({ ok: true, message: "Contraseña actualizada" });

  } catch (err) {
    console.error("Error updatePassword:", err);
    res.status(500).json({ ok: false, error: "Error interno" });
  }
};
