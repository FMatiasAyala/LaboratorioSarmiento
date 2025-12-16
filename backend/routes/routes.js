const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const estudiosController = require("../controllers/estudiosController");
const pacientesController = require("../controllers/pacientesController");
const authMiddleware = require("../middlewares/authMiddleware");
const usuarioController = require("../controllers/usuarioController");
const requireAdmin = require("../middlewares/requireAdmin");
const mailerController = require("../controllers/mailerController");
const autoRegistroController = require("../controllers/autoregistroController");
const perfilController = require("../controllers/perfilController");
const authLimiter = require("../middlewares/authLimiter");

// Rutas de perfil
router.get("/mi-perfil", authMiddleware, perfilController.getMiPerfil);
router.put("/mi-perfil", authMiddleware, perfilController.updateMiPerfil);
router.put(
  "/mi-perfil/password",
  authMiddleware,
  perfilController.updatePassword
);

router.post("/enviar-token", authLimiter, mailerController.enviarToken);
router.post("/validar-token", authLimiter, mailerController.validarToken);

router.post("/registro/iniciar", authLimiter, autoRegistroController.iniciar);
router.get("/registro/verificar/:idPublico", autoRegistroController.confirmar);
router.post(
  "/registro/finalizar",
  authLimiter,
  autoRegistroController.finalizar
);

router.post("/login", authLimiter, authController.login);
router.post("/verificar-dni", authLimiter, authController.verificarDni);
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
router.get("/pacientes/:dni",authMiddleware, pacientesController.pacientes);

module.exports = router;
