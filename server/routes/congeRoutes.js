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
const  { authorizeRoles } = require('../middleware/authorizeRoles');

// Employé
router.post('/', verifyToken, creerConge);
router.get('/mes', verifyToken, mesConges);

// Tous
router.get('/valides', verifyToken, congesValides);

// Admin/Secrétaire
router.get('/', verifyToken, authorizeRoles('admin', 'secretaire'), tousLesConges);
router.put('/:id', verifyToken, authorizeRoles('admin', 'secretaire'), miseAJourStatut);
router.delete('/:id', verifyToken, authorizeRoles('admin', 'secretaire'), supprimerConge);

module.exports = router;