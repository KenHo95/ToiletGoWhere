import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { realTimeDatabase } from "../firebase";
import {
  onChildAdded,
  ref as realTimeDatabaseRef,
  update,
} from "firebase/database";

// styling
// heart likes
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// toilet button
import Button from "@mui/material/Button";
// direction button
// color of like hearts
const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff6d75",
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  },
});

// initialise firebase RTD reference
const DB_APPDATA_KEY = "AppData";

//
function ToiletList(props) {
  const [toiletRatingsData, setToiletRatingsData] = useState([]);
  const navigate = useNavigate();

  // set relevant refs
  const UsersLikesRef = realTimeDatabaseRef(
    realTimeDatabase,
    DB_APPDATA_KEY + `/LikedToilets/${props.userEmail.split(".")[0]}/` // format userEmail to firebase acceptable format
  );

  const ToiletRatingsRef = realTimeDatabaseRef(
    realTimeDatabase,
    DB_APPDATA_KEY + "/Ratings/"
  );

  useEffect(() => {
    props.userEmail &&
      onChildAdded(ToiletRatingsRef, (data) => {
        console.log("ToiletRatings added");

        setToiletRatingsData((prev) => [...prev, data.val()]); // get toilet ratings data
      });

    return () => {};
  }, [props.userEmail]); // call useEffect twice to account for initial undefined useremail

  const handleLikeButtonClick = (toiletID, isLiked) => {
    if (props.userEmail === "") {
      // Redirect user to the login page if they are not logged in
      navigate("/AuthForm");
      return;
    }
    // update data to firebase at toiletID ref (computed property name)
    // set toilet id to true if user clicks like and null if user clicks unlike
    update(UsersLikesRef, {
      [toiletID]: isLiked === 1 ? true : null,
    });

    delete props.usersLikesData[toiletID]; // update user's like data locally
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
  let toiletsListItems = props.toiletsToDisplay.map(
    ({ Address, Area, Name, Type, id, lat, lng }) => (
      <div>
        {/* Switch between main and liked toilet list */}
        {(props.urlId === "LikedToiletList"
          ? props.usersLikesData[id] // render if user toilet like is true, else dont render
          : true) && (
          <li className={"toilet-item"} key={id}>
            {/* like button
             */}
            <StyledRating
              name="customized-color"
              defaultValue={props.usersLikesData[id] ? 1 : 0}
              max={1}
              onChange={(event, newValue) => {
                handleLikeButtonClick(id, newValue);
              }}
              icon={<FavoriteIcon fontSize="inherit" />}
              emptyIcon={
                <FavoriteBorderIcon fontSize="inherit" color="secondary" />
              }
            />{" "}
            {/* Toilet address button
             */}
            <Button
              variant="contained"
              onClick={() => {
                props.handleMarkerClick(id, lat, lng, Address);
              }}
            >
              {Address + " "}
              {!isNaN(getAvgRatings(id)) && (
                <Rating name="read-only" value={getAvgRatings(id)} readOnly />
              )}
            </Button>{" "}
            {/* direction button
             */}
          </li>
        )}
      </div>
    )
  );

  return (
    // display toilet list

    <div>
      <ol id="toilet-list">{toiletsListItems}</ol>
      <br />
      <br />
      <br />
    </div>
  );
}

export default ToiletList;
