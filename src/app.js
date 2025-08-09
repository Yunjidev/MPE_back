require("dotenv").config();
const express = require("express");
const http = require("http");
const { initIo } = require("./io");
const app = express();
const db = require("../models/index");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
// Routes
const publicRoutes = require("./routes/public/public-routes");
const authenticatedRoutes = require("./routes/authenticated/authenticated-routes");
const adminRoutes = require("./routes/admin/admin-routes");

const corsOptions = {
  origin: "http://localhost:5173",
  exposedHeaders: ["Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true, charset: "utf-8" }));

app.use((req, res, next) => {
  res.charset = "UTF-8";
  next();
});

const server = http.createServer(app);
initIo(server);

db.sequelize
  .authenticate()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log("Error:" + error));

const uploadDir = path.resolve(__dirname, "../uploads");
app.use("/app/uploads", express.static(uploadDir));

app.use("/api", publicRoutes);
app.use("/api", authenticatedRoutes);
app.use("/api", adminRoutes);
app.use((err, req, res, next) => {
  console.error("❌ ERREUR SERVER :", err);
  res.status(500).json({ message: "Erreur serveur", error: err.message });
});