const { sequelize } = require("../../../models/index");
const Subscription = sequelize.models.Subscription;

exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscription = await Subscription.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "Enterprise_id"],
        include: ["id"],
      },
      include: {
        model: sequelize.models.Enterprise,
        as: "enterprise",
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "id",
            "User_id",
            "Job_id",
            "Country_id",
            "phone",
            "mail",
            "adress",
            "city",
            "zip_code",
            "isValidate",
            "facebook",
            "instagram",
            "twitter",
            "siret_number",
            "description",
            "website",
            "photos",
          ],
        },
      },
    });
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findByPk(id, {
      attributes: {
        exclude: ["createdAt", "updatedAt", "Enterprise_id"],
      },
      include: {
        model: sequelize.models.Enterprise,
        as: "enterprise",
        attributes: {
          exclude: [
            "createdAt",
            "updatedAt",
            "User_id",
            "Job_id",
            "Country_id",
            "phone",
            "mail",
            "adress",
            "city",
            "zip_code",
            "isValidate",
            "facebook",
            "instagram",
            "twitter",
            "siret_number",
            "description",
            "website",
            "photos",
          ],
        },
      },
    });
    if (!subscription) {
      return res.status(404).json({ errors: "Pas de subscription trouvée" });
    }
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.createSubscription = async (req, res) => {
  try {
    const { subscription_type, status } = req.body;
    const start_date = new Date();
    let end_date;
    switch (subscription_type) {
      case "monthly":
        end_date = new Date(start_date);
        end_date.setMonth(end_date.getMonth() + 1);
        break;
      case "yearly":
        end_date = new Date(start_date);
        end_date.setFullYear(end_date.getFullYear() + 1);
        break;
      case "forever":
        end_date = new Date(start_date);
        end_date.setFullYear(9999);
        break;
      default:
        return res
          .status(400)
          .json({ errors: "Type de subscription invalide" });
    }
    const newSubscription = await Subscription.create({
      subscription_type,
      status,
      start_date,
      end_date,
      Enterprise_id: req.enterprise.id,
    });
    res.status(201).json({ message: "Subscription créée" });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const subscription = await Subscription.findByPk(id);
    if (!subscription) {
      return res.status(404).json({ errors: "Pas de subscription trouvée" });
    }
    subscription.status = status || subscription.status;
    await subscription.save();
    res.status(200).json({ message: "Subscription modifiée" });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Requête DELETE reçue pour l'ID : ${id}`);
    const subscription = await Subscription.findByPk(id);
    if (!subscription) {
      console.log("Pas de subscription trouvée");
      return res.status(404).json({ errors: "Pas de subscription trouvée" });
    }
    await subscription.destroy();
    console.log("Subscription supprimée");
    res.status(200).json({ message: "Subscription supprimée" });
  } catch (error) {
    console.error(`Erreur lors de la suppression de la souscription ${id}:`, error);
    res.status(500).json({ errors: error.message });
  }
};
