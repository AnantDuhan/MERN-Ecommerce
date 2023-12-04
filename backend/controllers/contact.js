const Contact = require('../models/contact');
const sendEmail = require('../utils/sendEmail');
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const twilio = require('twilio');
const Snowflake = require('@theinternetfolks/snowflake');

const client = new twilio(accountSid, authToken, { username: 'AnantDuhan' });

const timestamp = Date.now();
const timestampInSeconds = Math.floor(timestamp / 1000);

exports.contactUs = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const contact = await Contact.create({
            _id: Snowflake.Snowflake.generate({
                timestamp: timestampInSeconds
            }),
            name,
            email,
            subject,
            message
        });

        await contact.save();

        const whatsappMessage = `New contact form submission\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`;

        await client.messages.create({
            body: whatsappMessage,
            from: 'whatsapp:+14155238886',
            to: `whatsapp:+918954838610`,
        });

        await sendEmail({
            email: 'duhananant@gmail.com',
            subject: `New Contact Form Submission`,
            html: `
      <p>You have received a new contact form submission:</p>
      <ul>
        <li>Name: ${name}</li>
        <li>Email: ${email}</li>
        <li>Subject: ${subject}</li>
      </ul>
      <p>Message:</p>
      <p>${message}</p>
    `
        });

        res.status(200).json({
            success: true,
            message: 'Message sent and saved successfully',
            contact
        })
    } catch (error) {
        console.log("ERROR", error);
        res.status(500).json({
            success: false,
            message: 'Error Sending Message'
        })
    }
};
