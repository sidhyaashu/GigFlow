const express = require('express');
const router = express.Router();
const {
  submitBid,
  getGigBids,
  hireFreelancer,
} = require('../controllers/bidController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, submitBid);
router.get('/:gigId', protect, getGigBids);
router.patch('/:bidId/hire', protect, hireFreelancer);

module.exports = router;
