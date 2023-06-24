import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Map from "./Map";

import { realTimeDatabase } from "../firebase";
import {
  onChildAdded,
  ref as realTimeDatabaseRef,
  update,
  remove,
} from "firebase/database";

// styling for heart likes
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

// styling for toilet button
import Button from "@mui/material/Button";

// styling for direction button
import Fab from "@mui/material/Fab";
import NavigationIcon from "@mui/icons-material/Navigation";

// styling for review button
import ReviewsIcon from "@mui/icons-material/Reviews";

// styling for average ratings

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
function ToiletList(props) {
  const [toiletsData, setToiletsData] = useState([]);
  const [usersLikesData, setUsersLikesData] = useState({});
  const [toiletRatingsData, setToiletRatingsData] = useState([]);
  const navigate = useNavigate();

  // set relevant refs
  const ToiletsDataRef = realTimeDatabaseRef(
    realTimeDatabase,
    DB_TOILETDATA_KEY
  );

  const UsersLikesRef = realTimeDatabaseRef(
    realTimeDatabase,
    DB_APPDATA_KEY + `/LikedToilets/${props.userEmail.split(".")[0]}/`
  );

  const ToiletRatingsRef = realTimeDatabaseRef(
    realTimeDatabase,
    DB_APPDATA_KEY + "/Ratings/"
  );

  useEffect(() => {
    props.userEmail && // ask khairul
      onChildAdded(ToiletsDataRef, (data) => {
        console.log("toiletsData added");

        setToiletsData((prev) => [...prev, { key: data.key, val: data.val() }]);
      });

    props.userEmail &&
      onChildAdded(UsersLikesRef, (data) => {
        console.log("UsersLike added");

        setUsersLikesData((prev) => ({
          ...prev,
          [data.key]: data.val(),
        }));
      });

    props.userEmail &&
      onChildAdded(ToiletRatingsRef, (data) => {
        console.log("ToiletRatings added");

        setToiletRatingsData((prev) => [...prev, data.val()]);
      });

    return () => {};
  }, [props.userEmail]);

  // console.log(UsersLikesData);

  const handleLikeButtonClick = (toiletID, isLiked) => {
    // console.log("writelike");

    // update data to firebase at toiletID ref (computed property name)
    if (isLiked === 1) {
      // like
      update(UsersLikesRef, {
        [toiletID]: true,
      });
    } else {
      // unlike
      remove(
        realTimeDatabaseRef(
          realTimeDatabase,
          DB_APPDATA_KEY +
            `/LikedToilets/${props.userEmail.split(".")[0]}/${toiletID}`
        )
      );

      // update user like data locally
      delete usersLikesData[toiletID];
    }
  };

  const getAvgRatings = (toiletId) => {
    let sumRatings = 0,
      count = 0;

    for (var key in toiletRatingsData[toiletId]) {
      sumRatings += toiletRatingsData[toiletId][key];
      count++;
    }
    return sumRatings / count;
  };

  // create toilet list from toilet data
  let toiletsListItems = toiletsData.map((toilet) => (
    <div>
      {/* Switch between main and liked toilet list */}
      {(props.urlId === "LikedToiletList"
        ? props.likedToiletData[toilet.key]
        : true) && (
        <li className={"toilet-list"} key={toilet.key}>
          {/* like button */}
          <StyledRating
            name="customized-color"
            defaultValue={usersLikesData[toilet.key] ? 1 : 0}
            max={1}
            onChange={(event, newValue) => {
              handleLikeButtonClick(toilet.key, newValue);
            }}
            icon={<FavoriteIcon fontSize="inherit" />}
            emptyIcon={
              <FavoriteBorderIcon fontSize="inherit" color="secondary" />
            }
          />{" "}
          {/* <span>{toilet.val.Address}</span>{" "} */}
          <Button
            variant="contained"
            onClick={() => {
              props.handleMarkerClick(
                toilet.key,
                toilet.val.Latitude,
                toilet.val.Longgitude,
                toilet.val.Address
              );
            }}
          >
            {toilet.val.Address + " "}
            {!isNaN(getAvgRatings(toilet.key)) && (
              <Rating
                name="read-only"
                value={getAvgRatings(toilet.key)}
                readOnly
              />
            )}
          </Button>{" "}
          {/* direction button
           */}
          <Fab variant="extended" size="small" color="primary" aria-label="add">
            <NavigationIcon sx={{ mr: 0 }} />
          </Fab>{" "}
          <Fab
            variant="extended"
            size="small"
            color="primary"
            aria-label="add"
            onClick={() => {
              props.setselectedToilet(toilet.key);
              navigate("/ReviewList"); // navigate to review list when clicked
            }}
          >
            <ReviewsIcon sx={{ mr: 0 }} />
          </Fab>
        </li>
      )}
    </div>
  ));

  return (
    // display toilet list

    <div>
      <ol>{toiletsListItems}</ol>
      {/* {console.log(usersLikesData)} */}
      <br />
      <br />
      <br />
    </div>
  );
}

export default ToiletList;
