// // controllers/analyticsController.js
// const Campaign = require('../models/Campaign'); // Assuming you have a Campaign model
// const Donation = require('../models/Donation'); // Assuming you have a Donation model

// // Function to get analytics data
// const getAnalyticsData = async (req, res) => {
//     try {
//         // Fetch total number of campaigns
//         const totalCampaigns = await Campaign.countDocuments();

//         // Fetch total amount of donations across all campaigns
//         const totalDonations = await Donation.aggregate([
//             { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
//         ]);

//         // Get list of campaigns with their respective donation amounts and end dates
//         const campaignData = await Campaign.find().select("title endDate");
        
//         // Fetch list of donors and their donation details
//         const donorData = await Donation.find()
//             .populate("donor", "name email") // assuming Donation schema has a "donor" field
//             .select("amount campaignId");

//         // Send analytics data as response
//         res.status(200).json({
//             totalCampaigns,
//             totalDonations: totalDonations[0]?.totalAmount || 0,
//             campaigns: campaignData,
//             donors: donorData,
//         });
//     } catch (error) {
//         console.error("Error fetching analytics data:", error);
//         res.status(500).json({ message: "Error fetching analytics data" });
//     }
// };

// module.exports = { getAnalyticsData };





// // analyticsController.js
// const Campaign = require('../models/campaignModel');
// const Donation = require('../models/donationModel');
// const User = require('../models/userModel');

// // Get analytics data for campaigns and donations
// const getAnalyticsData = async (req, res) => {
//     try {
//         // Total number of campaigns
//         const totalCampaigns = await Campaign.countDocuments();

//         // Total donations across all campaigns
//         const totalDonations = await Donation.aggregate([
//             { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
//         ]);

//         // Total donations amount
//         const totalDonationAmount = totalDonations[0]?.totalAmount || 0;

//         // List of top campaigns by donations
//         const topCampaigns = await Donation.aggregate([
//             {
//                 $group: {
//                     _id: "$campaign",
//                     totalAmount: { $sum: "$amount" },
//                     count: { $sum: 1 }
//                 }
//             },
//             { $sort: { totalAmount: -1 } },
//             { $limit: 5 },
//             {
//                 $lookup: {
//                     from: "campaigns",
//                     localField: "_id",
//                     foreignField: "_id",
//                     as: "campaign"
//                 }
//             },
//             { $unwind: "$campaign" },
//             {
//                 $project: {
//                     "campaign.title": 1,
//                     "campaign.goalAmount": 1,
//                     "totalAmount": 1,
//                     "count": 1
//                 }
//             }
//         ]);

//         // Top donors based on total donations
//         const topDonors = await Donation.aggregate([
//             {
//                 $group: {
//                     _id: "$donor",
//                     totalDonated: { $sum: "$amount" }
//                 }
//             },
//             { $sort: { totalDonated: -1 } },
//             { $limit: 5 },
//             {
//                 $lookup: {
//                     from: "users",
//                     localField: "_id",
//                     foreignField: "_id",
//                     as: "donor"
//                 }
//             },
//             { $unwind: "$donor" },
//             {
//                 $project: {
//                     "donor.name": 1,
//                     "totalDonated": 1
//                 }
//             }
//         ]);

//         res.json({
//             totalCampaigns,
//             totalDonationAmount,
//             topCampaigns,
//             topDonors
//         });
//     } catch (error) {
//         console.error("Error fetching analytics data:", error);
//         res.status(500).json({ message: "Failed to retrieve analytics data" });
//     }
// };

// module.exports = {
//     getAnalyticsData
// };



// // analyticsController.js
// const Campaign = require('../models/campaignModel');
// const Donation = require('../models/donationModel');
// const User = require('../models/userModel');

// // Get analytics data for campaigns and donations
// const getAnalyticsData = async (req, res) => {
//     try {
//         // Check if MongoDB connection is established
//         if (!Campaign.db) {
//             throw new Error("Database connection error");
//         }

//         const totalCampaigns = await Campaign.countDocuments();

//         const totalDonations = await Donation.aggregate([
//             { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
//         ]);
//         const totalDonationAmount = totalDonations[0]?.totalAmount || 0;

//         const topCampaigns = await Donation.aggregate([
//             { $group: { _id: "$campaign", totalAmount: { $sum: "$amount" }, count: { $sum: 1 } }},
//             { $sort: { totalAmount: -1 } },
//             { $limit: 5 },
//             { $lookup: { from: "campaigns", localField: "_id", foreignField: "_id", as: "campaign" }},
//             { $unwind: "$campaign" },
//             { $project: { "campaign.title": 1, "campaign.goalAmount": 1, "totalAmount": 1, "count": 1 }}
//         ]);

//         const topDonors = await Donation.aggregate([
//             { $group: { _id: "$donor", totalDonated: { $sum: "$amount" }}},
//             { $sort: { totalDonated: -1 }},
//             { $limit: 5 },
//             { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "donor" }},
//             { $unwind: "$donor" },
//             { $project: { "donor.name": 1, "totalDonated": 1 }}
//         ]);

//         res.json({
//             totalCampaigns,
//             totalDonationAmount,
//             topCampaigns,
//             topDonors
//         });
//     } catch (error) {
//         console.error("Error fetching analytics data:", error.message);
//         res.status(500).json({ message: "Failed to retrieve analytics data" });
//     }
// };

// module.exports = {
//     getAnalyticsData
// };




// analyticsController.js
const Campaign = require('../models/campaignModel');
const Donation = require('../models/donationModel');
const User = require('../models/userModel');

// Get analytics data for campaigns and donations
const getAnalyticsData = async (req, res) => {
    try {
        // Check if MongoDB connection is established
        if (!Campaign.db) {
            throw new Error("Database connection error");
        }

        // Total number of campaigns
        const totalCampaigns = await Campaign.countDocuments();

        // Total donations across all campaigns
        const totalDonations = await Donation.aggregate([
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
        ]);
        const totalDonationAmount = totalDonations[0]?.totalAmount || 0;

        // List of top campaigns by donations
        const topCampaigns = await Donation.aggregate([
            { $group: { _id: "$campaign", totalAmount: { $sum: "$amount" }, count: { $sum: 1 } }},
            { $sort: { totalAmount: -1 }},
            { $limit: 5 },
            { $lookup: { from: "campaigns", localField: "_id", foreignField: "_id", as: "campaign" }},
            { $unwind: "$campaign" },
            { $project: { "campaign.title": 1, "campaign.goalAmount": 1, "totalAmount": 1, "count": 1 }}
        ]);

        // Format topCampaigns for frontend
        const formattedTopCampaigns = topCampaigns.map(campaign => ({
            title: campaign.campaign.title,
            goalAmount: campaign.campaign.goalAmount,
            totalAmount: campaign.totalAmount,
            donationCount: campaign.count
        }));

        // Top donors based on total donations
        const topDonors = await Donation.aggregate([
            { $group: { _id: "$donor", totalDonated: { $sum: "$amount" }}},
            { $sort: { totalDonated: -1 }},
            { $limit: 5 },
            { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "donor" }},
            { $unwind: "$donor" },
            { $project: { "donor.name": 1, "totalDonated": 1 }}
        ]);

        // Format topDonors for frontend
        const formattedTopDonors = topDonors.map(donor => ({
            name: donor.donor.name,
            totalDonated: donor.totalDonated
        }));

        // Send the response with formatted data
        res.json({
            totalCampaigns,
            totalDonationAmount,
            topCampaigns: formattedTopCampaigns,
            topDonors: formattedTopDonors
        });

    } catch (error) {
        console.error("Error fetching analytics data:", error.message);
        res.status(500).json({ message: "Failed to retrieve analytics data" });
    }
};

module.exports = {
    getAnalyticsData
};
