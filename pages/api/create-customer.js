import { db } from "../../public/firebaseconfig";
import { updateDoc, doc } from "@firebase/firestore";

const stripe = require("stripe")(
    "sk_test_51JdHnKSF8V7LAoGcYfA5yx6ANM4alapMUgi"
);

const handler = async (req, res) => {
    const response = await stripe.customers.create({
        email: req.body.email,
        metadata: { uid: req.body.uid },
        address: {
            line1: "510 Townsend St",
            postal_code: "98140",
            city: "San Francisco",
            state: "CA",
            country: "US",
        },
        shipping: {
            name: "Gautham",
            address: {
                line1: "510 Townsend St",
                postal_code: "98140",
                city: "San Francisco",
                state: "CA",
                country: "US",
            },
        },
    });

    const userRef = doc(db, "users", req.body.uid);
    await updateDoc(userRef, {
        stripeCustomerId: response.id,
    });

    res.send({ message: response.id });
};
export default handler;
