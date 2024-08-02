const updateResource = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const resource = req.resource;
    console.log(resource);

    Object.keys(updates).forEach((key) => {
      resource[key] = updates[key];
    });

    await resource.save();
    res.status(200).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateResource };
