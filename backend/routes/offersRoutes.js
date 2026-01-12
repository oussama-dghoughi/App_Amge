const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const offerController = require('../controllers/offerController');

// Public routes
// GET /api/offers - Get all offers
router.get('/', offerController.getOffers);

// GET /api/offers/:id - Get single offer
router.get('/:id', offerController.getOfferById);

// Admin routes
// POST /api/offers - Create new offer
router.post('/', protect, authorize('admin'), offerController.createOffer);

// PUT /api/offers/:id - Update offer
router.put('/:id', protect, authorize('admin'), offerController.updateOffer);

// DELETE /api/offers/:id - Delete offer
router.delete('/:id', protect, authorize('admin'), offerController.deleteOffer);

module.exports = router;