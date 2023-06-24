import {
  GoogleMap,
  MarkerF,
  useLoadScript,
  InfoWindow,
} from "@react-google-maps/api";
import "../App.css";
import React, { useState } from "react";

import toiletIcon from "../toileticon.png";
import ToiletList from "./ToiletList";

const Map = (props) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });
  const [mapRef, setMapRef] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [infoWindowData, setInfoWindowData] = useState();

  const markers = [
    { address: "Bishan Bus Interchange", lat: 1.350139, lng: 103.849757 },
    { address: "Harbourfront Bus Terminal", lat: 1.266871, lng: 103.819193 },
    { address: "Yio Chu Kang Bus Interchange", lat: 1.373912, lng: 103.849592 },
  ];

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

  return (
    <div className="App">
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName="map-container"
          onLoad={onMapLoad}
          onClick={() => setIsOpen(false)}
        >
          {props.toiletsData.map(
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
                    <h3>{infoWindowData.address}</h3>
                  </InfoWindow>
                )}
              </MarkerF>
            )
          )}
        </GoogleMap>
      )}
      <ToiletList
        toiletsData={props.toiletsData}
        usersLikesData={props.usersLikesData}
        setselectedToilet={props.setselectedToilet}
        setselectedToiletAddress={props.setselectedToiletAddress}
        userEmail={props.userEmail}
        handleMarkerClick={handleMarkerClick}
      />
    </div>
  );
};

export default Map;
