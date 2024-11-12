// // donations.js (Controller)
// const Donation = require('../models/donationModel'); // Assuming you have a Donation model
// const User = require('../models/userModel');

// const getDonationHistory = async (req, res) => {
//   const { userId } = req.params; // userId will be passed in the URL params

//   try {
//     // Fetch donation history for the user, along with campaign details
//     const donations = await Donation.find({ donor: userId }).populate('campaign');
//     const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0);

//     res.json({
//       donations,
//       totalAmount,
//     });
//   } catch (error) {
//     console.error('Error fetching donation history:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// module.exports = { getDonationHistory };



const mongoose = require('mongoose');
const Donation = require('../models/donationModel'); // Assuming you have a Donation model
const User = require('../models/userModel');
const Campaign = require('../models/campaignModel');
const getDonationHistory = async (req, res) => {
  const { userId } = req.params; // userId will be passed in the URL params

  try {
    
    // Fetch donation history for the user, along with campaign details
    const donations = await Donation.find({ donor: userId}).populate('campaign');
    
    // Calculate the total donation amount
    const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0);

    // Send the donation history and total amount back in the response
    res.json({
      donations,
      totalAmount,
    });
  } catch (error) {
    console.error('Error fetching donation history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




const confirmDonation = async (req, res) => {
  const { paymentMethodId, campaignId, amount, userId } = req.body;

  try {
    // Store donation in the database
    const donation = new Donation({
      donor: userId,
      campaign: campaignId,
      amount,
      transactionId: paymentMethodId, // Use paymentMethodId for simplicity
      status: 'completed',
    });

    await donation.save();

    res.json({ success: true, message: 'Donation recorded successfully' });
  } catch (error) {
    console.error('Error recording donation:', error);
    res.status(500).json({ error: 'Failed to record donation' });
  }
};






const recordDonation = async (req, res) => {
  const { campaignId, amount, transactionId } = req.body;
  const userId = req.user.id;

  try {
    const donation = await Donation.create({
      donor: userId,
      campaign: campaignId,
      amount,
      transactionId,
      status: 'completed',
    });

    // Update campaign raised amount
    const campaign = await Campaign.findById(campaignId);
    campaign.raisedAmount += amount;
    campaign.totalDonors += 1;
    await campaign.save();

    res.status(200).json({ message: 'Donation recorded successfully.' });
  } catch (error) {
    console.error("Error recording donation:", error);
    res.status(500).json({ message: 'Failed to record donation' });
  }
};









module.exports = { confirmDonation ,getDonationHistory,recordDonation};


