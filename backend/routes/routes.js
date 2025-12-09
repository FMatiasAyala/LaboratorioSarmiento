const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const estudiosController = require("../controllers/estudiosController");
const pacientesController = require("../controllers/pacientesController");
const authMiddleware = require("../middlewares/authMiddleware");
const usuarioController = require("../controllers/usuarioController");
const requireAdmin = require("../middlewares/requireAdmin");
const mailerController = require("../controllers/mailerController");


router.post("/enviar-token", mailerController.enviarToken);
router.post("/validar-token", mailerController.validarToken);

router.post("/login", authController.login);
router.post("/verificar-dni", authController.verificarDni);
router.post("/crear-password", authController.crearPassword);

// Usuarios CRUD
router.post(
  "/usuarios",
  authMiddleware,
  requireAdmin,
  usuarioController.crearUsuario
);
router.get(
  "/usuarios",
  authMiddleware,
  requireAdmin,
  usuarioController.listarUsuarios
);
router.get(
  "/usuarios/:id",
  authMiddleware,
  requireAdmin,
  usuarioController.obtenerUsuario
);
router.get(
  "/usuarios/buscar/:dni",
  authMiddleware,
  requireAdmin,
  usuarioController.buscarPorDniAvanzado
);
router.put(
  "/usuarios/:id",
  authMiddleware,
  requireAdmin,
  usuarioController.editarUsuario
);
router.delete(
  "/usuarios/:id",
  authMiddleware,
  requireAdmin,
  usuarioController.eliminarUsuario
);

router.get(
  "/resultados/:codigo",
  authMiddleware,
  estudiosController.resultados
);
router.get("/detalles/:ingreso", authMiddleware, estudiosController.detalles);
router.get("/pdf/:ingreso", estudiosController.pdf);
router.get("/pdf-url/:ingreso", authMiddleware, estudiosController.pdfUrl);
router.get("/pacientes/:dni", pacientesController.pacientes);

module.exports = router;
