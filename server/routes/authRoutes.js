const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

/**
 * @route POST /api/auth/register
 * @group Authentification
 * @summary Inscription d’un nouvel utilisateur
 * @param {string} nom.body.required - Nom complet
 * @param {string} email.body.required - Email
 * @param {string} motDePasse.body.required - Mot de passe
 * @param {string} role.body.optional - Rôle (admin, secretaire, employe)
 * @returns {Object} 201 - Utilisateur créé + message
 * @returns {Error} 400 - Erreur de validation ou d’enregistrement
 */
router.post('/register', authController.register);

/**
 * @route POST /api/auth/login
 * @group Authentification
 * @summary Connexion utilisateur
 * @param {string} email.body.required - Email
 * @param {string} motDePasse.body.required - Mot de passe
 * @returns {Object} 200 - Token + infos utilisateur
 * @returns {Error} 404 - Utilisateur non trouvé
 * @returns {Error} 401 - Mot de passe invalide
 */
router.post('/login', authController.login);

/**
 * @route GET /api/auth/me
 * @group Authentification
 * @summary Récupère les infos du user connecté
 * @security BearerAuth
 * @returns {Object} 200 - Infos utilisateur
 * @returns {Error} 401 - Non autorisé (token manquant ou invalide)
 */
router.get('/me', verifyToken, authController.getMe);

module.exports = router;
