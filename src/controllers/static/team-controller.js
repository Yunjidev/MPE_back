const { sequelize } = require("../../../models/index");
const Team = sequelize.models.Team;
const files = require("../../utils/files");

exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "id"],
      },
    });
    const teamsData = teams.map((team) => {
      if (team.photo) {
        const photoUrl = files.getUrl(req, "teams/photo", team.photo);
        team.dataValues.photo = photoUrl;
      }
      return team.dataValues;
    });
    res.status(200).json(teamsData);
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.getTeamById = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findByPk(id, {
      attributes: {
        exclude: ["createdAt", "updatedAt", "id"],
      },
    });
    if (!team) {
      return res.status(404).json({ errors: "Pas de team trouvée" });
    }
    if (team.photo) {
      const photoUrl = files.getUrl(req, "teams/photo", team.photo);
      team.dataValues.avatar = photoUrl;
    }
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ errors: error.errors });
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
    res.status(201).json({ message: "Team créée" });
  } catch (error) {
    return res.status(500).json({ errors: error.errors });
  }
};

exports.updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstname,
      lastname,
      email,
      github,
      linkedin,
      description,
      removePhoto,
    } = req.body;
    const photo = req.file ? req.file.path : null;
    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ errors: "Pas de team trouvée" });
    }
    team.firstname = firstname || team.firstname;
    team.lastname = lastname || team.lastname;
    team.email = email || team.email;
    team.github = github || team.github;
    team.linkedin = linkedin || team.linkedin;
    team.description = description || team.description;
    if (photo) {
      if (team.photo) {
        files.deleteFile(team.photo);
      }
      team.photo = photo;
    } else if (removePhoto === "true" && team.photo) {
      files.deleteFile(team.photo);
      team.photo = null;
    }
    await team.save();
    res.status(200).json({ message: "Team modifiée" });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ errors: "Pas de team trouvée" });
    }
    if (team.photo) {
      files.deleteFile(team.photo);
    }
    await team.destroy();
    res.status(200).json({ message: "team supprimée" });
  } catch (error) {
    res.status(500).json({ errors: error.errors });
  }
};
