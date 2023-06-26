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
import Fab from "@mui/material/Fab";
import NavigationIcon from "@mui/icons-material/Navigation";
// review button
import ReviewsIcon from "@mui/icons-material/Reviews";
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
  // const [usersLikesData, setUsersLikesData] = useState({});
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
  let toiletsListItems = props.toiletsData.map(
    ({ Address, Area, Name, Type, lat, lng }, Ind) => (
      <div>
        {/* Switch between main and liked toilet list */}
        {(props.urlId === "LikedToiletList"
          ? props.likedToiletData[Ind] // render if user toilet like is true, else dont render
          : true) && (
          <li className={"toilet-item"} key={Ind}>
            {/* like button
             */}
            <StyledRating
              name="customized-color"
              defaultValue={props.usersLikesData[Ind] ? 1 : 0}
              max={1}
              onChange={(event, newValue) => {
                handleLikeButtonClick(Ind, newValue);
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
                props.handleMarkerClick(Ind, lat, lng, Address);
              }}
            >
              {Address + " "}
              {!isNaN(getAvgRatings(Ind)) && (
                <Rating name="read-only" value={getAvgRatings(Ind)} readOnly />
              )}
            </Button>{" "}
            {/* direction button
             */}
            <Fab
              variant="extended"
              size="small"
              color="primary"
              aria-label="add"
            >
              <NavigationIcon sx={{ mr: 0 }} />
            </Fab>{" "}
            {/* Show toilet reviews button
             */}
            <Fab
              variant="extended"
              size="small"
              color="primary"
              aria-label="add"
              onClick={() => {
                props.setselectedToilet(Ind);
                props.setselectedToiletAddress(Address);
                navigate("/ReviewList"); // navigate to review list when clicked
              }}
            >
              <ReviewsIcon sx={{ mr: 0 }} />
            </Fab>
          </li>
        )}
      </div>
    )
  );

  return (
    // display toilet list
    <div>
      <ol id="toilet-list" class="better_scrollbar">
        {toiletsListItems}
      </ol>
      <br />
      <br />
      <br />
    </div>
  );
}

export default ToiletList;
