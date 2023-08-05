const stripe = require('stripe')(
    'sk_test_51K9RkSSDvITsgzEymgWGmrPCCP0Iu8b8j2AtRaZbnuXqwSLkQMSnTc6a6gQmRRzT60nP0KMhApPEpASMOPP3GgGh00rlK3KQm2'
);

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
        clientSecret: myPayment.client_secret,
        message: 'Payment Successfully done'
    });
};

exports.sendStripeApiKey = async (req, res, next) => {
    res.status(200).json({
        stripeApiKey:
            'pk_test_51K9RkSSDvITsgzEyN1XtfELWFWiUetYQEU3NWsuHgEmnn07jtXs0HJKJ1x2cXldIX2hOc9qrm81fS6Fi1Z0pHsvu000MvtXP6h'
    });
};
