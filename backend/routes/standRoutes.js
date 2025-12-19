const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const planController = require('../controllers/planController');

// PATCH /api/stands/:id - Modifier un stand
router.patch('/:id', protect, authorize('admin'), planController.updateStand);

// DELETE /api/stands/:id - Supprimer un stand
router.delete('/:id', protect, authorize('admin'), planController.deleteStand);

module.exports = router;
