const express = require("express");
const cors = require("cors");
const routerLab = require("./routes/routes");
require("dotenv").config();

const app = express();

app.use((req, res, next) => {
  console.log("ORIGIN:", req.headers.origin);
  console.log("METHOD:", req.method);
  next();
});

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "https://bulonxpress.online",
        "https://www.bulonxpress.online",
        "https://portal.bulonxpress.online",
      ];

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


app.use(express.json());
app.use("/api", routerLab);

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Backend OK");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});
