const sendEmail = require("../utils/sendEmail");

class EmailService {
    static async sendForgotPasswordEmail(user, resetPasswordURL) {
        return sendEmail({
            email: user.email,
            subject: "Reset your password",
            template: "forgot-password.ejs",
            data: {
                user: {
                    name: user.name,
                    email: user.email,
                },
                app: {
                    name: "Order Planning",
                    supportEmail: process.env.SMTP_MAIL,
                    year: new Date().getFullYear(),
                },
                resetPasswordURL,
            },
        });
    }
}

module.exports = EmailService;