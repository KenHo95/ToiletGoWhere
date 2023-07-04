// import { useMemo, useState } from "react";
// import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
// import { Autocomplete, TextField } from "@mui/material";

// const libraries = ["places"];

// const mapContainerStyle = {
//   width: "100%",
//   height: "400px",
// };

// const options = {
//   disableDefaultUI: true,
//   zoomControl: true,
// };

// export default function SearchBar() {
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: process.env.REACT_APP_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
//     libraries: libraries,
//   });

//   const center = useMemo(() => ({ lat: 43.45, lng: -80.49 }), []);

//   const [selected, setSelected] = useState(null);
//   const handlePlaceSelect = (place) => {
//     const { geometry } = place;
//     const lat = geometry.location.lat();
//     const lng = geometry.location.lng();
//     setSelected({ lat, lng });
//   };

//   if (loadError) return <div>Error loading maps</div>;
//   if (!isLoaded) return <div>Loading...</div>;

//   return (
//     <>
//       <div className="places-container">
//         <PlacesAutocomplete handlePlaceSelect={handlePlaceSelect} />
//       </div>

//       <GoogleMap
//         zoom={10}
//         center={center}
//         mapContainerStyle={mapContainerStyle}
//         options={options}
//       >
//         {selected && <MarkerF position={selected} />}
//       </GoogleMap>
//     </>
//   );
// }

// function PlacesAutocomplete({ handlePlaceSelect }) {
//   const [inputValue, setInputValue] = useState("");
//   const [options, setOptions] = useState([]);

//   const handleInputChange = (event) => {
//     setInputValue(event.target.value);
//   };

//   const handleOptionSelect = (_, option) => {
//     if (option && option.description) {
//       setInputValue(option.description);
//       handlePlaceSelect(option);
//     }
//   };

//   const handleFetchSuggestions = async (value) => {
//     setInputValue(value);

//     if (!value) {
//       setOptions([]);
//       return;
//     }

//     const service = new window.google.maps.places.AutocompleteService();
//     const request = { input: value };

//     service.getPlacePredictions(request, (results, status) => {
//       if (status === window.google.maps.places.PlacesServiceStatus.OK) {
//         setOptions(results || []);
//       }
//     });
//   };

//   return (
//     <Autocomplete
//       value={inputValue}
//       onChange={handleInputChange}
//       options={options}
//       onInputChange={(event, value) => handleFetchSuggestions(value)}
//       onSelect={handleOptionSelect}
//       getOptionLabel={(option) =>
//         option && option.description ? option.description : ""
//       }
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           label="Search for a toilet"
//           placeholder="Search for a toilet"
//           sx={{
//             backgroundColor: "white",
//             width: 300,
//             borderRadius: "4px",
//             "& .MuiOutlinedInput-notchedOutline": {
//               borderColor: "white",
//             },
//           }}
//         />
//       )}
//       renderOption={(props, option) => (
//         <li {...props} key={option.place_id}>
//           {option.description}
//         </li>
//       )}
//     />
//   );
// }
import { useMemo, useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { Autocomplete, TextField } from "@mui/material";

const libraries = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

export default function SearchBar() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "YOUR_API_KEY", // Replace with your actual API key
    libraries: libraries,
  });

  const center = useMemo(() => ({ lat: 43.45, lng: -80.49 }), []);

  const [selected, setSelected] = useState(null);
  const handlePlaceSelect = (place) => {
    const { geometry } = place;
    const lat = geometry.location.lat();
    const lng = geometry.location.lng();
    setSelected({ lat, lng });
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      <div className="places-container">
        <PlacesAutocomplete handlePlaceSelect={handlePlaceSelect} />
      </div>

      <GoogleMap
        zoom={10}
        center={center}
        mapContainerStyle={mapContainerStyle}
        options={options}
      >
        {selected && <Marker position={selected} />}
      </GoogleMap>
    </>
  );
}

function PlacesAutocomplete({ handlePlaceSelect }) {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleOptionSelect = (_, option) => {
    if (option && option.description) {
      setInputValue(option.description);
      handlePlaceSelect(option);
    }
  };

  const handleFetchSuggestions = async (value) => {
    setInputValue(value);

    if (!value) {
      setOptions([]);
      return;
    }

    const service = new window.google.maps.places.AutocompleteService();
    const request = { input: value };

    service.getPlacePredictions(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setOptions(results || []);
      }
    });
  };

  return (
    <Autocomplete
      value={inputValue}
      onChange={handleInputChange}
      options={options}
      onInputChange={(event, value) => handleFetchSuggestions(value)}
      onSelect={handleOptionSelect}
      getOptionLabel={(option) =>
        option && option.description ? option.description : ""
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search for a toilet"
          placeholder="Search for a toilet"
          sx={{
            backgroundColor: "white",
            width: 300,
            borderRadius: "4px",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "white",
            },
          }}
        />
      )}
      renderOption={(props, option) => (
        <li {...props} key={option.place_id}>
          {option.description}
        </li>
      )}
    />
  );
}
