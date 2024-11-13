const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Import Routes
const authRoutes = require('../routes/authRoutes');
const campaignRoutes = require('../routes/campaignRoutes');
const userRoutes = require('../routes/userRoutes');
const analyticsRoutes = require('../routes/analyticsRoutes');
const donationRoutes = require('../routes/donationRoutes');

// Use Routes
app.get('/',(req,res)=>{
    res.send("API for backend is running!")
})
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/donations', donationRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
