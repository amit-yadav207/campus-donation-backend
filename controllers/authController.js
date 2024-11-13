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

        // // Send verification email
        // const emailContent = `
        //     <p>Hi ${name},</p>
        //     <p>Thank you for registering. Please verify your account by clicking the link below:</p>
        //     <a href="${verificationUrl}" target="_blank">Verify Your Account</a>
        //     <p>Thank you!</p>
        // `;

        // await sendEmail(email, 'Verify Your Account', emailContent);


        const emailContent = `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
      <!-- Header Section -->
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #4CAF50; font-size: 32px; font-weight: bold; margin-bottom: 10px;">Campus Donation</h1>
        <h2 style="color: #333; font-size: 24px;">Account Verification</h2>
      </div>

      <!-- Body Content -->
      <div style="font-size: 16px; line-height: 1.5; color: #555;">
        <p>Hi ${name},</p>
        <p>Thank you for registering on the Campus Donation platform! To complete your registration, please verify your account by clicking the link below:</p>
        
        <p style="text-align: center;">
          <a href="${verificationUrl}" target="_blank" style="background-color: #4CAF50; color: white; padding: 12px 30px; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Your Account
          </a>
        </p>

        <p>If you didn't register for an account, please ignore this email.</p>

        <p style="margin-top: 30px;">Thank you,<br/>The Campus Donation Team</p>
      </div>

      <!-- Footer Section -->
      <div style="border-top: 1px solid #ddd; padding-top: 20px; text-align: center; font-size: 14px; color: #777;">
        <p>&copy; ${new Date().getFullYear()} Campus Donation Platform. All Rights Reserved.</p>
      </div>
    </div>
  </div>
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
        if (!user ) {
            console.log("user not found!")
            return res.status(400).json({ message: 'User Not Found!' });
        }

        if(!(await user.matchPassword(password))){
            console.log("password not matched!")
            return res.status(401).json({ message: 'Invalid Password' });
        }
        if (!user.isVerified) {
            console.log("not varified!")
            return res.status(401).json({ message: 'Please verify your account first.' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user });
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

        const resetToken = crypto.randomBytes(6).toString('hex');
        // const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;




        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        const emailContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
            <!-- Header Section -->
            <div style="text-align: center; margin-bottom: 20px;">
              <h1 style="color: #4CAF50; font-size: 32px; font-weight: bold; margin-bottom: 10px;">Campus Donation</h1>
              <h2 style="color: #333; font-size: 24px;">Password Reset Request</h2>
            </div>
      
            <!-- Body Content -->
            <div style="font-size: 16px; line-height: 1.5; color: #555;">
              <p>Hi ${user.name},</p>
              <p>We received a request to reset your password for your Campus Donation account. To reset your password, please click the link below:</p>
              
              <p style="text-align: center;">
                <a href="${resetUrl}" target="_blank" style="background-color: #4CAF50; color: white; padding: 12px 30px; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Reset Your Password
                </a>
              </p>
      
              <p>If you did not request a password reset, please ignore this email. Your account will remain secure.</p>
      
              <p style="margin-top: 30px;">Thank you,<br/>The Campus Donation Team</p>
            </div>
      
            <!-- Footer Section -->
            <div style="border-top: 1px solid #ddd; padding-top: 20px; text-align: center; font-size: 14px; color: #777;">
              <p>&copy; ${new Date().getFullYear()} Campus Donation Platform. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      `;

        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        await sendEmail(user.email, 'Password Reset', emailContent);

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
