require("dotenv").config();
const express = require("express");
const app = express();
const db = require("../models/index");
const path = require("path");
const cors = require("cors");

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

const authRoutes = require("./routes/auth-routes");
app.use("/api", authRoutes);

const userRoutes = require("./routes/user-routes");
app.use("/api", userRoutes);

const enterpriseRoutes = require("./routes/enterprise-routes");
app.use("/api", enterpriseRoutes);

const jobRoutes = require("./routes/job-routes");
app.use("/api", jobRoutes);

const disponibilityRoutes = require("./routes/disponibility-routes");
app.use("/api", disponibilityRoutes);

const indisponibilityRoutes = require("./routes/indisponibility-routes");
app.use("/api", indisponibilityRoutes);

const offerRoutes = require("./routes/offer-routes");
app.use("/api", offerRoutes);

const ratingRoutes = require("./routes/rating-routes");
app.use("/api", ratingRoutes);

const reservationRoutes = require("./routes/reservation-routes");
app.use("/api", reservationRoutes);

const subscriptionRoutes = require("./routes/subscription-routes");
app.use("/api", subscriptionRoutes);

const pricingRoutes = require("./routes/pricing-routes");
app.use("/api", pricingRoutes);

const conditionsRoutes = require("./routes/conditions-routes");
app.use("/api", conditionsRoutes);

const faqRoutes = require("./routes/faq-routes");
app.use("/api", faqRoutes);

const teamRoutes = require("./routes/team-routes");
app.use("/api", teamRoutes);
