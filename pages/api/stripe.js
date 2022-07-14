const express = require("express");
const cors = require("cors");
const shortid = require("shortid");
const { secretKey } = require("../utils/utils");

const app = express();
app.use(cors());

const functions = require("firebase-functions");
const stripe = require("stripe")(secretKey);

const endpointSecret = "whsec_DlMhRKMyhbcxYoBrhk4AJPblmNmlRlfA";

const admin = require("firebase-admin");

const serviceAccount = require("./Private-Key.json");

const db = admin.firestore();

app.post("/create_customer/:uid", (req, res) => {
  const userRef = db.doc(`users/${req.params.uid}`);

  userRef.get().then((querySnapshot) => {
    if (querySnapshot.data().stripeId === "") {
      stripe.customers
        .create({
          email: req.body.email,
          name: req.body.displayName,
          metadata: { userId: req.params.uid },
        })
        .then((customer) => {
          userRef.update({
            stripeId: customer.id,
          });
          res.json({ data: customer.id });
        });
    } else {
      res.json({ data: "Stripe customer already exists" });
    }
  });
});

app.post("/create_product", (req, res) => {
    const product = await stripe.products.create({
        name:req.body.name,
      });
      res.json({product})
  });


  app.post("/create_price", (req, res) => {

    // Create a price for a particular product for one time payment

const price = await stripe.prices.create({
  unit_amount: req.body.amount,
  currency: req.body.currency,
  product: req.body.product,
});
      res.json({price})
  });


  app.post("/create_price_subscription", (req, res) => {

    // Create a price for a particular product for one time payment

const price = await stripe.prices.create({
  unit_amount: req.body.amount,
  currency: req.body.currency,
  product: req.body.product,
  recurring: {interval: 'month'},
//   recurring: {interval: req.body.interval},
});
      res.json({price})
  });

  app.post('/create-checkout-session', async (req, res) => {

    // Mode

// payment
// Accept one-time payments for cards, iDEAL, and more.

// setup
// Save payment details to charge your customers later.

// subscription
// Use Stripe Billing to set up fixed-price subscriptions.


    const session = await stripe.checkout.sessions.create({
 
    line_items:[
        {price: req.body.priceId, quantity: 1}
    ],
      mode: 'payment',
      customer:req.body.customerId, // optional
      customer_email:req.body.email,
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });
  
    res.redirect(303, session.url);
  });


  app.post("/create-payment-intent", async (req, res) => {
    const { items } = req.body;
  
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
    });
  
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  });