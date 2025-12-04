const express = require("express");
const cors = require("cors");
const routerLab = require("./routes/routes");
require("dotenv").config();
const app = express();
const allowedOrigins = [
  "http://localhost:5173", // Front local
  "https://bulonxpress.online", // Front producción
  "https://www.bulonxpress.online",
  "https://portal.bulonxpress.online", // si usás subdominio
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir Postman, curl, etc (sin origin)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // ❗ No tiramos error porque rompe el preflight
      console.warn("CORS bloqueado para origen:", origin);
      return callback(null, false); 
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


app.use(express.json());
app.use("/api", routerLab);
const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  console.log(">> ALGUIEN PEGÓ A /");
  res.send("Backend OK");
});
// 🚀 Levantar el servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});
