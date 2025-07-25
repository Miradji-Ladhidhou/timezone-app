const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Route test protégée
router.get('/me', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Token valide', user: req.user });
});

module.exports = router;
