const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.processPayments = async (req,res,next) => {
    const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'usd',
        metadata: {
            company : "Ecommerce"
        }
    })
    res.status(200).json({success: true, client_secret : myPayment.client_secret})
}

exports.sendSecretApiKey = async (req,res) => {
    res.status(200).json({success: true, stripeApiKey : process.env.STRIPE_API_KEY});
}
