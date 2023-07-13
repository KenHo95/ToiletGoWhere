import React, { useState } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

import SearchIcon from "@mui/icons-material/Search";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "500px",
    },
  },
}));

const Header = (props) => {
  const [autocomplete, setAutocomplete] = useState(null);

  const onLoad = (autocomplete) => setAutocomplete(autocomplete);

  const onPlaceChanged = () => {
    const lat = autocomplete.getPlace().geometry.location.lat();
    const lng = autocomplete.getPlace().geometry.location.lng();

    props.setUserLocation({
      latitude: lat,
      longitude: lng,
    });
    props.map?.panTo({ lat, lng });
    props.map?.setZoom(16);
    props.setIsOpen(true);
    props.setShowNearbyToilets(true); // Set showNearbyToilets to true
  };

  return (
    <Search>
      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <div>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase placeholder="Search…" className="myCustomInput" />
        </div>
      </Autocomplete>
    </Search>
  );
};

export default Header;
