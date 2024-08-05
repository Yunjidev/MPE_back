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
    const { firstname, lastname, email, github, linkedin, photo,  description } =
      req.body;
    const newTeam = await Team.create({
      firstname,
      lastname,
      email,
      github,
      linkedin,
      photo,
      description,
    });
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, email, github, linkedin, photo, description } =
      req.body;
    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ message: "Pas de team trouvée" });
    }
    team.firstname = firstname || team.firstname;
    team.lastname = lastname || team.lastname;
    team.email = email || team.email;
    team.github = github || team.github;
    team.linkedin = linkedin || team.linkedin;
    team.photo = photo || team.photo;
    team.description = description || team.description;
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
