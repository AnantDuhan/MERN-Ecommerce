const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`);

exports.processPayment = async (req, res, next) => {
    const myPayment = await stripe.paymentIntents.create({
        payment_method_types: ["card"],
        amount: req.body.amount,
        currency: "inr",
        metadata: {
           company: "Ecommerce",
        }
    });

    res.status(200).json({
        success: true,
        clientSecret: myPayment.client_secret
    });
};

exports.sendStripeApiKey = async (req, res, next) => {
    res.status(200).json({ stripeApiKey: `${process.env.STRIPE_API_KEY}` });
};
