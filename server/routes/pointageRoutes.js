const express = require('express');
const router = express.Router();
const { creerPointage, listerMesPointages, listerTousLesPointages, calculerHeuresTravaillees, modifierPointage } = require('../controllers/pointageController');
const { verifyToken, restrictTo } = require('../middleware/authMiddleware');

router.use(verifyToken);

// Créer 
router.post('/', verifyToken, creerPointage);

// Voir ses propres pointages (employé)
router.get('/', verifyToken, listerMesPointages);

router.get('/duree/aujourdhui', calculerHeuresTravaillees);

// routes/adminPointages.js
router.get('/admin', verifyToken, restrictTo('admin', 'secretaire'), listerTousLesPointages);
router.put('/admin/:id', verifyToken, restrictTo('admin', 'secretaire'), modifierPointage);

module.exports = router;
