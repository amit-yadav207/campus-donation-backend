// const express = require('express');
// const { registerUser, loginUser } = require('../controllers/authController');
// const router = express.Router();

// router.post('/register', registerUser);
// router.post('/login', loginUser);

// module.exports = router;



// const express = require('express');
// const { registerUser, loginUser } = require('../controllers/authController');
// const router = express.Router();

// // User registration and login
// router.post('/register', registerUser);
// router.post('/login', loginUser);



// module.exports = router;





const express = require('express');
const { 
    registerUser, 
    loginUser, 
    verifyAccount, 
    forgotPassword, 
    resetPassword 
} = require('../controllers/authController');
const router = express.Router();

// User registration and login
router.post('/register', registerUser);
router.post('/login', loginUser);

// Verify account
router.get('/verify/:token', verifyAccount);

// Forgot password
router.post('/forgot-password', forgotPassword);

// Reset password
router.put('/reset-password/:token', resetPassword);////put is used here

module.exports = router;
