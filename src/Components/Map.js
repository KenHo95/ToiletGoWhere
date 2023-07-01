import {
  GoogleMap,
  MarkerF,
  useLoadScript,
  InfoWindow,
} from "@react-google-maps/api";
import "../App.css";
import React, { useEffect } from "react";

import toiletIcon from "../toileticon.png";
import userIcon from "../userIcon.png";

import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";

const Map = (props) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (props.userLocation !== {} && props.toiletsData !== [])
      props.findNearestToilets();

    return () => {};
  }, [props.userLocation]);

  // markers to set map bound to show whole of singapore
  const markers = [
    {
      // address: "20 Tuas West Drive, S(638418)",
      lat: 1.34,
      lng: 103.63681,
    },
    {
      // address: "60 Woodlands Industrial Park E4, S(757705)",
      lat: 1.448472,
      lng: 103.79445,
    },
    {
      // address: "2 Changi Village Road, S(500002)",
      lat: 1.389152,
      lng: 103.988245,
    },
  ];

  useEffect(() => {
    // to toggle map bound on show nearby button click
    if (props.map) {
      let toiletsLocationBound = props.showNearbyToilets
        ? props.nearbyToilets
        : markers;

      const bounds = new window.google.maps.LatLngBounds();
      toiletsLocationBound.map((marker) => {
        bounds.extend({
          lat: marker.lat,
          lng: marker.lng,
        });
      });
      props.map.fitBounds(bounds);
    }
  }, [props.showNearbyToilets]);

  return (
    <div>
      {/* {console.log(props.toiletsToDisplay)}{" "} */}
      <div className="Map">
        {/* Show maps and toilet list display only on map and nearby toilets array loaded */}
        {!isLoaded || props.toiletsToDisplay.length === 0 ? (
          <h1>Loading...</h1>
        ) : (
          <GoogleMap
            mapContainerClassName="map-container"
            onLoad={props.onLoad}
            onClick={() => props.setIsOpen(false)}
          >
            {/* Toilet markers */}
            {props.toiletsToDisplay.map(
              ({ Address, Area, Name, Type, lat, lng }, Ind) => (
                <MarkerF
                  key={Ind}
                  position={{ lat, lng }}
                  icon={{
                    url: toiletIcon,
                    scaledSize: new window.google.maps.Size(50, 50),
                  }}
                  onClick={() => {
                    props.handleMarkerClick(Ind, lat, lng, Address);
                  }}
                >
                  {props.isOpen && props.infoWindowData?.id === Ind && (
                    <InfoWindow
                      onCloseClick={() => {
                        props.setIsOpen(false);
                      }}
                    >
                      <h3 className="info-window">
                        {props.infoWindowData.address}
                      </h3>
                    </InfoWindow>
                  )}
                </MarkerF>
              )
            )}
            {/* User marker*/}
            {props.nearbyToilets.length === 5 && (
              <MarkerF
                key="userLoc"
                position={{
                  lat: props.userLocation.latitude,
                  lng: props.userLocation.longitude,
                }}
                icon={{
                  url: userIcon,
                  scaledSize: new window.google.maps.Size(60, 60),
                }}
              ></MarkerF>
            )}
          </GoogleMap>
        )}
      </div>
      {/* Toggle btw nearby/ full toilets location display */}
      {props.nearbyToilets.length === 5 && (
        <FormControl component="fieldset" variant="standard">
          <FormControlLabel
            control={
              <Switch
                checked={props.showNearbyToilets}
                onChange={(e) => {
                  props.setShowNearbyToilets(
                    props.showNearbyToilets ? false : true
                  );
                  props.setIsOpen(false);
                  // onMapChange();
                }}
              />
            }
            label="Show Nearby"
          />
        </FormControl>
      )}
      {/* <ToiletList
        toiletsToDisplay={toiletsToDisplay}
        usersLikesData={props.usersLikesData}
        setselectedToilet={props.setselectedToilet}
        setselectedToiletAddress={props.setselectedToiletAddress}
        userEmail={props.userEmail}
        handleMarkerClick={handleMarkerClick}
        showNearbyToilets={showNearbyToilets}
      /> */}
    </div>
  );
};

export default Map;
