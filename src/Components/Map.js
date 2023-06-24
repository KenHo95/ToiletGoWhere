import {
  GoogleMap,
  MarkerF,
  useLoadScript,
  InfoWindow,
} from "@react-google-maps/api";
import "../App.css";
import React, { useState, useEffect } from "react";
import { realTimeDatabase } from "../firebase";

import { onChildAdded, ref as realTimeDatabaseRef } from "firebase/database";

import toiletIcon from "../toileticon.png";
import ToiletList from "./ToiletList";
const DB_TOILETDATA_KEY = "ToiletData";

const Map = (props) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });
  const [mapRef, setMapRef] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [infoWindowData, setInfoWindowData] = useState();
  const [toiletsData, setToiletsData] = useState([]);

  const ToiletsDataRef = realTimeDatabaseRef(
    realTimeDatabase,
    DB_TOILETDATA_KEY
  );

  useEffect(() => {
    onChildAdded(ToiletsDataRef, (data) => {
      console.log("toiletsData added");

      setToiletsData((prev) => [...prev, { key: data.key, val: data.val() }]);
    });

    return () => {};
  }, []);

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

  let Items = toiletsData.map((toilet) => ({
    lat: toilet.val.Latitude,
    lng: toilet.val.Longgitude,
    address: toilet.val.Address,
  }));

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
          {Items.map(({ address, lat, lng }, ind) => (
            <MarkerF
              key={ind}
              position={{ lat, lng }}
              icon={{
                url: toiletIcon,
                scaledSize: new window.google.maps.Size(50, 50),
              }}
              onClick={() => {
                handleMarkerClick(ind, lat, lng, address);
              }}
            >
              {isOpen && infoWindowData?.id === ind && (
                <InfoWindow
                  onCloseClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <h3>{infoWindowData.address}</h3>
                </InfoWindow>
              )}
            </MarkerF>
          ))}
        </GoogleMap>
      )}

      <ToiletList
        selectedToilet={props.selectedToilet}
        setselectedToilet={props.setselectedToilet}
        userEmail={props.userEmail}
        handleMarkerClick={handleMarkerClick}
        setIsOpen={setIsOpen}
      />
      {/* {console.log(toiletsData)}
      {console.log(Items)} */}
    </div>
  );
};

export default Map;
