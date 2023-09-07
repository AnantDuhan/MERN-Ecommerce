const nodemailer = require('nodemailer');

const sendEmail = async options => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_GMAIL,
            pass: process.env.SMTP_GMAIL_PASSWORD
        },
    });

    const mailOptions = {
        from: 'admin@orderplanning.com',
        to: options.email,
        subject: options.subject,
        html: options.message,
        headers: {
            'Content-Type': 'text/html',
            charset: 'UTF-8'
        }
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
