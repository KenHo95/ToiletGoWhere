import "./App.css";
import React from "react";
import UploadReview from "./Components/UploadReview";
import Map from "./Components/Map";
import { useState, useEffect } from "react";
import AuthForm from "./Components/AuthForm";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
// import CssBaseline from "@mui/material/CssBaseline";

// import Header from "./Components/Header";

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

  return (
    // <>
    //   <CssBaseline />
    //   <Header />

    <div className="App">
      <header className="App-header">
        <h1>ToiletGoWhere</h1>
        <div className="upload-review-container">
          {" "}
          {/* Apply new CSS class */}
        </div>
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
      </header>
    </div>
    // </>
  );
}

export default App;
