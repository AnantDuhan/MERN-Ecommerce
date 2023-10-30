const stripe = require('stripe')(
    'sk_test_51K9RkSSDvITsgzEymgWGmrPCCP0Iu8b8j2AtRaZbnuXqwSLkQMSnTc6a6gQmRRzT60nP0KMhApPEpASMOPP3GgGh00rlK3KQm2'
);
const Order = require('../models/order');
exports.processPayment = async (req, res, next) => {
    let paymentMethodTypes = ['card'];

    // Check if UPI is selected
    if (req.body.upi) {
        paymentMethodTypes.push('upi');
    }

    // Check if GPay is selected
    if (req.body.gpay) {
        paymentMethodTypes.push('gpay');
    }

    // Check if Paytm is selected
    if (req.body.paytm) {
        paymentMethodTypes.push('paytm');
    }

    // Check if PhonePe is selected
    if (req.body.phonepe) {
        paymentMethodTypes.push('phonepe');
    }

    try {
        const myPayment = await stripe.paymentIntents.create({
            payment_method_types: paymentMethodTypes,
            amount: req.body.amount,
            currency: 'inr',
            metadata: {
                company: 'Order Planning'
            }
        });

        res.status(200).json({
            success: true,
            clientSecret: myPayment.client_secret,
            message: 'Payment Successfully done'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Payment failed'
        });
    }
};

exports.sendStripeApiKey = async (req, res, next) => {
    res.status(200).json({
        stripeApiKey:
            'pk_test_51K9RkSSDvITsgzEyN1XtfELWFWiUetYQEU3NWsuHgEmnn07jtXs0HJKJ1x2cXldIX2hOc9qrm81fS6Fi1Z0pHsvu000MvtXP6h'
    });
};
