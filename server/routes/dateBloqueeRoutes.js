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

// Tout le monde authentifié peut lire les dates bloquées
router.get('/', verifyToken, listerDates);

// Écriture réservée à admin & secrétaire
router.post('/', verifyToken, authorizeRoles('admin', 'secretaire'), creerDate);
router.put('/:id', verifyToken, authorizeRoles('admin', 'secretaire'), mettreAJourDate);
router.delete('/:id', verifyToken, authorizeRoles('admin', 'secretaire'), supprimerDate);

module.exports = router;

