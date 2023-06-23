import "./App.css";
import { React, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

import UploadReview from "./Components/UploadReview";
import Map from "./Components/Map";
import { useState, useEffect } from "react";
import AuthForm from "./Components/AuthForm";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
// import CssBaseline from "@mui/material/CssBaseline";

// import Header from "./Components/Header";
import ToiletList from "./Components/ToiletList";
import ReviewList from "./Components/ReviewList";
import LikedToiletList from "./Components/LikedToiletList";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
      }
    });
  }, []);

  // initialise initial states and set states
  const [selectedToilet, setselectedToilet] = useState(null);

  return (
    // <>
    //   <CssBaseline />
    //   <Header />

    <div className="App">
      <header className="App-header">
        <h1>ToiletGoWhere</h1>
        <div>
          <div className="upload-review-container"> </div>
          {isLoggedIn ? <h2>Welcome back {user.email}</h2> : null}
          {isLoggedIn ? (
            <button
              onClick={(e) => {
                setIsLoggedIn(false);
                signOut(auth);
                setUser({});
              }}
            >
              Logout!
            </button>
          ) : null}
          <Map />

          {isLoggedIn ? <UploadReview /> : <AuthForm />}
        </div>
        {/* <LikedToiletList /> */}
        {/* <ReviewList selectedToilet={0} /> */}
        <Link to="/">Home</Link>
        {/* <Link to="/UploadReview">UploadReview</Link> */}
        <Link to="/LikedToiletList">Liked</Link>
        <Link to="/SearchToilets">Search</Link>

        <Routes>
          <Route
            path="/"
            element={<ToiletList setselectedToilet={setselectedToilet} />}
          />
          <Route path="/UploadReview" element={<UploadReview />} />
          <Route
            path="/ReviewList"
            element={<ReviewList selectedToilet={selectedToilet} />}
          />
          <Route path="/:id" element={<LikedToiletList />} />
        </Routes>
      </header>
    </div>
    // </>
  );
}

export default App;
