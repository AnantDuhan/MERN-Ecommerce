const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
   const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      service: process.env.SMTP_SERVICE,
      secure: true,
      auth: {
         user: process.env.SMTP_MAIL,
         pass: process.env.SMTP_PASSWORD,
      },
      tls: {
         rejectUnauthorized: false,
      },
   });

   const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: options.email,
      subject: options.subject,
      test: options.message,
   };

   await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
