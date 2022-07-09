const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
   const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
         user: process.env.SMTP_MAIL,
         pass: process.env.SMTP_PASSWORD,
      },
   });

   const mailOptions = {
      from: 'admin@ecommerce.com',
      to: options.email,
      subject: options.subject,
      test: options.message,
   };

   await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
