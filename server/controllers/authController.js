const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * @function register
 * @description Inscription d’un nouvel utilisateur
 * @route POST /api/auth/register
 * @param {Object} req - Requête Express contenant { nom, email, motDePasse, role }
 * @param {Object} res - Réponse Express
 * @returns {Object} 201 - Utilisateur créé
 * @returns {Object} 400 - Erreur lors de la création
 */
const register = async (req, res) => {
  try {
    const { nom, email, motDePasse, role } = req.body;
    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    const user = await User.create({
      nom,
      email,
      motDePasse: hashedPassword,
      role
    });

    res.status(201).json({ message: 'Utilisateur créé', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * @function login
 * @description Connexion utilisateur avec email et mot de passe
 * @route POST /api/auth/login
 * @param {Object} req - Requête Express contenant { email, motDePasse }
 * @param {Object} res - Réponse Express
 * @returns {Object} 200 - JWT + infos utilisateur
 * @returns {Object} 404 - Utilisateur non trouvé
 * @returns {Object} 401 - Mot de passe invalide
 * @returns {Object} 500 - Erreur serveur
 */
const login = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!isMatch) return res.status(401).json({ message: 'Mot de passe invalide' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '2h'
    });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @function getMe
 * @description Récupère les informations du user connecté
 * @route GET /api/auth/me
 * @param {Object} req - Requête Express avec req.user (JWT décodé)
 * @param {Object} res - Réponse Express
 * @returns {Object} 200 - Infos utilisateur
 * @returns {Object} 404 - Utilisateur non trouvé
 * @returns {Object} 500 - Erreur serveur
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'nom', 'email', 'role'],
    });

    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login, getMe };
