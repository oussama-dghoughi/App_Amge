const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, authorize } = require('../middleware/auth');
const planController = require('../controllers/planController');

// Configuration Multer pour upload CSV
const uploadCSV = multer({
    dest: 'uploads/temp/',
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        } else {
            cb(new Error('Seuls les fichiers CSV sont acceptés'));
        }
    }
});

// Configuration Multer pour upload d'images de plan
const storageImage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/plans/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'plan-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const uploadImage = multer({
    storage: storageImage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            cb(null, true);
        } else {
            cb(new Error('Seules les images (JPG, PNG, WEBP) sont acceptées'));
        }
    }
});

// Routes publiques (pour l'app mobile)
router.get('/active', planController.getActivePlan);

// Routes admin protégées
router.get('/', protect, authorize('admin'), planController.getAllPlans);
router.post('/', protect, authorize('admin'), planController.createPlan);
router.patch('/:id', protect, authorize('admin'), planController.updatePlan);
router.patch('/:id/activate', protect, authorize('admin'), planController.activatePlan);

// Gestion des stands (IMPORTANT: routes spécifiques avant routes génériques)
router.get('/:id/stands', protect, authorize('admin'), planController.getStandsByPlan);
router.post('/:id/stands', protect, authorize('admin'), planController.createStand);
router.post('/:id/import-csv', protect, authorize('admin'), uploadCSV.single('csvFile'), planController.importCsvStands);
router.post('/:id/upload-image', protect, authorize('admin'), uploadImage.single('image'), planController.uploadPlanImage);
router.delete('/:id/stands', protect, authorize('admin'), planController.deleteAllStands);

// Suppression de plan (DOIT être après /:id/stands)
router.delete('/:id', protect, authorize('admin'), planController.deletePlan);

module.exports = router;
