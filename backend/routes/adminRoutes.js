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

const {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
} = require('../controllers/companyController');

const {
  getOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
} = require('../controllers/offerController');

const { protect, authorize } = require('../middleware/auth');

// All admin routes require auth + admin role
router.use(protect);
router.use(authorize('admin'));

//
// USERS
//
router.get('/users', getUsers);
router.post('/users', createUser);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/toggle-active', toggleUserActive);

//
// COMPANIES
//
router.get('/companies', getCompanies);
router.post('/companies', createCompany);
router.get('/companies/:id', getCompanyById);
router.put('/companies/:id', updateCompany);
router.delete('/companies/:id', deleteCompany);

//
// OFFERS
//
router.get('/offers', getOffers);
router.post('/offers', createOffer);
router.get('/offers/:id', getOfferById);
router.put('/offers/:id', updateOffer);
router.delete('/offers/:id', deleteOffer);

//
// STATS
//
router.get('/stats', getStats);

module.exports = router;
