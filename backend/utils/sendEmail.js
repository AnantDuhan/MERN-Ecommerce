const path = require("path");
const transporter = require("./transporter");
const { getCompiledTemplate } = require("./templateCache");

const sendEmail = async ({
    email,
    subject,
    template,
    data,
}) => {
    try {
        const templatePath = path.join(__dirname, "../mails", template);

        console.log({
            user: process.env.SMTP_MAIL,
            passwordLength: process.env.SMTP_PASSWORD?.length,
            passwordStart: process.env.SMTP_PASSWORD?.substring(0, 4),
        });

        const compiledTemplate = getCompiledTemplate(templatePath);
        const html = compiledTemplate(data);

        await transporter.sendMail({
            from: `"Order Planning" <${process.env.SMTP_MAIL}>`,
            to: email,
            subject,
            html,
        });
    } catch (error) {
        console.error("Email Error:", error);
        throw error;
    }
};

module.exports = sendEmail;