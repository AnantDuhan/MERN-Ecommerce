const nodemailer = require("nodemailer");

require("dotenv").config({
    path: require("path").resolve(__dirname, "../config/config.env"),
});

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,

    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000,
});

module.exports = transporter;