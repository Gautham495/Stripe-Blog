import { db } from "../../public/firebaseconfig";

import { updateDoc, doc } from "@firebase/firestore";

const stripe = require("stripe")(
  "sk_test_51your_key"
);

const handler = async (req, res) => {
  const response = await stripe.customers.create({
    email: req.body.email,
  });

  const userRef = doc(db, "users", req.body.uid);
  await updateDoc(userRef, {
    stripeCustomerId: response.id,
  });

  res.send({ message: response.id });
};
export default handler;
