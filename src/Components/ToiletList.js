import React, { useState, useEffect } from "react";
import { realTimeDatabase } from "../firebase";
import { onChildAdded, ref as realTimeDatabaseRef } from "firebase/database";

// styling for heart likes
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

// styling for direction button
import Fab from "@mui/material/Fab";
import NavigationIcon from "@mui/icons-material/Navigation";

// styling for heart likes
const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff6d75",
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  },
});

const DB_APPDATA_KEY = "ToiletData";

function ToiletList() {
  const [toiletsData, setToiletsData] = useState([]);

  useEffect(() => {
    const toiletsDataRef = realTimeDatabaseRef(
      realTimeDatabase,
      DB_APPDATA_KEY
    );
    onChildAdded(toiletsDataRef, (data) => {
      // console.log("child added");

      setToiletsData((prev) => [...prev, { key: data.key, val: data.val() }]);
    });
    return () => {};
  }, []);

  console.log(toiletsData);
  let toiletsListItems = toiletsData.map((toilet) => (
    <div>
      <li className={"toilet-list"} key={toilet.key}>
        {/* like button */}
        <StyledRating
          name="customized-color"
          defaultValue={0}
          max={1}
          icon={<FavoriteIcon fontSize="inherit" />}
          emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
        />{" "}
        <span>{toilet.val.Address}</span>{" "}
        {/* direction button
         */}
        <Fab variant="extended" size="small" color="primary" aria-label="add">
          <NavigationIcon sx={{ mr: 1 }} />
          Directions
        </Fab>
      </li>
    </div>
  ));

  return (
    <div>
      <ol>{toiletsListItems}</ol>
    </div>
  );
}

export default ToiletList;
