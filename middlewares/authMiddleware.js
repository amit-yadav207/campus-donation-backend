const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log(`got token ${token}`)
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
        console.log("\ninside try")
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(`verified ,${decoded}`)
        req.user = await User.findById(decoded.id).select('-password');
        console.log(`user found ,${req.user}`)
        next();
    } catch (error) {
        console.log("not valid token")
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
