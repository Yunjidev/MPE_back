const { sequelize } = require("../../models/index");
const Subscription = sequelize.models.Subscription;

exports.getAllSubscriptions = async (req, res) => {
  try {
    const subscription = await Subscription.findAll();
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findByPk(id);
    if (!subscription) {
      return res.status(404).json({ message: "Pas de subscription trouvée" });
    }
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createSubscription = async (req, res) => {
  try {
    const { subscription_type, status, start_date, end_date, Enterprise_id } =
      req.body;
    const enterprise =
      await sequelize.models.Enterprise.findByPk(Enterprise_id);
    if (!enterprise) {
      return res.status(404).json({ message: "Pas d'entreprise trouvée" });
    }
    const newSubscription = await Subscription.create({
      subscription_type,
      status,
      start_date,
      end_date,
      Enterprise_id,
    });
    res.status(201).json(newSubscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const subscription = await Subscription.findByPk(id);
    if (!subscription) {
      return res.status(404).json({ message: "Pas de subscription trouvée" });
    }
    subscription.status = status || subscription.status;
    await subscription.save();
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findByPk(id);
    if (!subscription) {
      return res.status(404).json({ message: "Pas de subscription trouvée" });
    }
    await subscription.destroy();
    res.status(200).json({ message: "subscription supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
