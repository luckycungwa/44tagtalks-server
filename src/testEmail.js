// testEmail.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'cungwalucky@gmail.com',
    pass: 'your_app_password', // Replace with your app password
  },
});

const mailOptions = {
  from: 'noreply@example.com',
  to: 'recipient@example.com', // Replace with a valid recipient email
  subject: 'Test Email',
  text: 'This is a test email from Nodemailer!',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log('Error occurred: ' + error.message);
  }
  console.log('Email sent: ' + info.response);
});