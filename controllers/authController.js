// const User = require('../models/userModel');
// const jwt = require('jsonwebtoken');

// // Register User
// exports.registerUser = async (req, res) => {
//     const { name, email, password, role } = req.body;
//     try {
//         const user = await User.create({ name, email, password, role });
//         const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.status(201).json({ token, user });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// // Login User
// exports.loginUser = async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const user = await User.findOne({ email });
//         if (!user || !(await user.matchPassword(password))) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }
//         const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.status(200).json({ token, user });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };



// const User = require('../models/userModel');
// const jwt = require('jsonwebtoken');

// // Register User
// exports.registerUser = async (req, res) => {
//     const { name, email, password, role } = req.body;
//     try {
//         const user = await User.create({ name, email, password, role });
//         const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.status(201).json({ token, user });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// // Login User
// exports.loginUser = async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const user = await User.findOne({ email });
//         if (!user || !(await user.matchPassword(password))) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }
//         const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.status(200).json({ token, user });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };












const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail'); // Assume you have a utility to send emails

// // Register User
// exports.registerUser = async (req, res) => {
//     const { name, email, password ,role} = req.body;
//     try {
//         const user = await User.create({ name, email, password,role });
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//         // Send verification email
//         const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
//         const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify/${verificationToken}`;
       
//         await sendEmail(email, 'Verify your account', `Please verify your account by clicking this link: ${verificationUrl}`);

//         res.status(201).json({ message: 'User registered. Please verify your account.', token });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };






// Register User
exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const user = await User.create({ name, email, password, role });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Generate verification token and URL
        const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        const verificationUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

        // Send verification email
        const emailContent = `
            <p>Hi ${name},</p>
            <p>Thank you for registering. Please verify your account by clicking the link below:</p>
            <a href="${verificationUrl}" target="_blank">Verify Your Account</a>
            <p>Thank you!</p>
        `;

        await sendEmail(email, 'Verify Your Account', emailContent);

        res.status(201).json({ message: 'User registered. Please verify your account.', token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};




















// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(401).json({ message: 'Please verify your account first.' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Verify Account
exports.verifyAccount = async (req, res) => {
    try {
        const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(400).json({ message: 'Invalid verification token' });
        }

        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: 'Account verified successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        // const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        await sendEmail(user.email, 'Password Reset', `Reset your password using this link: ${resetUrl}`);

        res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reset Password
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
