const Gig = require('../models/Gig');

const redisClient = require('../config/redis');

// @desc    Get all open gigs (with search)
// @route   GET /api/gigs
// @access  Public
const getGigs = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          title: {
            $regex: req.query.search,
            $options: 'i',
          },
        }
      : {};

    const cacheKey = `gigs:${JSON.stringify(keyword)}`;

    // Check Cache
    if (redisClient.isOpen) {
        try {
            const cachedGigs = await redisClient.get(cacheKey);
            if (cachedGigs) {
                console.log('Serving from Cache');
                return res.json(JSON.parse(cachedGigs));
            }
        } catch (error) {
            console.error('Redis Get Error:', error);
        }
    }

    // Only return open gigs
    const gigs = await Gig.find({ ...keyword, status: 'open' })
      .populate('ownerId', 'name email') // Populate owner info
      .sort({ createdAt: -1 });

    // Set Cache (expires in 60s)
    if (redisClient.isOpen) {
        try {
            await redisClient.set(cacheKey, JSON.stringify(gigs), {
                EX: 60
            });
        } catch (error) {
            console.error('Redis Set Error:', error);
        }
    }

    res.json(gigs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create a new gig
// @route   POST /api/gigs
// @access  Private
const createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    const gig = new Gig({
      title,
      description,
      budget,
      ownerId: req.user._id,
    });

    const createdGig = await gig.save();

    // Clear Cache
    if (redisClient.isOpen) {
        try {
            const keys = await redisClient.keys('gigs:*');
            if (keys.length > 0) {
                await redisClient.del(keys);
            }
        } catch (error) {
            console.error('Redis Clear Error:', error);
        }
    }
    
    res.status(201).json(createdGig);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get gigs posted by current user
// @route   GET /api/gigs/my-gigs
// @access  Private
const getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get gig by ID
// @route   GET /api/gigs/:id
// @access  Public
const getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('ownerId', 'name email');
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }
    res.json(gig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getGigs,
  createGig,
  getMyGigs,
  getGigById,
};
