const express = require('express');
const router = express.Router();
const {
  creerPointage,
  listerMesPointages,
  listerTousLesPointages,
  calculerHeuresTravaillees,
  modifierPointage
} = require('../controllers/pointageController');
const { verifyToken, restrictTo } = require('../middleware/authMiddleware');

// Toutes les routes nécessitent un token JWT valide
router.use(verifyToken);

/**
 * @route POST /api/pointages
 * @group Pointages - Employé
 * @summary Crée ou met à jour un pointage pour un type donné (entrée, pause, reprise, sortie)
 * @param {string} body.type.required - Type de pointage
 * @param {string} body.date.required - Date (format YYYY-MM-DD)
 * @param {string} body.heure.required - Heure (format HH:mm)
 * @returns {Pointage.model} 200 - Pointage enregistré
 * @returns {Error} 400 - Données manquantes ou invalides
 * @returns {Error} 500 - Erreur serveur
 */
router.post('/', creerPointage);

/**
 * @route GET /api/pointages
 * @group Pointages - Employé
 * @summary Récupère la liste des pointages de l’utilisateur connecté
 * @returns {Array<Pointage>} 200 - Liste des pointages
 * @returns {Error} 401 - Non autorisé
 */
router.get('/', listerMesPointages);

/**
 * @route GET /api/pointages/duree/aujourdhui
 * @group Pointages - Employé
 * @summary Calcule la durée travaillée aujourd’hui pour l’utilisateur connecté
 * @returns {Object} 200 - Objet contenant la durée et les minutes totales
 * @returns {Error} 500 - Erreur serveur
 */
router.get('/duree/aujourdhui', calculerHeuresTravaillees);

/**
 * @route GET /api/pointages/admin
 * @group Pointages - Admin/Secrétaire
 * @summary Récupère la liste de tous les pointages de tous les utilisateurs
 * @returns {Array<Pointage>} 200 - Liste complète
 * @returns {Error} 403 - Accès interdit
 */
router.get('/admin', restrictTo('admin', 'secretaire'), listerTousLesPointages);

/**
 * @route PUT /api/pointages/admin/:id
 * @group Pointages - Admin/Secrétaire
 * @summary Met à jour un pointage (heures d'entrée, pause, reprise, sortie)
 * @param {integer} id.path.required - ID du pointage à modifier
 * @returns {Pointage.model} 200 - Pointage mis à jour
 * @returns {Error} 404 - Pointage non trouvé
 * @returns {Error} 500 - Erreur serveur
 */
router.put('/admin/:id', restrictTo('admin', 'secretaire'), modifierPointage);

module.exports = router;
