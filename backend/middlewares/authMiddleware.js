const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ ok: false, error: "Token requerido" });
  }

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, "SECRET");  // usa tu SECRET real
    req.user = decoded; // por ejemplo { id, dni }
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, error: "Token inválido" });
  }
};
