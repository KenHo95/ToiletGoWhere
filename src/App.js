import "./App.css";
import { React, useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";

import UploadReview from "./Components/UploadReview";
import ToiletList from "./Components/ToiletList";
import Map from "./Components/Map";

import AuthForm from "./Components/AuthForm";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { realTimeDatabase } from "./firebase";
import { onChildAdded, ref as realTimeDatabaseRef } from "firebase/database";
import ReviewList from "./Components/ReviewList";
import LikedToiletList from "./Components/LikedToiletList";
import { styled } from "@mui/system";
import Tabs from "@mui/base/Tabs";
import TabsList from "@mui/base/TabsList";
import TabPanel from "@mui/base/TabPanel";
import { buttonClasses } from "@mui/base/Button";
import Tab, { tabClasses } from "@mui/base/Tab";

const blue = {
  50: "#F0F7FF",
  100: "#C2E0FF",
  200: "#80BFFF",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0059B2",
  800: "#004C99",
  900: "#003A75",
};

const grey = {
  50: "#f6f8fa",
  100: "#eaeef2",
  200: "#d0d7de",
  300: "#afb8c1",
  400: "#8c959f",
  500: "#6e7781",
  600: "#57606a",
  700: "#424a53",
  800: "#32383f",
  900: "#24292f",
};

const StyledTab = styled(Tab)`
  font-family: IBM Plex Sans, sans-serif;
  color: #fff;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: transparent;
  width: 100%;
  padding: 10px 12px;
  margin: 6px 6px;
  border: none;
  border-radius: 7px;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: ${blue[400]};
  }

  &:focus {
    color: #fff;
    outline: 3px solid ${blue[200]};
  }

  &.${tabClasses.selected} {
    background-color: #fff;
    color: ${blue[600]};
  }

  &.${buttonClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledTabPanel = styled(TabPanel)(
  ({ theme }) => `
  width: 100%;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  padding: 20px 12px;
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  border-radius: 12px;
  opacity: 0.6;
  `
);

const StyledTabsList = styled(TabsList)(
  ({ theme }) => `
  min-width: 400px;
  background-color: ${blue[500]};
  border-radius: 12px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
 
  `
);

const DB_TOILETDATA_KEY = "ToiletData";
const DB_APPDATA_KEY = "AppData";

function App() {
  const [mapRef, setMapRef] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [infoWindowData, setInfoWindowData] = useState();

  const onMapLoad = (map) => {
    setMapRef(map);
    const bounds = new window.google.maps.LatLngBounds();
    markers?.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
    map.fitBounds(bounds);
  };

  const handleMarkerClick = (id, lat, lng, address) => {
    mapRef?.panTo({ lat, lng });
    setInfoWindowData({ id, address });
    setIsOpen(true);
  };

  const markers = [
    { address: "Bishan Bus Interchange", lat: 1.350139, lng: 103.849757 },
    {
      address: "Harbourfront Bus Terminal",
      lat: 1.266871,
      lng: 103.819193,
    },
    {
      address: "Yio Chu Kang Bus Interchange",
      lat: 1.373912,
      lng: 103.849592,
    },
  ];
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
    <div className="App">
      <header className="App-header">
        <div>
          {/* Auth Form / Welcome Messsage*/}
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
        {/* <Link to="/">Home</Link>
        <Link to="/LikedToiletList">Liked</Link>
        <Link to="/SearchToilets">Search</Link> */}
        <br />
        <div>
          <Map
            toiletsData={toiletsData}
            usersLikesData={usersLikesData}
            selectedToilet={selectedToilet}
            setselectedToilet={setselectedToilet}
            setselectedToiletAddress={setselectedToiletAddress}
            userEmail={user.email}
            onMapLoad={onMapLoad}
            handleMarkerClick={handleMarkerClick}
            mapRef={mapRef}
            isOpen={isOpen}
            infoWindowData={infoWindowData}
          />
          <Tabs defaultValue={0}>
            <StyledTabsList>
              <StyledTab value={0}>
                {" "}
                <Link to="/">Home</Link>
              </StyledTab>
              <StyledTab value={1}>
                <Link to="/LikedToiletList">Liked</Link>
              </StyledTab>
              <StyledTab value={2}>
                {" "}
                <Link to="/SearchToilets">Search</Link>
              </StyledTab>
            </StyledTabsList>
            {/* 
            <StyledTabPanel value={0}> </StyledTabPanel>
            <StyledTabPanel value={1}> </StyledTabPanel>
            <StyledTabPanel value={2}></StyledTabPanel> */}

            <Routes>
              {/* ToiletList */}
              <Route
                path="/"
                element={
                  <ToiletList
                    toiletsData={toiletsData}
                    usersLikesData={usersLikesData}
                    setselectedToilet={setselectedToilet}
                    setselectedToiletAddress={setselectedToiletAddress}
                    userEmail={user.email}
                    handleMarkerClick={handleMarkerClick}
                  />
                }
              />
            </Routes>

            <Routes>
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
            </Routes>
            <Routes>
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
          </Tabs>
        </div>
      </header>
    </div>
  );
}

export default App;
