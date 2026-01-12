const express = require('express');
const router = express.Router();
const {
  getGigs,
  createGig,
  getMyGigs,
  getGigById,
} = require('../controllers/gigController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getGigs);
router.post('/', protect, createGig);
router.get('/my-gigs', protect, getMyGigs);
router.get('/:id', getGigById);

module.exports = router;
