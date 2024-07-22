require("dotenv").config();
const express = require("express");
const app = express();
const db = require("../models/index");
const path = require("path");

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

const authRoutes = require("./routes/auth-routes");
app.use("/api", authRoutes);

const userRoutes = require("./routes/user-routes");
app.use("/api", userRoutes);
