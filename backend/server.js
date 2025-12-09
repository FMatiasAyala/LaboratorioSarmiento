const express = require("express");
const cors = require("cors");
const routerLab = require("./routes/routes");
require("dotenv").config();
const app = express();

const allowedOrigins = [
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "https://bulonxpress.online",
  "https://www.bulonxpress.online",
  "https://portal.bulonxpress.online"
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS bloqueado para: " + origin));
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
