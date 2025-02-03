// const nodemailer = require("nodemailer");
// const dotenv = require("dotenv")
// dotenv.config({path:`${__dirname}/config.env`});

// const app = require("./server")

// const verifyGmailAddress = async (email) => {
//   console.log(process.env)
//   console.log("GMAIL_USER:", process.env.GMAIL_USER);
//   console.log("GMAIL_PASS:", process.env.GMAIL_PASS);

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.GMAIL_USER, // Gmail address from .env
//       pass: process.env.GMAIL_PASS, // Gmail app password from .env
//     },
//     tls: {
//       rejectUnauthorized: false, // Avoid errors related to TLS
//     },
//   });

//   try {
//     const info = await transporter.sendMail({
//       from: process.env.GMAIL_USER, // Sender address
//       to: email, // Recipient address
//       subject: "Verification Test",
//       text: "This is a test email for verification purposes.",
//     });

//     console.log("Verification email sent:", info.response);
//     return true;
//   } catch (err) {
//     console.error("Error verifying Gmail address:", err);
//     return false;
//   }
// };

// module.exports = { verifyGmailAddress };
