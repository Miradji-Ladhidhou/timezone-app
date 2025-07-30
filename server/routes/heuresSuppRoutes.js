const express = require('express');
const router = express.Router();
const { verifyToken, restrictTo } = require('../middleware/authMiddleware');
const {
  creerHeuresSupp,
  getMesHeuresSupp,
  getAllHeuresSupp,
  majHeuresSupp,
  supprimerHeuresSupp
} = require('../controllers/heuresSuppController');

router.use(verifyToken);

// Employé
router.get('/mes', getMesHeuresSupp);
router.post('/', creerHeuresSupp);

// Admin
router.get('/', restrictTo('admin'), getAllHeuresSupp);
router.put('/:id', restrictTo('admin'), majHeuresSupp);
router.delete('/:id', restrictTo('admin'), supprimerHeuresSupp);

module.exports = router;
