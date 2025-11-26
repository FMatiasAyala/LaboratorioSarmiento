const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const estudiosController = require("../controllers/estudiosController");
const pacientesController = require("../controllers/pacientesController");
const authMiddleware = require("../middlewares/authMiddleware")

router.post("/login", authController.login);
router.get("/resultados/:codigo",authMiddleware, estudiosController.resultados);
router.get("/detalles/:ingreso", authMiddleware, estudiosController.detalles);
router.get("/pdf/:ingreso", estudiosController.pdf);
router.get("/pdf-url/:ingreso",authMiddleware, estudiosController.pdfUrl);
router.get("/pacientes/:dni", pacientesController.pacientes);

module.exports = router;
