const express = require("express");
const cors = require("cors");
const routerLab = require("./routes/routes");
require("dotenv").config();
const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // enable set cookies
  })
); // permite llamadas desde tu frontend React
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
