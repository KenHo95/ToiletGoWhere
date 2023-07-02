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

import ToiletList from "./Components/ToiletList";
import ReviewList from "./Components/ReviewList";
import LikedToiletList from "./Components/LikedToiletList";
import { orderByDistance } from "geolib";

const DB_TOILETDATA_KEY = "ToiletData";
const DB_APPDATA_KEY = "AppData";

function App() {
  // initialise initial states and set states
  const [selectedToilet, setselectedToilet] = useState(null);
  const [selectedToiletAddress, setselectedToiletAddress] = useState(null);
  const [user, setUser] = useState({ email: "" });
  const [toiletsData, setToiletsData] = useState([]);
  const [usersLikesData, setUsersLikesData] = useState({ 0: null });
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyToilets, setNearbyToilets] = useState([]);
  const [map, setMap] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [infoWindowData, setInfoWindowData] = useState();
  const [showNearbyToilets, setShowNearbyToilets] = useState(false);

  const ToiletsDataRef = realTimeDatabaseRef(
    realTimeDatabase,
    DB_TOILETDATA_KEY
  );

  const UsersLikesRef = realTimeDatabaseRef(
    realTimeDatabase,
    DB_APPDATA_KEY + `/LikedToilets/${user.email.split(".")[0]}/` // format userEmail to firebase acceptable format
  );

  function success(position) {
    const userPosition = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    setUserLocation(userPosition);
    console.log(
      `Latitude: ${userPosition.latitude}, Longitude: ${userPosition.longitude}`
    );
  }

  function error() {
    console.log("Unable to retrieve user location");
  }

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation not supported");
    }
  };

  const findNearestToilets = () => {
    let coordsArray = [];
    toiletsData.map((toilet) =>
      coordsArray.push({ latitude: toilet.lat, longitude: toilet.lng })
    );

    let nearestToilets = orderByDistance(userLocation, coordsArray).slice(0, 5);
    let result = toiletsData.filter((toilet) => {
      return nearestToilets.some((nearestToilet) => {
        return toilet.lat === nearestToilet.latitude;
      });
    });

    setNearbyToilets(result);
  };

  // set default map display to toilets that are near user's location
  const onLoad = (map) => {
    setMap(map);
    const bounds = new window.google.maps.LatLngBounds();
    toiletsData?.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
    map.fitBounds(bounds);
  };

  // pan to toilet location on toilet list click
  const handleMarkerClick = (id, lat, lng, address) => {
    map?.panTo({ lat, lng });
    map?.setZoom(12);
    setInfoWindowData({ id, address });
    setIsOpen(true);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });
    // user.email &&
    onChildAdded(ToiletsDataRef, (data) => {
      console.log("ToiletsDataRef");
      setToiletsData((prev) => [...prev, data.val()]);
    });

    getUserLocation();

    return () => {};
  }, []);

  useEffect(() => {
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

  // toggle btw full and nearby toilets display
  let toiletsToDisplay = showNearbyToilets ? nearbyToilets : toiletsData;

  return (
    // <>
    //   <CssBaseline />
    //   <Header />

    <div className="App">
      {/* {(userLocation !== {} && toiletsData !== [] && )findNearestToilets()} */}
      {/* {console.log(toiletsData)} */}
      <header className="App-header">
        <h1>ToiletGoWhere</h1>
        <div>
          {/* Auth Form / Welcome Messsage*/}
          {user.email ? (
            <div>
              <h2>Welcome back {user.email}!</h2>
              <button
                onClick={(e) => {
                  signOut(auth);
                  setUser({ email: "" });
                  // eslint-disable-next-line no-restricted-globals
                  location.reload(); // to refresh user linked states
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

        <Map
          toiletsData={toiletsData}
          usersLikesData={usersLikesData}
          selectedToilet={selectedToilet}
          setselectedToilet={setselectedToilet}
          setselectedToiletAddress={setselectedToiletAddress}
          userEmail={user.email}
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
        />

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
              <ToiletList
                toiletsToDisplay={toiletsToDisplay}
                usersLikesData={usersLikesData}
                setselectedToilet={setselectedToilet}
                setselectedToiletAddress={setselectedToiletAddress}
                userEmail={user.email}
                handleMarkerClick={handleMarkerClick}
                showNearbyToilets={showNearbyToilets}
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
                toiletsToDisplay={toiletsToDisplay}
                usersLikesData={usersLikesData}
                handleMarkerClick={handleMarkerClick}
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
