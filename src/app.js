require("dotenv").config();
const express = require("express");
const app = express();
const db = require("../models/index");
const path = require("path");
const cors = require("cors");
// Routes
const publicRoutes = require("./routes/public/public-routes");
const authenticatedRoutes = require("./routes/authenticated/authenticated-routes");
const adminRoutes = require("./routes/admin/admin-routes");

const corsOptions = {
  origin: "http://localhost:5173",
  exposedHeaders: ["Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

db.sequelize
  .authenticate()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.log("Error:" + error));

app.use("/api", publicRoutes);
app.use("/api", authenticatedRoutes);
app.use("/api", adminRoutes);
