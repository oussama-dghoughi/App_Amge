const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserActive,
  getStats,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Toutes les routes admin nécessitent une authentification et le rôle admin
router.use(protect);
router.use(authorize('admin'));

// Routes de gestion des utilisateurs
router.get('/users', getUsers);
router.post('/users', createUser);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/toggle-active', toggleUserActive);

// Routes de statistiques
router.get('/stats', getStats);

module.exports = router;

