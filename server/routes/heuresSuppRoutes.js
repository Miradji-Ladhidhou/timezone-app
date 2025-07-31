const express = require('express');
const router = express.Router();
const { verifyToken, restrictTo } = require('../middleware/authMiddleware');
const {
  creerHeuresSuppPourUtilisateur,
  getMesHeuresSupp,
  getAllHeuresSupp,
  majHeuresSupp,
  supprimerHeuresSupp
} = require('../controllers/heuresSuppController');

// Toutes les routes ci-dessous sont protégées par un token JWT
router.use(verifyToken);

/**
 * @route GET /api/heures/mes
 * @group Heures supplémentaires - Employé
 * @summary Récupère les heures supplémentaires de l'utilisateur connecté
 * @returns {Array<HeuresSupp>} 200 - Liste des heures
 * @returns {Error} 401 - Non autorisé
 * @returns {Error} 500 - Erreur serveur
 */
router.get('/mes', getMesHeuresSupp);

/**
 * @route POST /api/heures
 * @group Heures supplémentaires - Employé
 * @summary Déclenche le calcul automatique des heures supplémentaires pour un jour donné
 * @param {Object} body.userId.required - ID utilisateur (déduit du token)
 * @param {Object} body.date.required - Date concernée
 * @returns {string} 200 - Heures supplémentaires calculées
 * @returns {Error} 400/500 - Erreur de données ou serveur
 */
router.post('/', creerHeuresSuppPourUtilisateur);

/**
 * @route PUT /api/heures/:id
 * @group Heures supplémentaires - Employé/Admin
 * @summary Met à jour les heures récupérées ou le statut d’une ligne
 * @param {integer} id.path.required - ID de la ligne à mettre à jour
 * @returns {HeuresSupp.model} 200 - Objet mis à jour
 * @returns {Error} 404 - Ligne non trouvée
 * @returns {Error} 500 - Erreur serveur
 */
router.put('/:id', majHeuresSupp);

/**
 * @route GET /api/heures
 * @group Heures supplémentaires - Admin/Secrétaire
 * @summary Liste toutes les heures supplémentaires de tous les utilisateurs
 * @returns {Array<HeuresSupp>} 200 - Liste des heures
 * @returns {Error} 403 - Accès interdit
 */
router.get('/', restrictTo('admin','secretaire'), getAllHeuresSupp);

/**
 * @route DELETE /api/heures/:id
 * @group Heures supplémentaires - Admin
 * @summary Supprime une ligne d’heures supplémentaires
 * @param {integer} id.path.required - ID à supprimer
 * @returns {string} 200 - Message de confirmation
 * @returns {Error} 403 - Accès interdit
 * @returns {Error} 404 - Introuvable
 */
router.delete('/:id', restrictTo('admin'), supprimerHeuresSupp);

module.exports = router;
