const express = require('express');
const router = express.Router();
const { exportPointagesCSV } = require('../controllers/exportController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/authorizeRoles');

/**
 * @route GET /api/export/csv
 * @group Export
 * @summary Exporte les pointages du jour au format CSV (admin/secrétaire uniquement)
 * @security BearerAuth
 * @returns {string} 200 - Fichier CSV des pointages du jour
 * @returns {Error} 403 - Accès interdit (non autorisé)
 * @returns {Error} 500 - Erreur serveur
 */
router.get('/csv', verifyToken, authorizeRoles('admin', 'secretaire'), exportPointagesCSV);

module.exports = router;
