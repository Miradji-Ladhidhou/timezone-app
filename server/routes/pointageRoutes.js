const express = require('express');
const router = express.Router();
const { creerPointage, listerMesPointages, modifierPointage, supprimerPointage, listerPointagesDuJour, calculerHeuresTravaillees } = require('../controllers/pointageController');
const { verifyToken, restrictTo } = require('../middleware/authMiddleware'); 

router.post('/', verifyToken, creerPointage);
router.get('/', verifyToken, listerMesPointages);
router.get('/aujourdhui', verifyToken, listerPointagesDuJour);
router.get('/duree/aujourdhui', verifyToken, calculerHeuresTravaillees);
router.put('/:id', verifyToken, restrictTo('admin'), modifierPointage);
router.delete('/:id', verifyToken, restrictTo('admin'), supprimerPointage);

module.exports = router;
