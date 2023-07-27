import "./App.css";
import { React, useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { realTimeDatabase } from "./firebase";
import { onChildAdded, ref as realTimeDatabaseRef } from "firebase/database";

import ToiletList from "./Components/ToiletList";
import ReviewList from "./Components/ReviewList";
import Header from "./Components/Search";
import LikedToiletList from "./Components/LikedToiletList";
import Map from "./Components/Map";
import AuthForm from "./Components/AuthForm";
import Account from "./Components/Account";
import { useUserContext } from "./Components/ContextAuthForm";
import { orderByDistance } from "geolib";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SearchIcon from "@mui/icons-material/Search";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

const DB_TOILETDATA_KEY = "ToiletData";
const DB_APPDATA_KEY = "AppData";
const NO_OF_NEARBY_TOILETS = 5;

function App() {
  const navigate = useNavigate();
  // initialise initial states and set states
  const [user, setUser] = useState({ email: "" });
  const [usersLikesData, setUsersLikesData] = useState({ 0: null });
  const [userLocation, setUserLocation] = useState({ lat: 0, lng: 0 });

  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showSignInContent, setShowSignInContent] = useState(true);
  const { error } = useUserContext();

  const [toiletsData, setToiletsData] = useState([]);
  const [toiletRatingsData, setToiletRatingsData] = useState([]);
  const [nearbyToilets, setNearbyToilets] = useState([]);
  const [showNearbyToilets, setShowNearbyToilets] = useState(false);

  const [map, setMap] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [infoWindowData, setInfoWindowData] = useState();
  const location = useLocation();
  const [searchedToilets, setSearchedToilets] = useState([]);
  const [showSearchedToilets, setShowSearchedToilets] = useState(false);

  //////////////////////////////////////////
  // Functions to get data from firebase //
  /////////////////////////////////////////
  const ToiletsDataRef = realTimeDatabaseRef(
    realTimeDatabase,
    DB_TOILETDATA_KEY
  );

  const ToiletRatingsRef = realTimeDatabaseRef(
    realTimeDatabase,
    DB_APPDATA_KEY + "/Ratings/"
  );

  useEffect(() => {
    // set user data after login
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });

    // get toilets data
    onChildAdded(ToiletsDataRef, (data) => {
      setToiletsData((prev) => [...prev, data.val()]);
    });

    // get toilet ratings data
    // user.email &&
    onChildAdded(ToiletRatingsRef, (data) => {
      setToiletRatingsData((prev) => ({ ...prev, [data.key]: data.val() }));
    });

    // get User Location
    getUserLocation();

    return () => {};
  }, []);

  const UsersLikesRef = realTimeDatabaseRef(
    realTimeDatabase,
    DB_APPDATA_KEY + `/LikedToilets/${user.email.split(".")[0]}/` // format userEmail to firebase acceptable format
  );

  useEffect(() => {
    // get userlikes data
    user.email &&
      onChildAdded(UsersLikesRef, (data) => {
        setUsersLikesData((prev) => ({
          ...prev,
          [data.key]: data.val(),
        }));
      });

    return () => {};
  }, [user.email]); // call useEffect when user login

  /////////////////////////////////////
  // Functions to get user location //
  ///////////////////////////////////
  function success(position) {
    const userPosition = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    setUserLocation(userPosition);
    map?.panTo({ lat: userPosition.latitude, lng: userPosition.longitude });
    map?.setZoom(14);
  }

  function handleError() {
    console.log("Unable to retrieve user location");
  }

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, handleError);
    } else {
      console.log("Geolocation not supported");
    }
  };

  //////////////////////////////////
  // Functions for Map Component //
  /////////////////////////////////
  const findNearestToilets = () => {
    let coordsArray = [];
    toiletsData.map((toilet) =>
      coordsArray.push({ latitude: toilet.lat, longitude: toilet.lng })
    );

    // get five nearest toilets to user location
    let nearestToilets = orderByDistance(userLocation, coordsArray).slice(
      0,
      NO_OF_NEARBY_TOILETS
    );
    let result = toiletsData.filter((toilet) => {
      return nearestToilets.some((nearestToilet) => {
        return toilet.lat === nearestToilet.latitude;
      });
    });

    setNearbyToilets(result);
  };

  const getAvgRatings = (toiletId) => {
    let sumRatings = 0,
      count = 0;

    for (var key in toiletRatingsData[toiletId]) {
      sumRatings += toiletRatingsData[toiletId][key];
      count++;
    }

    return sumRatings / count;
  };

  // set on load map display to all toilets location
  const onLoad = (map) => {
    setMap(map);
    const bounds = new window.google.maps.LatLngBounds();
    toiletsData?.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
    map.fitBounds(bounds);
  };

  // pan to toilet location on toilet list click
  const handleMarkerClick = (id, lat, lng, address) => {
    map?.panTo({ lat, lng });
    map?.setZoom(14);
    setInfoWindowData({ id, address });
    setIsOpen(true);
  };

  /////////////////////
  // Other functions //
  /////////////////////

  // toggle between full and nearby toilets display
  let toiletsToDisplay = showNearbyToilets ? nearbyToilets : toiletsData;

  useEffect(() => {
    // Reset the sign in redirect state when user navigates elsewhere
    setShowAuthForm(false);
    setShowSignInContent(true);
    return;
  }, [location]);

  // generate nav button
  const navButton = (pathName, icon, buttonText) => {
    // get path
    let urlPath = window.location.pathname;

    return (
      <Button
        variant={urlPath === pathName ? "contained" : "outline"}
        onClick={() => {
          navigate(pathName);
        }}
        size="large"
        sx={{ fontSize: "2vw" }}
        startIcon={icon}
      >
        {buttonText}
      </Button>
    );
  };

  // button to direct to auth form
  const signInButton = (message) => {
    return (
      <div className="signInDirectButton">
        {showSignInContent && (
          <div>
            {message}
            <br />
            <br />
            <Button
              variant="contained"
              onClick={() => {
                setShowSignInContent(false);
                navigate("/AuthForm");
              }}
            >
              Sign In Here
            </Button>
          </div>
        )}
        {error && <p className="error">{error}</p>}
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <b>🚽 ToiletGoWhere</b>
        <br />
        {/* Map */}
        <Map
          toiletsData={toiletsData}
          findNearestToilets={findNearestToilets}
          userLocation={userLocation}
          nearbyToilets={nearbyToilets}
          showNearbyToilets={showNearbyToilets}
          setShowNearbyToilets={setShowNearbyToilets}
          map={map}
          setMap={setMap}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          infoWindowData={infoWindowData}
          setInfoWindowData={setInfoWindowData}
          onLoad={onLoad}
          handleMarkerClick={handleMarkerClick}
          toiletsToDisplay={toiletsToDisplay}
          userLoggedIn={user.email !== ""}
          getAvgRatings={getAvgRatings}
          getUserLocation={getUserLocation}
        />
        {/* Navigation Buttons */}
        <Stack spacing={2} direction="row" className="navBar">
          {navButton("/", <HomeIcon />, "Home")}
          {navButton("/LikedToiletList", <FavoriteIcon />, "Likes")}
          {navButton("/SearchToilets", <SearchIcon />, "Search")}
          {navButton("/Account", <ManageAccountsIcon />, "Account")}
        </Stack>
        {/* Component Routes */}
        {/* ToiletList */}
        <Routes>
          <Route
            path="/"
            element={
              <ToiletList
                toiletsToDisplay={toiletsToDisplay}
                usersLikesData={usersLikesData}
                userEmail={user.email}
                handleMarkerClick={handleMarkerClick}
                showNearbyToilets={showNearbyToilets}
                getAvgRatings={getAvgRatings}
                user={user}
              />
            }
          />
          {/* Review */}
          <Route
            path={"/ReviewList/:id"}
            element={
              <ReviewList
                userEmail={user.email}
                showSignInContent={showSignInContent}
                setShowSignInContent={setShowSignInContent}
                showAuthForm={showAuthForm}
                setShowAuthForm={setShowAuthForm}
              />
            }
          />

          {/* Login */}
          <Route path={"/AuthForm"} element={<AuthForm />} />

          {/* Account */}
          <Route
            path={"/Account"}
            element={
              user.email !== "" ? (
                <div>
                  <Account setUser={setUser} />
                </div>
              ) : (
                signInButton("Sign in to your Account!")
              )
            }
          />

          {/* LikedToiletList */}
          <Route
            path="/:id"
            element={
              user.email !== "" ? (
                <div>
                  <LikedToiletList
                    userEmail={user.email}
                    toiletsToDisplay={toiletsToDisplay}
                    usersLikesData={usersLikesData}
                    handleMarkerClick={handleMarkerClick}
                    getAvgRatings={getAvgRatings}
                  />{" "}
                </div>
              ) : (
                signInButton("Sign in to save your favorite toilet!")
              )
            }
          />

          {/* Search ToiletList */}
          <Route
            path="/SearchToilets"
            element={
              user.email !== "" ? (
                <div>
                  <Header
                    setUserLocation={setUserLocation}
                    setShowNearbyToilets={setShowNearbyToilets}
                    setIsOpen={setIsOpen}
                    isOpen={isOpen} // Pass the isOpen state as a prop
                    toiletsToDisplay={toiletsToDisplay}
                    map={map}
                    toiletsData={toiletsData}
                    setSearchedToilets={setSearchedToilets}
                    setShowSearchedToilets={setShowSearchedToilets}
                  />
                  {showSearchedToilets && (
                    <ToiletList
                      toiletsToDisplay={
                        searchedToilets.length > 0
                          ? searchedToilets
                          : toiletsToDisplay
                      }
                      usersLikesData={usersLikesData}
                      userEmail={user.email} // Pass the user.email value as the userEmail prop
                      handleMarkerClick={handleMarkerClick}
                      showNearbyToilets={showNearbyToilets}
                      getAvgRatings={getAvgRatings}
                      user={user}
                    />
                  )}
                </div>
              ) : (
                signInButton("Sign in to continue your toilet search!")
              )
            }
          />
        </Routes>
      </header>
    </div>
  );
}

export default App;
