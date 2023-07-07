import "./App.css";
import { React, useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

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

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SearchIcon from "@mui/icons-material/Search";

const DB_TOILETDATA_KEY = "ToiletData";
const DB_APPDATA_KEY = "AppData";

function App() {
  const navigate = useNavigate();

  // initialise initial states and set states
  const [user, setUser] = useState({ email: "" });
  const [toiletsData, setToiletsData] = useState([]);
  const [usersLikesData, setUsersLikesData] = useState({ 0: null });
  const [userLocation, setUserLocation] = useState({ lat: 0, lng: 0 });
  const [nearbyToilets, setNearbyToilets] = useState([]);
  const [map, setMap] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [infoWindowData, setInfoWindowData] = useState();
  const [showNearbyToilets, setShowNearbyToilets] = useState(false);
  const [toiletRatingsData, setToiletRatingsData] = useState([]);
  const [buttonClickedValue, setbuttonClickedValue] = useState(1);

  //////////////////////////////////////////
  // Functions to get data from firebase //
  /////////////////////////////////////////
  const ToiletsDataRef = realTimeDatabaseRef(
    realTimeDatabase,
    DB_TOILETDATA_KEY
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
      console.log("ToiletsDataRef");

      setToiletsData((prev) => [...prev, data.val()]);
    });

    // get User Location
    getUserLocation();

    return () => {};
  }, []);

  const UsersLikesRef = realTimeDatabaseRef(
    realTimeDatabase,
    DB_APPDATA_KEY + `/LikedToilets/${user.email.split(".")[0]}/` // format userEmail to firebase acceptable format
  );

  const ToiletRatingsRef = realTimeDatabaseRef(
    realTimeDatabase,
    DB_APPDATA_KEY + "/Ratings/"
  );

  useEffect(() => {
    // get userlikes data
    user.email &&
      onChildAdded(UsersLikesRef, (data) => {
        console.log("UsersLike added");

        setUsersLikesData((prev) => ({
          ...prev,
          [data.key]: data.val(),
        }));
      });

    // get toilet ratings data
    user.email &&
      onChildAdded(ToiletRatingsRef, (data) => {
        console.log("ToiletRatings added");

        setToiletRatingsData((prev) => ({ ...prev, [data.key]: data.val() }));
      });
    return () => {};
  }, [user.email]); // call useEffect twice to account for initial undefined useremail

  /////////////////////////////////////
  // Functions to get user location //
  ///////////////////////////////////
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

  //////////////////////////////////
  // Functions for Map Component //
  /////////////////////////////////
  const findNearestToilets = () => {
    let coordsArray = [];
    toiletsData.map((toilet) =>
      coordsArray.push({ latitude: toilet.lat, longitude: toilet.lng })
    );

    // add ID info to determine liked toilets
    let toiletsDataWithID = toiletsData.map((toilet, index) => ({
      ...toilet,
      id: index,
    }));

    // get five nearest toilets to user location
    let nearestToilets = orderByDistance(userLocation, coordsArray).slice(0, 5);
    let result = toiletsDataWithID.filter((toilet) => {
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

  // add ID info to determine liked toilets
  let toiletsDataWithID = toiletsData.map((toilet, index) => ({
    ...toilet,
    id: index,
  }));

  // toggle between full and nearby toilets display
  let toiletsToDisplay = showNearbyToilets ? nearbyToilets : toiletsDataWithID;

  return (
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
          getAvgRatings={getAvgRatings}
        />
        <br />

        <Stack spacing={2} direction="row">
          <Button
            variant={buttonClickedValue === 1 ? "contained" : "outline"}
            onClick={() => {
              setbuttonClickedValue(1);
              navigate(`/`);
            }}
            size="large"
            sx={{ fontSize: 24 }}
            startIcon={<HomeIcon />}
          >
            Home
          </Button>
          <Button
            variant={buttonClickedValue === 2 ? "contained" : "outline"}
            onClick={() => {
              setbuttonClickedValue(2);
              navigate(`/LikedToiletList`);
            }}
            size="large"
            sx={{ fontSize: 24 }}
            startIcon={<FavoriteIcon />}
          >
            Likes
          </Button>
          <Button
            variant={buttonClickedValue === 3 ? "contained" : "outline"}
            onClick={() => {
              setbuttonClickedValue(3);
              navigate(`/SearchToilets`);
            }}
            size="large"
            sx={{ fontSize: 24 }}
            startIcon={<SearchIcon />}
          >
            Search
          </Button>
        </Stack>

        {/* Links */}
        {/* <Link to="/">Home</Link>
        <Link to="/LikedToiletList">Liked</Link>
        <Link to="/SearchToilets">Search</Link> */}
        <br />

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
              />
            }
          />
          {/* Review */}
          <Route path={"/ReviewList/:id"} element={<ReviewList />} />

          {/* LikedToiletList */}
          <Route
            path="/:id"
            element={
              <LikedToiletList
                userEmail={user.email}
                toiletsToDisplay={toiletsToDisplay}
                usersLikesData={usersLikesData}
                handleMarkerClick={handleMarkerClick}
                getAvgRatings={getAvgRatings}
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
