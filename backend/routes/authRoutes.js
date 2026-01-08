const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Routes publiques
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Le nom est requis'),
    body('surname').trim().notEmpty().withMessage('Le prénom est requis'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Veuillez entrer un email valide'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    body('userType')
      .optional()
      .isIn(['etudiant', 'salarie', 'autre'])
      .withMessage('Le type d\'utilisateur doit être: etudiant, salarie ou autre'),
  ],
  register
);

router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Veuillez entrer un email valide'),
    body('password').notEmpty().withMessage('Le mot de passe est requis'),
  ],
  login
);

// Routes protégées
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;

