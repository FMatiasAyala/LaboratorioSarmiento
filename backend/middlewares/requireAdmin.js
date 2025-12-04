module.exports = function requireAdmin(req, res, next) {
    console.log("requireAdmin: User role:", req.user?.rol);
    console.log("requireAdmin: User data:", req.user);
  if (req.user?.rol === "admin") return next();
  return res.status(403).json({ ok: false, error: "NO AUTORIZADO" });
};
