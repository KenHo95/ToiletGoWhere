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
    // Compute nearest toilets only when user location and toilet data are loaded
    if (props.userLocation !== {} && props.toiletsData !== [])
      props.findNearestToilets();

    return () => {};
  }, [props.userLocation, props.toiletsData]);

  // markers to set map bound to show whole of singapore
  const markers = [
    {
      lat: 1.34,
      lng: 103.63681,
    },
    {
      lat: 1.448472,
      lng: 103.79445,
    },
    {
      lat: 1.389152,
      lng: 103.988245,
    },
  ];

  useEffect(() => {
    // toggle map bound on show nearby button click
    if (props.map) {
      let toiletsLocationBound = props.showNearbyToilets
        ? props.nearbyToilets
        : markers;

      const bounds = new window.google.maps.LatLngBounds();
      toiletsLocationBound.forEach((marker) => {
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
        {/* Show maps and toilet list display only on map and toilets data array loaded */}
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
      {/* Render only when nearby toilets are computed */}
      {props.nearbyToilets.length === 5 && (
        <FormControl component="fieldset" variant="standard">
          <FormControlLabel
            control={
              <Switch
                checked={props.showNearbyToilets}
                onChange={(e) => {
                  props.setShowNearbyToilets(!props.showNearbyToilets);
                  props.setIsOpen(false);
                }}
              />
            }
            label="Show Nearby"
          />
        </FormControl>
      )}
    </div>
  );
};

export default Map;
