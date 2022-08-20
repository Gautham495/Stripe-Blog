/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-sync-scripts */
import React, { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../public/firebaseconfig";
import { setDoc, doc, getDoc } from "@firebase/firestore";
import axios from "axios";
import Head from "next/head";
// import Link from "next/link";
import dayjs from "dayjs";
var localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);

const products = [
  {
    productName: "Gautham's Stripe Ebook",
    priceId: "price_1LYjQuSF8V7LAoGcCj5E7xYb",
    productId: "prod_MHI06BEQCFX0pm",
  },
  {
    productName: "Gautham's Stripe Course",
    priceId: "price_1LMBYSSF8V7LAoGct1ch6HkG",
    productId: "prod_M4KC3mbysJr3VP",
  },
  {
    productName: "Gautham's Razorpay Course",
    priceId: "price_1LMBZLSF8V7LAoGcjXuAOY14",
    productId: "prod_M4KDYcn9ixod2C",
  },
];

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [userData, setUserData] = useState({});

  const [selectedProduct, setSelectedProduct] = useState({});

  const [user] = useAuthState(auth);

  useEffect(() => {
    getUserData();
  }, [user]);

  const getUserData = async () => {
    if (user) {
      const docRef = doc(db, "users", user?.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert(error.code, { type: "error" });
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", res.user.uid), {
        email: email,
        uid: res.user.uid,
        stripeCustomerId: "",
      });

      const response = await axios.post("/api/create-customer", {
        uid: res.user.uid,
        email: email,
      });

      setUserData({ email: email, stripeCustomerId: response.data.message });

      alert("Successfully Created");
    } catch (err) {
      alert(err.message);
    }
  };

  const logOut = () => {
    signOut(auth);
  };

  const createCheckoutSession = async () => {
    const res = await axios.post("/api/create-checkout-session", {
      email: userData?.email,
      productName: selectedProduct?.productName,
      priceId: selectedProduct?.priceId,
      productId: selectedProduct?.productId,
      stripeCustomerId: userData?.stripeCustomerId,
      uid: user?.uid,
    });

    window.location.replace(res.data.session.url);
  };

  return (
    <div>
      <Head>
        <title>
          Gautham Vijayan | Frontend React JS and React Native Mobile App
          Developer
        </title>
        <meta
          name="description"
          content="Gautham Vijayan's Stripe Blog Example Registration Page"
        />
        <meta name="keywords" content="Gautham Vijayan Stripe Blog" />

        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:title"
          content={"Gautham Vijayan's Stripe Blog Example Registration Page."}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content={
            "https://pbs.twimg.com/profile_images/1435255967743049730/D1812u9x_400x400.jpg"
          }
        />
        <meta
          property="og:url"
          content={`https://gauthamvijay.com/stripe/registration`}
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:image"
          content="https://pbs.twimg.com/profile_images/1435255967743049730/D1812u9x_400x400.jpg"
        />
        <meta property="twitter:site" content="@gauthamvijay495" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
          crossOrigin="anonymous"
        ></link>
        <script
          src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js"
          integrity="sha384-7+zCNj/IqJ95wo16oMtfsKbZ9ccEh31eOz1HGyDuCQ6wgnyJNSYdrPa03rtR1zdB"
          crossOrigin="anonymous"
        ></script>
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js"
          integrity="sha384-QJHtvGhmr9XOIpI6YVutG+2QOK9T+ZnN4kzFN1RtK3zEFEIsxhlmWl5/YESvpZ13"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <div
        className=" d-flex align-items-center justify-content-center"
        style={{ height: "100vh", fontFamily: "Poppins,sans-serif" }}
      >
        {/* <iframe width="560" height="315"
          src="https://www.youtube.com/embed/dwmQnudxW7Y"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen></iframe> */}
        {!user ? (
          <div>
            <h2 className="m-2">Stripe Registration Example</h2>
            <div className="m-2">
              <div className="my-3">
                <label>Email</label>
              </div>

              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ borderRadius: 10, padding: 10 }}
              />
            </div>
            <div className="m-2">
              <div className="my-3">
                <label>Password</label>
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ borderRadius: 10, padding: 10 }}
              />
            </div>
            <div className="m-2 ">
              <button
                onClick={() => handleSubmit()}
                className="btn btn-primary"
              >
                Sign Up
              </button>
            </div>
            <div className="m-2 ">
              <button onClick={() => handleLogin()} className="btn btn-success">
                Login
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="m-2">Email : {userData?.email}</h2>
            <h2 className="m-2">
              Stripe customerId : {userData?.stripeCustomerId}
            </h2>
            <div>
              {products.filter(
                (item) =>
                  !userData?.itemsBought
                    ?.map((product) => product.productName)
                    ?.includes(item?.productName)
              ).length !== 0 ? (
                products
                  .filter(
                    (item) =>
                      !userData?.itemsBought
                        ?.map((product) => product.productName)
                        ?.includes(item?.productName)
                  )
                  .map((item) => {
                    return (
                      <div key={item.productName} className="m-2">
                        <input
                          className="m-2"
                          type="radio"
                          value={item.priceId}
                          checked={selectedProduct.priceId === item.priceId}
                          onChange={() => {
                            setSelectedProduct(item);
                          }}
                        />
                        {item.productName}
                      </div>
                    );
                  })
              ) : (
                <h3 className="m-4">You have purchased all the products!!</h3>
              )}
            </div>
            <div className="d-flex">
              <div className="m-2 ">
                <button
                  onClick={() => {
                    if (selectedProduct?.productName) {
                      createCheckoutSession();
                    } else {
                      alert("Select a product");
                    }
                  }}
                  className="btn btn-primary"
                >
                  Checkout
                </button>
              </div>
              <div className="m-2 ">
                <button onClick={() => logOut()} className="btn btn-danger">
                  Sign Out
                </button>
              </div>
              {/* 
              <div className="m-2 ">
                <Link href="/stripe/checkout-payment" passHref>
                  <button className="btn btn-info">
                    <a className="linkreturn">Checkout Form</a>
                  </button>
                </Link>
              </div> */}
            </div>
            {/* <div>
              <Link href="/stripe/subscription" passHref>
                <button className="btn btn-warning">
                  <a className="linkreturn">Get Subscription</a>
                </button>
              </Link>
            </div> */}
            {selectedProduct?.productName && (
              <div>Selected Product : {selectedProduct?.productName} </div>
            )}
            <div>
              {userData?.itemsBought ? (
                <div>
                  <h3 className="m-3">Items bought by you</h3>

                  {userData?.itemsBought?.map((item, index) => {
                    return (
                      <div className="m-2" key={item?.productName}>
                        <div className="m-2">
                          {index + 1}. Product name : {item?.productName}
                        </div>
                        <div className="m-2">Price : {item?.amount}</div>
                        <div>
                          Purchased on{" "}
                          {dayjs(item?.paidAt?.seconds).format("MMMM")}{" "}
                          {dayjs(item?.paidAt?.seconds).format("DD")},{" "}
                          {dayjs(item?.paidAt?.seconds).format("YYYY")} . at{" "}
                          {dayjs(item?.paidAt?.seconds).format("LT")} .{" "}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div>
                  <h3 className="m-3">You have not done any purchases</h3>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
