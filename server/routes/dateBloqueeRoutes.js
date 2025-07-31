const express = require('express');
const router = express.Router();
const {
  listerDates,
  creerDate,
  mettreAJourDate,
  supprimerDate
} = require('../controllers/dateBloqueeController');

const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/authorizeRoles');

/**
 * @route GET /api/dates-bloquees
 * @group DatesBloquees
 * @summary Récupère toutes les dates bloquées
 * @security BearerAuth
 * @returns {Array<Object>} 200 - Liste des dates bloquées
 * @returns {Error} 401 - Non autorisé
 */
router.get('/', verifyToken, listerDates);

/**
 * @route POST /api/dates-bloquees
 * @group DatesBloquees
 * @summary Crée une nouvelle date bloquée
 * @security BearerAuth
 * @param {string} dateDebut.body.required - Date de début (YYYY-MM-DD)
 * @param {string} dateFin.body.required - Date de fin (YYYY-MM-DD)
 * @param {string} motif.body.required - Motif de la date bloquée
 * @returns {Object} 201 - Date bloquée créée
 * @returns {Error} 403 - Accès interdit (non admin/secrétaire)
 */
router.post('/', verifyToken, authorizeRoles('admin', 'secretaire'), creerDate);

/**
 * @route PUT /api/dates-bloquees/:id
 * @group DatesBloquees
 * @summary Met à jour une date bloquée existante
 * @security BearerAuth
 * @param {string} id.path.required - ID de la date bloquée
 * @param {string} dateDebut.body - Nouvelle date de début
 * @param {string} dateFin.body - Nouvelle date de fin
 * @param {string} motif.body - Nouveau motif
 * @returns {Object} 200 - Date bloquée mise à jour
 * @returns {Error} 404 - Date non trouvée
 */
router.put('/:id', verifyToken, authorizeRoles('admin', 'secretaire'), mettreAJourDate);

/**
 * @route DELETE /api/dates-bloquees/:id
 * @group DatesBloquees
 * @summary Supprime une date bloquée
 * @security BearerAuth
 * @param {string} id.path.required - ID de la date bloquée
 * @returns {Object} 200 - Confirmation de suppression
 * @returns {Error} 404 - Date non trouvée
 */
router.delete('/:id', verifyToken, authorizeRoles('admin', 'secretaire'), supprimerDate);

module.exports = router;
