const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");


// URL de tu backend del laboratorio (el que usa ADODB)
const LAB_API = process.env.LAB_API;
const LAB_KEY = process.env.LAB_KEY;

exports.login = async (req, res) => {
  try {
    const { dni, password } = req.body;
    console.log(dni);
    // 1. Buscar usuario en MySQL
    const [users] = await pool.query(
      "SELECT * FROM usuarios WHERE dni = ? LIMIT 1",
      [dni]
    );

    if (users.length > 0) {
      const user = users[0];

      const ok = await bcrypt.compare(password, user.password_hash);
      if (!ok) {
        return res.status(400).json({ error: "Contraseña incorrecta" });
      }

      const token = jwt.sign({ id: user.id, dni: user.dni }, "SECRET", {
        expiresIn: "7d",
      });

      return res.json({
        ok: true,
        token,
        user,
      });
    }

    // 2. No existe → buscar en DBF usando la API del laboratorio
    const response = await fetch(
      `${LAB_API}/api/pacientes/${dni}?key=${LAB_KEY}`
    );
    const dbfData = await response.json();
    /*     if (!response.ok || !dbfData.ok || dbfData.total === 0) {
      return res.status(404).json({ error: "Paciente no encontrado en el laboratorio" });
    } */

    const pac = dbfData;
    let fechaNac = null;
    if (pac.fechanac) {
      fechaNac = pac.fechanac.split("T")[0]; // toma solo 2001-08-19
    }
    // 3. Crear usuario nuevo en MySQL
    const passHash = await bcrypt.hash(password, 10);

    const [insert] = await pool.query(
      "INSERT INTO usuarios (dni, nombre, apellido, fecha_nac, nro_historia, password_hash) VALUES (?, ?, ?, ?, ?, ?)",
      [
        pac.ndoc,
        pac.nombre.trim(),
        pac.apellido.trim(),
        fechaNac,
        pac.codigo,
        passHash,
      ]
    );

    // Traer el usuario limpio desde MySQL
    const [rows] = await pool.query(
      "SELECT id, dni, nombre, apellido, fecha_nac, nro_historia, email, telefono FROM usuarios WHERE id = ?",
      [insert.insertId]
    );

    const newUser = rows[0]; // Usuario tal como está en MySQL

    const token = jwt.sign({ id: newUser.id, dni: newUser.dni }, "SECRET", {
      expiresIn: "7d",
    });

    return res.json({
      ok: true,
      created: true,
      token,
      user: newUser,
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
