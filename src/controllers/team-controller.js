const { sequelize } = require("../../models/index");
const Team = sequelize.models.Team;

exports.getAllTeams = async (req, res) => {
  try {
    const team = await Team.findAll();
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTeamById = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ message: "Pas de team trouvée" });
    }
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTeam = async (req, res) => {
  try {
    const { firstname, lastname, email, github, linkedin, description } =
      req.body;
    const photo = req.file ? req.file.path : null;
    const newTeam = await Team.create({
      firstname,
      lastname,
      email,
      github,
      linkedin,
      description,
      photo,
    });
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, email, github, linkedin, description } =
      req.body;
    const photo = req.file ? req.file.path : null;
    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ message: "Pas de team trouvée" });
    }
    team.firstname = firstname || team.firstname;
    team.lastname = lastname || team.lastname;
    team.email = email || team.email;
    team.github = github || team.github;
    team.linkedin = linkedin || team.linkedin;
    team.description = description || team.description;
    team.photo = photo || team.photo;
    await team.save();
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ message: "Pas de team trouvée" });
    }
    await team.destroy();
    res.status(200).json({ message: "team supprimée" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
