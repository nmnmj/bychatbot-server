const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

exports.sendVerificationEmail = async (email, code) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification Code',
    html: `<p>Your verification code is: <strong>${code}</strong></p>`
  });
};

exports.sendIntegrationInstructions = async (email, integrationCode) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Chatbot Integration Instructions',
    html: `<h2>Integration Code</h2>
          <pre>${integrationCode}</pre>
          <p>Add this code to your website's &lt;head&gt; section</p>`
  });
};