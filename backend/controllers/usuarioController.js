const pool = require("../db");
const bcrypt = require("bcrypt");

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
      query += `, password=?`;
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
