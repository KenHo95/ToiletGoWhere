import { React, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { realTimeDatabase } from "../firebase";
import {
  ref as realTimeDatabaseRef,
  onChildAdded,
  get,
} from "firebase/database";
import { useUserContext } from "./ContextAuthForm";

import Rating from "@mui/material/Rating";
import UploadReview from "./UploadReview";
import Button from "@mui/material/Button";
import { Grid } from "@mui/material";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Avatar from "@mui/material/Avatar";

const DB_TOILETDATA_KEY = "ToiletData";
const DB_TOILET_REVIEWLIST_KEY = "AppData/Reviews";

function ReviewList(props) {
  // initialise initial states and set states
  const [selectToiletAddress, setSelectToiletAddress] = useState([]);
  const [toiletReviewsData, setToiletReviewsData] = useState([]);
  const { error } = useUserContext();
  const navigate = useNavigate();

  let { id } = useParams(); // get selected toilet from url params as this persist after user refreshes page

  const toiletReviewsRef = realTimeDatabaseRef(
    realTimeDatabase,
    DB_TOILET_REVIEWLIST_KEY + `/${id}/`
  );

  const selectToiletAddressRef = realTimeDatabaseRef(
    realTimeDatabase,
    DB_TOILETDATA_KEY + `/${id}/Address`
  );

  useEffect(() => {
    setToiletReviewsData([]); // clear prev review data as user selects a new toilet

    onChildAdded(toiletReviewsRef, (data) => {
      setToiletReviewsData((prev) => [
        ...prev,
        { key: data.key, val: data.val() },
      ]);
    });

    get(selectToiletAddressRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setSelectToiletAddress(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {};
  }, [id]);

  const noImagePic =
    "https://firebasestorage.googleapis.com/v0/b/toiletgowhere-c70c8.appspot.com/o/assets%2Fno-img.jpg?alt=media&token=0f9455a0-ad71-4215-b408-82c7882e44ad";

  // List of reviews with date, user email, rating, review text, photo information
  let reviewListItems = toiletReviewsData.map((review) => (
    <Card
      key={review.key}
      sx={{
        maxWidth: 300,
        minWidth: 300,
        maxHeigth: 300,
        minHeigth: 300,
        bgcolor: "darkgrey",
        textAlign: "left",
        transition: "1s",
        margin: "3px",
      }}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          image={
            review.val.uploadURL !== "" ? review.val.uploadURL : noImagePic
          }
          alt="Toilet Photo"
        />
        <CardContent>
          <Rating name="read-only" value={review.val.rating} readOnly />
          <Typography gutterBottom variant="h5" component="div">
            {review.val.review}
          </Typography>
        </CardContent>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "lightblue" }} aria-label="review">
              {review.val.email[0]}
            </Avatar>
          }
          title={review.val.email}
          subheader={review.val.date}
        />
      </CardActionArea>
    </Card>
  ));

  return (
    <div className="Review-list-container">
      <h2>{selectToiletAddress}</h2>
      {props.userEmail !== "" ? (
        <div>
          <UploadReview selectedToilet={id} />
        </div>
      ) : (
        <div>
          {props.showSignInContent && (
            <div>
              Sign in to review your favorite toilet!
              <br />
              <br />
              <Button
                variant="contained"
                onClick={() => {
                  navigate("/AuthForm");
                }}
              >
                Sign In Here
              </Button>
            </div>
          )}
          {error && <p className="error">{error}</p>}
          <br />
          <br />
        </div>
      )}
      <h3>Reviews</h3>
      <div className="Review-list-container">
        {toiletReviewsData.length > 0 ? (
          <Grid
            className="Review-list-container"
            container
            spacing={1}
            justifyContent="center"
          >
            {reviewListItems}
          </Grid>
        ) : (
          "No reviews yet"
        )}
      </div>
    </div>
  );
}

export default ReviewList;
