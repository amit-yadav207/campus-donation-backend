// routes
const express = require('express');
const router = express.Router();
const Donation = require('../models/donationModel');
const authMiddleware = require('../middlewares/authMiddleware');
const { getDonationHistory, confirmDonation } = require('../controllers/donationController');
const sendEmail = require('../utils/sendEmail');
require('dotenv').config(); // Load environment variables from .env file


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);




router.get('/donation-history/:userId', getDonationHistory);
router.post('/confirm-donation', confirmDonation);

router.post('/email', authMiddleware, async (req, res) => {


    console.log("body:" ,req.body)
    const to = req.body.to;
    const subject = req.body.subject;
    const body = req.body.body;
    try{
    await sendEmail( to, subject, body )
    res.send("send")
    }catch(err){
        console.log(err)
        res.send(err)
    }

});

router.post('/:campaignId/donate', authMiddleware, async (req, res) => {
    console.log("****insided donation roites\n")
    const { amount } = req.body;
    console.log("***prara", req.params)
    const { id: campaignId } = req.params;
    //   const userId = req.user._id; // Assume middleware verifies and attaches `req.user`
    const userId = req.user._id.toString(); // Ensure userId is a string
    try {
        // Create a PaymentIntent with the specified amount
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe uses cents
            currency: 'usd',
            metadata: { campaignId, userId },
        });


        console.log("paymnet intent: ", paymentIntent.client_secret); // Add this line for debugging

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});




module.exports = router;




// const express = require('express');
// const { getDonationHistory, confirmDonation } = require('../controllers/donationController');

// router.post('/confirm-donation', confirmDonation);
// router.get('/donation-history/:userId', getDonationHistory);
