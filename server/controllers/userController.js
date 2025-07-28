const { User } = require('../models');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
  const users = await User.findAll({ attributes: { exclude: ['motDePasse'] } });
  res.json(users);
};

const getUserById = async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['motDePasse'] }
  });
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
  res.json(user);
};

const updateUser = async (req, res) => {
  const { nom, email, motDePasse, role } = req.body;
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

  if (motDePasse) {
    const hash = await bcrypt.hash(motDePasse, 10);
    user.motDePasse = hash;
  }

  user.nom = nom || user.nom;
  user.email = email || user.email;
  user.role = role || user.role;

  await user.save();
  res.json({ message: "Utilisateur mis à jour", user });
};

const deleteUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

  await user.destroy();
  res.json({ message: "Utilisateur supprimé" });
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
