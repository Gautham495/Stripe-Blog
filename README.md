
Ultimate resource --> https://github.com/stripe-samples



1. One time payment
2. Subscription
3. Payment Link
4. Stripe Connect

Only 4 methods are there which we can use in our website/app that is our SAAS product.

Create a customer -> customerId
Create a plan -> planId
Create a price -> priceId

In stripe for one time payment

1. Use Sessions - > Stripe given flow
2. Use Payment Intents - > custom flow

https://stripe.com/docs/payments/quickstart

 Session -> stripe made flow where we have to create a session url link and send to frontend and user navigates there to pay.
 Payment Intent -> Custom flow where user pays within the app. We get the payment intent from the backend and attach to our frontend. Then the users pays within our app/website itself.


In stripe for subscription

1. Use Sessions - > Stripe given flow
2. Use Payment Intents - > custom flow

https://stripe.com/docs/billing/quickstart

Same exact logic as one time payment in development flow.

But in product flow.

After 30 days stripe sends the payment link to the user. if they pay we update the database.
If they dont pay we should remove the premium:true to premium:false and remove all the pro features of the app.

We can also show that 1-2 days remaining feature in our app to notify the user to pay.

Only 3 types of flows in Stripe.

1. Payment link
2. Create a stripe url link to pay
3. Custom flow.

Product concepts which can be included in our apps/websites.

1. Add proration concept -> Upgrading/Downgrading our existing plans we use in our app.
2. Add Discounts/Coupons
3. Customer portal to manage subscriptions.

