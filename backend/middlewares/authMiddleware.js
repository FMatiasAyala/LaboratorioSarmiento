const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const auth = req.headers.authorization;
  console.log("authMiddleware: Authorization header:", auth);

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ ok: false, error: "Token requerido" });
  }

  try {
    const token = auth.split(" ")[1];

    // 🔥 ACA ESTABA EL ERROR
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Error verificando token:", err.message);
    return res.status(401).json({ ok: false, error: "Token inválido" });
  }
};
