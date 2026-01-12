const mongoose = require('mongoose');
const Bid = require('../models/Bid');
const Gig = require('../models/Gig');

// @desc    Submit a bid for a gig
// @route   POST /api/bids
// @access  Private
const submitBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot bid on your own gig' });
    }
    
    if (gig.status !== 'open') {
        return res.status(400).json({ message: 'Gig is not open for bidding' });
    }

    const existingBid = await Bid.findOne({ gigId, freelancerId: req.user._id });
    if (existingBid) {
      return res.status(400).json({ message: 'You have already placed a bid on this gig' });
    }

    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      message,
      price,
    });

    res.status(201).json(bid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all bids for a specific gig (Owner only)
// @route   GET /api/bids/:gigId
// @access  Private
const getGigBids = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view bids for this gig' });
    }

    const bids = await Bid.find({ gigId: req.params.gigId })
      .populate('freelancerId', 'name email')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Hire a freelancer (Atomic Transaction)
// @route   PATCH /api/bids/:bidId/hire
// @access  Private
const hireFreelancer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bid = await Bid.findById(req.params.bidId).session(session);
    if (!bid) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Bid not found' });
    }

    const gig = await Gig.findById(bid.gigId).session(session);
    if (!gig) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Authorization Check
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ message: 'Not authorized to hire for this gig' });
    }

    // Race Condition Check: Validate Gig is still Open
    if (gig.status !== 'open') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Gig is no longer open' });
    }

    // 1. Update Bid Status to Hired
    bid.status = 'hired';
    await bid.save({ session });

    // 2. Update Gig Status and Assigned Freelancer
    gig.status = 'assigned';
    gig.freelancerId = bid.freelancerId;
    await gig.save({ session });

    // 3. Reject other bids
    await Bid.updateMany(
      { gigId: gig._id, _id: { $ne: bid._id } },
      { status: 'rejected' }
    ).session(session);

    await session.commitTransaction();
    session.endSession();

    // Emit Socket.io event for real-time notification
    const io = req.app.get('io');
    io.to(bid.freelancerId.toString()).emit('notification', { message: `You have been hired for ${gig.title}` });

    // Clear Cache (As gig is no longer open)
    const redisClient = require('../config/redis'); // Lazy load to avoid circular dep if needed, or better move to top if clean
    try {
        if(redisClient.isOpen) {
             const keys = await redisClient.keys('gigs:*');
             if (keys.length > 0) {
                 await redisClient.del(keys);
             }
        }
    } catch(e) {
        console.error("Cache clear error", e);
    }

    res.json({ message: 'Freelancer hired successfully', bid });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    res.status(500).json({ message: 'Transaction failed: ' + err.message });
  }
};

module.exports = {
  submitBid,
  getGigBids,
  hireFreelancer,
};
