const rateLimit = require("express-rate-limit");
 

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,                 // 20 requests
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    ok: false,
    error: "Demasiados intentos. Intentá nuevamente más tarde.",
  },
});

module.exports = authLimiter;
