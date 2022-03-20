const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
   const transporter = nodemailer.createTransport({
      host: process.env.SMPT_HOST,
      port: process.env.SMPT_PORT,
      service: process.env.SMPT_SERVICE,
      secure: true,
      auth: {
         user: process.env.SMPT_MAIL,
         pass: process.env.SMPT_PASSWORD,
      },
      tls: {
         rejectUnauthorized: false,
      },
   });

   const mailOptions = {
      from: process.env.SMPT_MAIL,
      to: options.email,
      subject: options.subject,
      test: options.message,
   };

   await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
