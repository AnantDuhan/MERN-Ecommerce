require("dotenv").config();

const nodemailer = require("nodemailer");

(async () => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    try {
        await transporter.sendMail({
            from: process.env.SMTP_MAIL,
            to: process.env.SMTP_MAIL,
            subject: "Test",
            text: "Hello",
        });

        console.log("SUCCESS");
    } catch (e) {
        console.error(e);
    }
})();