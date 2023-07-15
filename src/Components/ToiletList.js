import React from "react";
import { useNavigate } from "react-router-dom";
import { realTimeDatabase } from "../firebase";
import { ref as realTimeDatabaseRef, update } from "firebase/database";

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
  const navigate = useNavigate();

  // set relevant refs
  const UsersLikesRef = realTimeDatabaseRef(
    realTimeDatabase,
    DB_APPDATA_KEY + `/LikedToilets/${props.userEmail.split(".")[0]}/` // format userEmail to firebase acceptable format
  );

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
              {/* Display average rating stars
               */}
              {!isNaN(props.getAvgRatings(id)) && (
                <Rating
                  name="read-only"
                  value={props.getAvgRatings(id)}
                  readOnly
                />
              )}
            </Button>{" "}
          </li>
        )}
      </div>
    )
  );

  return (
    // display toilet list
    <div>
      <ol id="toilet-list">{toiletsListItems}</ol>
    </div>
  );
}

export default ToiletList;
