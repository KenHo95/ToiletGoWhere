import {
  GoogleMap,
  MarkerF,
  useLoadScript,
  InfoWindow,
} from "@react-google-maps/api";
import "../App.css";
import React, { useState, useEffect } from "react";

import toiletIcon from "../toileticon.png";
import userIcon from "../userIcon.png";
import ToiletList from "./ToiletList";

import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";

const Map = (props) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });
  const [map, setMap] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [infoWindowData, setInfoWindowData] = useState();
  const [showNearbyToilets, setShowNearbyToilets] = useState(true);

  useEffect(() => {
    if (props.userLocation !== {} && props.toiletsData !== [])
      props.findNearestToilets();

    return () => {};
  }, [props.userLocation]);

  // set default map display to toilets that are near user's location
  const onLoad = (map) => {
    setMap(map);
    const bounds = new window.google.maps.LatLngBounds();
    props.nearbyToilets?.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
    map.fitBounds(bounds);
  };

  // pan to toilet location on toilet list click
  const handleMarkerClick = (id, lat, lng, address) => {
    map?.panTo({ lat, lng });
    setInfoWindowData({ id, address });
    setIsOpen(true);
  };

  // markers to set map bound to show whole of singapore
  const markers = [
    {
      address: "20 Tuas West Drive, S(638418)",
      lat: 1.34,
      lng: 103.63681,
    },
    {
      address: "60 Woodlands Industrial Park E4, S(757705)",
      lat: 1.448472,
      lng: 103.79445,
    },
    {
      address: "2 Changi Village Road, S(500002)",
      lat: 1.389152,
      lng: 103.988245,
    },
  ];

  useEffect(() => {
    // to toggle map bound on show nearby button click
    if (map) {
      let toiletsLocationBound = showNearbyToilets
        ? props.nearbyToilets
        : markers;

      const bounds = new window.google.maps.LatLngBounds();
      toiletsLocationBound.map((marker) => {
        bounds.extend({
          lat: marker.lat,
          lng: marker.lng,
        });
      });
      map.fitBounds(bounds);
    }
  }, [showNearbyToilets]);

  // toggle btw full and nearby toilets display
  let toiletsToDisplay = showNearbyToilets
    ? props.nearbyToilets
    : props.toiletsData;

  return (
    <div>
      <div className="Map">
        {/* Show maps and toilet list display only on map and nearby toilets array loaded */}
        {!isLoaded || props.nearbyToilets.length !== 5 ? (
          <h1>Loading...</h1>
        ) : (
          <GoogleMap
            mapContainerClassName="map-container"
            onLoad={onLoad}
            onClick={() => setIsOpen(false)}
          >
            {/* Toilet markers */}
            {toiletsToDisplay.map(
              ({ Address, Area, Name, Type, lat, lng }, Ind) => (
                <MarkerF
                  key={Ind}
                  position={{ lat, lng }}
                  icon={{
                    url: toiletIcon,
                    scaledSize: new window.google.maps.Size(50, 50),
                  }}
                  onClick={() => {
                    handleMarkerClick(Ind, lat, lng, Address);
                  }}
                >
                  {isOpen && infoWindowData?.id === Ind && (
                    <InfoWindow
                      onCloseClick={() => {
                        setIsOpen(false);
                      }}
                    >
                      <h3 className="info-window">{infoWindowData.address}</h3>
                    </InfoWindow>
                  )}
                </MarkerF>
              )
            )}
            {/* User marker*/}
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
          </GoogleMap>
        )}
      </div>
      {/* Toggle btw nearby/ full toilets location display */}
      <FormControl component="fieldset" variant="standard">
        <FormControlLabel
          control={
            <Switch
              checked={showNearbyToilets}
              onChange={(e) => {
                setShowNearbyToilets(showNearbyToilets === 0 ? 1 : 0);
                setIsOpen(false);
                // onMapChange();
              }}
            />
          }
          label="Show Nearby"
        />
      </FormControl>

      <ToiletList
        toiletsToDisplay={toiletsToDisplay}
        usersLikesData={props.usersLikesData}
        setselectedToilet={props.setselectedToilet}
        setselectedToiletAddress={props.setselectedToiletAddress}
        userEmail={props.userEmail}
        handleMarkerClick={handleMarkerClick}
        showNearbyToilets={showNearbyToilets}
      />
    </div>
  );
};

export default Map;
