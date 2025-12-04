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
      // Permitir herramientas como Postman (origin vacío)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Origen no permitido por CORS: " + origin));
      }
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
