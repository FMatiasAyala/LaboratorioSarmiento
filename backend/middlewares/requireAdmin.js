module.exports = function requireAdmin(req, res, next) {
  if (req.user?.rol === "admin") return next();
  return res.status(403).json({ ok: false, error: "NO AUTORIZADO" });
};
