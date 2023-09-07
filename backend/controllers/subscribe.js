const Subscribe = require('../models/subscribe');

exports.subscriber = async (req, res, next) => {
    try {
            const { email } = req.body;

            const existingSubscriber = await Subscribe.findOne({ email });

            if (existingSubscriber) {
                return res
                    .status(400)
                    .json({ error: 'Email address is already subscribed.' });
            }

            const newSubscriber = await Subscribe.create({ email });
            await newSubscriber.save();

            res.status(200).json({
                success: true,
                message: "You've successfully subscribed to our newsletter",
                newSubscriber
            });
        } catch (error) {
        res.status(500).json({
            success: false,
            message : error.message
        })
    }
}
