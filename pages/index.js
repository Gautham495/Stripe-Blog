/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-sync-scripts */
import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseconfig";
import { setDoc, doc, getDoc } from "@firebase/firestore";
import axios from "axios";


const Registration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [userData, setUserData] = useState({});

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
      } else {
        console.log("No such document!");
      }
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

      const response = await axios.post("/api/stripe", {
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

  return (
    <div>
      <Head>
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
        style={{ height: "100vh" }}
      >
        {!user ? (
          <div>
            <h2 className="m-2">Stripe Registration Example</h2>
            <div className="m-2">
              <div className="my-3">
                <label>Email</label>
              </div>

              <input
                type="text"
                placeholder="Email or Phone"
                id="username"
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
                id="password"
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
          </div>
        ) : (
          <div>
            <h2 className="m-2">Email : {userData?.email}</h2>
            <h2 className="m-2">
              Stripe customerId : {userData?.stripeCustomerId}
            </h2>
            <div className="m-2 ">
              <button onClick={() => logOut()} className="btn btn-danger">
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Registration;
