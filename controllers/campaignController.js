const Campaign = require('../models/campaignModel');
const Donation = require('../models/donationModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Initialize Stripe


// Create Campaign
exports.createCampaign = async (req, res) => {
    const { title, description, goalAmount, endDate } = req.body;
    try {
        const campaign = await Campaign.create({
            title,
            description,
            goalAmount,
            endDate,
            creator: req.user.id
        });
        // console.log("at campaign cotroleer suvvess")

        res.status(201).json(campaign);
    } catch (error) {
        // console.log("at campaign cotroleer")
        res.status(400).json({ message: error.message });
    }
};



// Get all campaigns
exports.getAllCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find();
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get a campaign by ID
exports.getCampaignById = async (req, res) => {
    const { id } = req.params;

    try {
        const campaign = await Campaign.findById(id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        res.status(200).json(campaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




// Get All Active Campaigns
exports.getAllActiveCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find({ status: 'active' });
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



// Update a campaign
exports.updateCampaign = async (req, res) => {
    console.log("backedb update status :",req.body.status)
    const { id } = req.params;
    const status  = req.body.status;

    try {
        const campaign = await Campaign.findById(id);

        if (!campaign) {
            console.log('Campaign not found')
            return res.status(404).json({ message: 'Campaign not found' });
        }

        // // Update fields
        // campaign.title = title || campaign.title;
        // campaign.description = description || campaign.description;
        // campaign.goalAmount = goalAmount || campaign.goalAmount;
        // campaign.endDate = endDate || campaign.endDate;
        campaign.status = status ;

        await campaign.save();
        res.status(200).json({ message: 'Campaign updated successfully', campaign });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




// Delete a campaign
exports.deleteCampaign = async (req, res) => {
    const { id } = req.params;

    try {
        const campaign = await Campaign.findByIdAndDelete(id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        res.status(200).json({ message: 'Campaign deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};








// Donate to a Campaign with stripe
// exports.donateToCampaign = async (req, res) => {
//     const { id } = req.params; // Campaign ID from URL
//     const { amount, paymentMethodId } = req.body; // Payment method ID from request body

//     try {
//         const campaign = await Campaign.findById(id);

//         // Check if the campaign exists and is active
//         if (!campaign || campaign.status !== 'active') {
//             return res.status(404).json({ message: 'Campaign not found or inactive' });
//         }

//         // Create a payment intent with Stripe
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: amount * 100, // Stripe accepts amounts in cents
//             currency: 'usd', // Change to your desired currency
//             payment_method: paymentMethodId,
//             confirmation_method: 'manual',
//             confirm: true, // Automatically confirm the payment
//         });

//         // Check if the payment was successful
//         if (paymentIntent.status !== 'succeeded') {
//             return res.status(400).json({ message: 'Payment not successful' });
//         }

//         // Update the campaign's raised amount
//         campaign.raisedAmount += amount;
//         await campaign.save();

//         // Create a new donation record
//         const donation = new Donation({
//             donor: req.user._id, // Assuming the user's ID is available in req.user
//             campaign: id,
//             amount,
//             transactionId: paymentIntent.id // Use the Stripe payment intent ID
//         });

//         // Save the donation record to the database
//         await donation.save();

//         res.status(200).json({ message: 'Donation successful', campaign, donation });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };




// Donate to a Campaign
exports.donateToCampaign = async (req, res) => {
    const { id } = req.params; // Campaign ID from URL
    const campaignId = id
    let { amount,transactionId } = req.body;


    amount=parseFloat(amount); // or use Number(amount)
    try {

        console.log("at campaig contriller ")
        const campaign = await Campaign.findById(campaignId);
        if (!campaign || campaign.status !== 'active') {
            console.log('Campaign not found or inactive')
            return res.status(404).json({ message: 'Campaign not found or inactive' });
        }
        campaign.raisedAmount += amount;
        await campaign.save();
console.log("campiagn saved")
        // Log the donation
        const donation = await Donation.create({
            donor: req.user.id,
            campaign: campaignId,
            amount,
            transactionId :transactionId, //change this too
            status:'completed'//change this default
        });
        console.log("donated:",donation)
        res.status(201).json(donation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



// Get all donors for a specific campaign
exports.getAllDonors = async (req, res) => {
    const { id } = req.params; // Extract campaign ID from the URL parameter

    try {
        // Find all donations for the specific campaign and populate donor details
        const donations = await Donation.find({ campaign: id })
            .populate('donor', 'name email') // Populate the donor details with selected fields (name, email)
            .exec();

        // Check if there are any donations for the campaign
        if (!donations || donations.length === 0) {
            return res.status(404).json({ message: 'No donors found for this campaign.' });
        }

        // Return a list of donors
        const donors = donations.map(donation => ({
            donorId: donation.donor._id,
            name: donation.donor.name,
            email: donation.donor.email,
            amountDonated: donation.amount,
            donationDate: donation.createdAt
        }));

        res.status(200).json({ donors });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// exports.donateToCampaign = async (req, res) => {
//     const { id } = req.params; // Campaign ID from URL
//     const { amount } = req.body; // Donation amount from request body
// console.log(id)
//     try {
//         const campaign = await Campaign.findById(id);

//         if (!campaign || campaign.status !== 'active') {
//             return res.status(404).json({ message: 'Campaign not found or inactive' });
//         }

//         // Update the campaign's raised amount
//         campaign.raisedAmount += amount;
//         await campaign.save();

//         // Optionally, save this donation record to a separate Donations model
//         res.status(200).json({ message: 'Donation successful', campaign });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

