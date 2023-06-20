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
  onChildRemoved,
  remove,
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
  const [UsersLikesData, setUsersLikesData] = useState({});

  // set relevant refs
  const toiletsDataRef = realTimeDatabaseRef(
    realTimeDatabase,
    DB_TOILETDATA_KEY
  );

  const UsersLikesRef = realTimeDatabaseRef(
    realTimeDatabase,
    DB_APPDATA_KEY + "/LikedToilets/UserID3/" // Todo: change to receive UserID prop
  );

  useEffect(() => {
    onChildAdded(toiletsDataRef, (data) => {
      console.log("toiletsData added");

      setToiletsData((prev) => [...prev, { key: data.key, val: data.val() }]);
    });

    onChildAdded(UsersLikesRef, (data) => {
      console.log("UsersLike added");

      setUsersLikesData((prev) => ({
        ...prev,
        [data.key]: data.val(),
      }));
    });

    // onChildRemoved(UsersLikesRef, (data) => {
    //   console.log("child removed");
    //   console.log(data.key);

    //   // const toiletid = data.key;

    //   delete UsersLikesData[0];
    // });

    return () => {};
  }, []);

  console.log(UsersLikesData);

  const writeLikeData = (toiletID, isLiked) => {
    // console.log("writelike");

    // update data to firebase at toiletID ref (computed property name)
    if (isLiked === 1) {
      update(UsersLikesRef, {
        [toiletID]: true,
      });
    } else {
      remove(
        realTimeDatabaseRef(
          realTimeDatabase,
          DB_APPDATA_KEY + `/LikedToilets/UserID3/${toiletID}` // Todo: change to receive UserID prop
        )
      );

      // update user like data locally
      delete UsersLikesData[toiletID];
    }
  };

  // create toilet list from toilet data
  let toiletsListItems = toiletsData.map((toilet) => (
    <div>
      <li className={"toilet-list"} key={toilet.key}>
        {/* like button */}
        <StyledRating
          name="customized-color"
          defaultValue={UsersLikesData[toilet.key] === true ? 1 : 0}
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
      {/* {console.log(UsersLikesData)}; */}
    </div>
  );
}

export default ToiletList;
