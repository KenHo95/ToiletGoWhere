import "./App.css";
import { React, useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";

import UploadReview from "./Components/UploadReview";
import Map from "./Components/Map";
import AuthForm from "./Components/AuthForm";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { realTimeDatabase } from "./firebase";
import { onChildAdded, ref as realTimeDatabaseRef } from "firebase/database";
// import CssBaseline from "@mui/material/CssBaseline";

// import Header from "./Components/Header";
import ReviewList from "./Components/ReviewList";
import LikedToiletList from "./Components/LikedToiletList";

const DB_TOILETDATA_KEY = "ToiletData";
const DB_APPDATA_KEY = "AppData";

function App() {
  // initialise initial states and set states
  const [selectedToilet, setselectedToilet] = useState(null);
  const [selectedToiletAddress, setselectedToiletAddress] = useState(null);
  const [user, setUser] = useState({ email: "" });
  const [toiletsData, setToiletsData] = useState([]);
  const [usersLikesData, setUsersLikesData] = useState({ 0: null });

  const ToiletsDataRef = realTimeDatabaseRef(
    realTimeDatabase,
    DB_TOILETDATA_KEY
  );

  const UsersLikesRef = realTimeDatabaseRef(
    realTimeDatabase,
    DB_APPDATA_KEY + `/LikedToilets/${user.email.split(".")[0]}/` // format userEmail to firebase acceptable format
  );

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });
    user.email &&
      onChildAdded(ToiletsDataRef, (data) => {
        setToiletsData((prev) => [...prev, data.val()]);
      });

    user.email &&
      onChildAdded(UsersLikesRef, (data) => {
        console.log("UsersLike added");

        setUsersLikesData((prev) => ({
          // get userlikes data
          ...prev,
          [data.key]: data.val(),
        }));
      });

    return () => {};
  }, [user.email]);

  return (
    // <>
    //   <CssBaseline />
    //   <Header />

    <div className="App">
      <header className="App-header">
        <h1>ToiletGoWhere</h1>
        <div>
          {/* Auth Form */}
          {user.email !== "" ? (
            <div>
              <h2>Welcome back {user.email}!</h2>
              <button
                onClick={(e) => {
                  signOut(auth);
                  setUser({ email: "" });
                }}
              >
                Logout!
              </button>
            </div>
          ) : (
            <AuthForm />
          )}
        </div>
        <br />

        {/* Links */}
        <Link to="/">Home</Link>
        <Link to="/LikedToiletList">Liked</Link>
        <Link to="/SearchToilets">Search</Link>
        <br />

        <Routes>
          {/* Map */}
          <Route
            path="/"
            element={
              <Map
                toiletsData={toiletsData}
                usersLikesData={usersLikesData}
                selectedToilet={selectedToilet}
                setselectedToilet={setselectedToilet}
                setselectedToiletAddress={setselectedToiletAddress}
                userEmail={user.email}
              />
            }
          />
          {/* UploadReview */}
          <Route path="/UploadReview" element={<UploadReview />} />
          <Route
            path="/ReviewList"
            element={
              <ReviewList
                selectedToilet={selectedToilet}
                selectedToiletAddress={selectedToiletAddress}
              />
            }
          />
          {/* LikedToiletList */}
          <Route
            path="/:id"
            element={
              <LikedToiletList
                userEmail={user.email}
                toiletsData={toiletsData}
                usersLikesData={usersLikesData}
              />
            }
          />
        </Routes>
      </header>
    </div>
    // </>
  );
}

export default App;
