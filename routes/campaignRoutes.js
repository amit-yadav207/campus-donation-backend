// const express = require('express');
// const { createCampaign, getAllActiveCampaigns, donateToCampaign, getAllCampaigns,getAllDonors } = require('../controllers/campaignController');
// const authMiddleware = require('../middlewares/authMiddleware');
// const router = express.Router();


// router.get('/', getAllCampaigns);
// router.get('/:id', getCampaignById);
// router.post('/create', authMiddleware, createCampaign);
// router.get('/active', getAllActiveCampaigns);
// // router.post('/donate', authMiddleware, donateToCampaign);
// router.post('/:id/donate', authMiddleware, donateToCampaign);
// router.get('/:id/donor', getAllDonors);

// module.exports = router;



const express = require('express');
const {
    createCampaign,
    getAllCampaigns,
    getCampaignById,
    updateCampaign,
    deleteCampaign,
    getAllActiveCampaigns,
    donateToCampaign,
    getAllDonors
} = require('../controllers/campaignController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', getAllCampaigns);                 // Get all campaigns
router.get('/active', getAllActiveCampaigns);      // Get all active campaigns
router.get('/:id', getCampaignById);              // Get a campaign by ID
router.post('/create', authMiddleware, createCampaign);  // Create a new campaign (auth required)
router.put('/:id', authMiddleware, updateCampaign);  // Update a campaign (auth required)
router.delete('/:id', authMiddleware, deleteCampaign); // Delete a campaign (auth required)
router.post('/:id/donate', authMiddleware, donateToCampaign); // Donate to a campaign
router.get('/:id/donor', getAllDonors);            // Get all donors for a specific campaign

module.exports = router;
