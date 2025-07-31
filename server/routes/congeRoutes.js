const express = require('express');
const router = express.Router();
const {
  creerConge,
  mesConges,
  congesValides,
  tousLesConges,
  miseAJourStatut,
  supprimerConge
} = require('../controllers/congeController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/authorizeRoles');

/**
 * @route POST /api/conges
 * @group Congés
 * @summary Création d'une demande de congé
 * @security BearerAuth
 * @param {string} type.body.required - Type de congé
 * @param {string} dateDebut.body.required - Date de début (YYYY-MM-DD)
 * @param {string} dateFin.body.required - Date de fin (YYYY-MM-DD)
 * @returns {Object} 201 - Demande enregistrée
 * @returns {Error} 400 - Dates invalides
 */
router.post('/', verifyToken, creerConge);

/**
 * @route GET /api/conges/mes
 * @group Congés
 * @summary Récupère les congés de l'utilisateur connecté
 * @security BearerAuth
 * @returns {Array<Conge>} 200 - Liste des congés
 */
router.get('/mes', verifyToken, mesConges);

/**
 * @route GET /api/conges/valides
 * @group Congés
 * @summary Récupère tous les congés validés
 * @security BearerAuth
 * @returns {Array<Conge>} 200 - Liste des congés validés
 */
router.get('/valides', verifyToken, congesValides);

/**
 * @route GET /api/conges
 * @group Congés
 * @summary Récupère tous les congés pour les rôles admin/secretaire
 * @security BearerAuth
 * @returns {Array<Conge>} 200 - Liste complète des congés
 * @returns {Error} 403 - Accès interdit
 */
router.get('/', verifyToken, authorizeRoles('admin', 'secretaire'), tousLesConges);

/**
 * @route PUT /api/conges/:id
 * @group Congés
 * @summary Met à jour le statut d'un congé (valider/refuser)
 * @security BearerAuth
 * @param {string} statut.body.required - Nouveau statut ('valide' ou 'refuse')
 * @param {string} [motifRefus.body] - Motif si refus
 * @returns {Object} 200 - Congé mis à jour
 * @returns {Error} 400 - Motif requis si refus
 */
router.put('/:id', verifyToken, authorizeRoles('admin', 'secretaire'), miseAJourStatut);

/**
 * @route DELETE /api/conges/:id
 * @group Congés
 * @summary Supprime une demande de congé en attente
 * @security BearerAuth
 * @returns {Object} 200 - Confirmation de suppression
 * @returns {Error} 400 - Suppression non autorisée (congé validé ou refusé)
 */
router.delete('/:id', verifyToken, authorizeRoles('admin', 'secretaire'), supprimerConge);

module.exports = router;
