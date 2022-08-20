const stripe = require("stripe")(
  "sk_test_51JdHnKSF8V7LAoGcYfA5yx6"
);

const handler = async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [{ price: req.body.priceId, quantity: 1 }],
    mode: "payment",
    customer: req.body.stripeCustomerId,
    success_url: "https://gauthamvijay.com/stripe/success",
    cancel_url: "https://gauthamvijay.com/stripe/cancel",
    metadata: {
      productName: req.body.productName,
      productId: req.body.productId,
      priceId: req.body.priceId,
      uid: req.body.uid
    },
  });

  res.send({ session });
};
export default handler;
