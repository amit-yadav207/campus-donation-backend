
// const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
// const nodemailer = require('nodemailer');

// // Setup Nodemailer transporter
// const transporter = nodemailer.createTransport({
//     service: 'Gmail', // or use any other email service like SendGrid, etc.
//     auth: {
//         user: process.env.EMAIL_USER, // Your email address
//         pass: process.env.EMAIL_PASS  // Your email password
//     }
// });

// // Send Email Utility
// exports.sendEmail = async (to, subject, text) => {
//     try {
//         const mailOptions = {
//             from: process.env.EMAIL_USER, // sender address
//             to: to,                       // receiver's email
//             subject: subject,             // Subject line
//             text: text                    // Plain text body
//         };

//         await transporter.sendMail(mailOptions);
//     } catch (error) {
//         console.error('Error sending email:', error);
//     }
// };











const nodemailer = require('nodemailer');

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Or use another service like SendGrid, etc.
    auth: {
        user: process.env.EMAIL_USER, // Your email address from environment variables
        pass: process.env.EMAIL_PASS  // Your email password from environment variables
    }
});

// Send Email Utility
const sendEmail = async (to, subject, text) => {
   
console.log("to,subj, text",to,subject,text)
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER, // Sender address
            to: to,                       // Receiver email
            subject: subject,             // Subject line
            html: text                    // Plain text body
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Email could not be sent');
    }
};

module.exports = sendEmail;


















// const nodemailer = require('nodemailer');

// const sendEmail = async (to, subject, text) => {

//     // console.log(process.env)
//     try {
//         const transportOptions = {
//             host: "smtp.gmail.com",
//             port: 465,
//             secure: true,
//             auth: {
//                 user: process.env.EMAIL_USER,
//                 pass: process.env.EMAIL_PASS
//             }
//         }

//         const transporter = nodemailer.createTransport(transportOptions);

//         // send mail with defined transport object
//         transporter.sendMail({
//             from: {
//                 name: "Campus Donation Support Team",
//                 address: process.env.EMAIL_USER
//             }, // sender address
//             to: to,      // user email,
//             subject: subject,        // Subject line
//             html: text,  // html body
//         });
//     } catch (error) {
//         console.error('Error sending email:', error);
//         throw new Error('Email could not be sent');
//     }
// };

// module.exports = sendEmail;
