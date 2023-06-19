//TODO: Update code of that heart stays like after refresh

import React, { useState, useEffect } from "react";
import { realTimeDatabase } from "../firebase";
import {
  onChildAdded,
  ref as realTimeDatabaseRef,
  push,
  set,
  update,
  get,
  child,
} from "firebase/database";

// styling for heart likes
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

// styling for direction button
import Fab from "@mui/material/Fab";
import NavigationIcon from "@mui/icons-material/Navigation";

// styling - color of like hearts
const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff6d75",
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  },
});

// initialise firebase RTD reference
const DB_TOILETDATA_KEY = "ToiletData";
const DB_APPDATA_KEY = "AppData";

//
function ToiletList() {
  const [toiletsData, setToiletsData] = useState([]);
  const [likeInput, setlikeInput] = useState(0);

  useEffect(() => {
    const toiletsDataRef = realTimeDatabaseRef(
      realTimeDatabase,
      DB_TOILETDATA_KEY
    );
    onChildAdded(toiletsDataRef, (data) => {
      // console.log("child added");

      setToiletsData((prev) => [...prev, { key: data.key, val: data.val() }]);
    });
    return () => {};
  }, []);

  const writeLikeData = (toiletID, isLiked) => {
    console.log("writelike");
    // set ref with relevant toilet id
    const PostRef = realTimeDatabaseRef(
      realTimeDatabase,
      DB_APPDATA_KEY + "/LikedToilets/UserID3/" // Todo: change to receive UserID prop
    );

    // update data to firebase at toiletID ref (computed property name)
    update(PostRef, {
      [toiletID]: isLiked === 1 ? true : false,
    });
  };
  // create toilet list from toilet data
  let toiletsListItems = toiletsData.map((toilet) => (
    <div>
      <li className={"toilet-list"} key={toilet.key}>
        {/* like button */}
        <StyledRating
          name="customized-color"
          defaultValue={likeInput}
          max={1}
          onChange={(event, newValue) => {
            setlikeInput(newValue);
            writeLikeData(toilet.key, newValue);
          }}
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
    // display toilet list
    <div>
      <ol>{toiletsListItems}</ol>
    </div>
  );
}

export default ToiletList;
