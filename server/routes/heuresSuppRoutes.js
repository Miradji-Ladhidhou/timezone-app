const express = require('express');
const router = express.Router();
const { verifyToken, restrictTo } = require('../middleware/authMiddleware');
const {
  creerHeuresSuppPourUtilisateur,
  getMesHeuresSupp,
  getAllHeuresSupp,
  majHeuresSupp,
  supprimerHeuresSupp
} = require('../controllers/heuresSuppController');

// Toutes les routes sont protégées par un token
router.use(verifyToken);

// Employé
router.get('/mes', getMesHeuresSupp);        // Voir ses heures
router.post('/', creerHeuresSuppPourUtilisateur); // Calcul automatique (via pointage)
router.put('/:id', majHeuresSupp);         // Modifier (statut, heures récupérées...)

// Admin uniquement
router.get('/', restrictTo('admin'), getAllHeuresSupp);         // Lister tout
router.delete('/:id', restrictTo('admin'), supprimerHeuresSupp); // Supprimer

module.exports = router;

