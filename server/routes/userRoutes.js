const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/authorizeRoles');

// Toutes les routes sont protégées et réservées aux administrateurs
router.use(verifyToken);
router.use(authorizeRoles('admin'));

/**
 * @route GET /api/users
 * @group Utilisateurs - Admin
 * @summary Récupère tous les utilisateurs
 * @returns {Array<User>} 200 - Liste des utilisateurs
 * @returns {Error} 401 - Non autorisé
 */
router.get('/', getAllUsers);

/**
 * @route GET /api/users/:id
 * @group Utilisateurs - Admin
 * @summary Récupère un utilisateur par ID
 * @param {integer} id.path.required - ID de l'utilisateur
 * @returns {User.model} 200 - Données de l'utilisateur
 * @returns {Error} 404 - Utilisateur non trouvé
 */
router.get('/:id', getUserById);

/**
 * @route PUT /api/users/:id
 * @group Utilisateurs - Admin
 * @summary Met à jour un utilisateur (nom, email, mot de passe, rôle)
 * @param {integer} id.path.required - ID de l'utilisateur
 * @returns {User.model} 200 - Utilisateur mis à jour
 * @returns {Error} 404 - Utilisateur non trouvé
 * @returns {Error} 500 - Erreur serveur
 */
router.put('/:id', updateUser);

/**
 * @route DELETE /api/users/:id
 * @group Utilisateurs - Admin
 * @summary Supprime un utilisateur par ID
 * @param {integer} id.path.required - ID de l'utilisateur
 * @returns {Message} 200 - Utilisateur supprimé
 * @returns {Error} 404 - Utilisateur non trouvé
 */
router.delete('/:id', deleteUser);

module.exports = router;
