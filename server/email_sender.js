// const nodemailer = require("nodemailer");

// const sendEmail = async () => {
//   try {
//     // Step 1: Create a transporter object using SMTP settings
//     let transporter = nodemailer.createTransport({
//       service: "gmail", // or use another email provider like 'hotmail', 'yahoo', etc.
//       auth: {
//         user: "sujalbista7777@gmail.com", // replace with your email address
//         pass: "einekleine44321", // replace with your email password or app-specific password
//       },
//     });

//     // Step 2: Set email data
//     let mailOptions = {
//       from: '"Sujal Bista" <sujalbista7777@gmail.com>', // sender address
//       to: "phuldelsubash33@gmail.com", // list of recipients
//       subject: "Hello from Nodemailer", // Subject line
//       text: "This is a test email sent using Nodemailer.", // plain text body
//       html: "<b>This is a test email sent using Nodemailer.</b>", // HTML body
//     };

//     // Step 3: Send email
//     let info = await transporter.sendMail(mailOptions);
//     console.log("Email sent: " + info.response);
//   } catch (err) {
//     console.error("Error sending email:", err);
//   }
// };

// sendEmail();
