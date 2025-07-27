const express = require('express');
const router = express.Router();
const { exportPointagesCSV } = require('../controllers/exportController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/authorizeRoles');

router.get('/csv', verifyToken, authorizeRoles('admin', 'secretaire'), exportPointagesCSV);

module.exports = router;
