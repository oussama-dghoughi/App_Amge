const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');
const { protect, authorize } = require('../middleware/auth');

// Routes publiques
router.get('/', faqController.getAllFaqs);

// Routes protégées (Admin seulement)
router.post('/', protect, authorize('admin', 'superadmin'), faqController.createFaq);
router.put('/:id', protect, authorize('admin', 'superadmin'), faqController.updateFaq);
router.delete('/:id', protect, authorize('admin', 'superadmin'), faqController.deleteFaq);

module.exports = router;
