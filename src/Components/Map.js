// import { GoogleMap, MarkerF, useLoadScript, } from "@react-google-maps/api";
// import "../App.css";
// import toiletIcon from "../toileticon.png";

// const Map = () => {
//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: "AIzaSyAkEQvg6kr7_qGO2Dw179zKR31t3hReMn8",
//   });
//   const markers = [
//     { lat: 1.350139, lng: 103.849757 },
//     { lat: 1.266871, lng: 103.819193 },
//     { lat: 1.373912, lng: 103.849592 },
//   ];

//   const onLoad = (map) => {
//     const bounds = new window.google.maps.LatLngBounds();
//     markers?.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
//     map.fitBounds(bounds);
//   };

//   return (
//     <div className="App">
//       {!isLoaded ? (
//         <h1>Loading...</h1>
//       ) : (
//         <GoogleMap mapContainerClassName="map-container" onLoad={onLoad}>
//           {markers.map(({ lat, lng }) => (
//             <MarkerF
//               position={{ lat, lng }}
//               icon={{
//                 url: toiletIcon,
//                 scaledSize: new window.google.maps.Size(60, 50),
//               }}
//             />
//           ))}
//         </GoogleMap>
//       )}
//     </div>
//   );
// };

// export default Map;

// import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
// import { useEffect, useState } from "react";
// import { fetchToiletData } from "../firebase";
// import "../App.css";
// import toiletIcon from "../toileticon.png";
// import { v4 as uuidv4 } from "uuid";

// const App = () => {
//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: "AIzaSyAkEQvg6kr7_qGO2Dw179zKR31t3hReMn8",
//   });
//   const [toiletData, setToiletData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const data = await fetchToiletData();
//         console.log(data);
//         setToiletData(data);
//         console.log(toiletData);
//       } catch (error) {
//         console.error("Error fetching toilet data: ", error);
//       }
//     };

//     fetchData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const onLoad = (map) => {
//     const bounds = new window.google.maps.LatLngBounds();
//     toiletData.forEach(({ Latitude, Longitude }) =>
//       bounds.extend({ lat: parseFloat(Latitude), lng: parseFloat(Longitude) })
//     );
//     map.fitBounds(bounds);
//   };

//   return (
//     <div className="App">
//       {!isLoaded ? (
//         <h1>Loading...</h1>
//       ) : (
//         <GoogleMap mapContainerClassName="map-container" onLoad={onLoad}>
//           {toiletData.map(({ Latitude, Longitude }) => (
//             <MarkerF
//               key={uuidv4()}
//               position={{
//                 lat: parseFloat(Latitude),
//                 lng: parseFloat(Longitude),
//               }}
//               icon={{
//                 url: toiletIcon,
//                 scaledSize: new window.google.maps.Size(30, 30),
//               }}
//             />
//           ))}
//         </GoogleMap>
//       )}
//     </div>
//   );
// };

// export default App;

import {
  GoogleMap,
  MarkerF,
  useLoadScript,
  InfoWindow,
} from "@react-google-maps/api";
import "../App.css";
import { useState } from "react";
import toiletIcon from "../toileticon.png";

const Map = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAkEQvg6kr7_qGO2Dw179zKR31t3hReMn8",
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
          {markers.map(({ address, lat, lng }, ind) => (
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
    </div>
  );
};

export default Map;
