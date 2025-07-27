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

// Admin & Secrétaire uniquement
router.use(verifyToken, authorizeRoles('admin', 'secretaire'));

router.get('/', listerDates);
router.post('/', creerDate);
router.put('/:id', mettreAJourDate);
router.delete('/:id', supprimerDate);

module.exports = router;
