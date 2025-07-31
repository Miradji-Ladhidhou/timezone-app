const { User } = require('../models');
const bcrypt = require('bcrypt');

/**
 * @function getAllUsers
 * @description Récupère tous les utilisateurs (sans le mot de passe)
 * @route GET /api/users
 * @access Admin
 * @returns {Array<Object>} 200 - Liste des utilisateurs
 */
const getAllUsers = async (req, res) => {
  const users = await User.findAll({ attributes: { exclude: ['motDePasse'] } });
  res.json(users);
};

/**
 * @function getUserById
 * @description Récupère un utilisateur par son ID
 * @route GET /api/users/:id
 * @access Admin
 * @param {string} req.params.id - ID de l’utilisateur
 * @returns {Object} 200 - Données de l’utilisateur
 * @returns {Object} 404 - Utilisateur non trouvé
 */
const getUserById = async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['motDePasse'] }
  });
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
  res.json(user);
};

/**
 * @function updateUser
 * @description Met à jour les informations d’un utilisateur (admin uniquement)
 * @route PUT /api/users/:id
 * @access Admin
 * @param {Object} req.body - Contient les champs à mettre à jour (nom, email, motDePasse, role)
 * @returns {Object} 200 - Utilisateur mis à jour
 * @returns {Object} 404 - Utilisateur non trouvé
 */
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

/**
 * @function deleteUser
 * @description Supprime un utilisateur par son ID
 * @route DELETE /api/users/:id
 * @access Admin
 * @returns {Object} 200 - Message de confirmation
 * @returns {Object} 404 - Utilisateur non trouvé
 */
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
