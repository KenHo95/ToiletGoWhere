import { React, useState, useEffect } from "react";
import { realTimeDatabase } from "../firebase";
import { ref as realTimeDatabaseRef, onChildAdded } from "firebase/database";
// styling for toilet button
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";

const DB_TOILET_REVIEWLIST_KEY = "AppData/Reviews";
// const STORAGE_USERUPLOADS_KEY = "user-review-uploads/";

function ReviewList(props) {
  // initialise initial states and set states
  const [toiletReviewsData, setToiletReviewsData] = useState([]);

  const toiletReviewsRef = realTimeDatabaseRef(
    realTimeDatabase,
    DB_TOILET_REVIEWLIST_KEY + `/${props.selectedToilet}/`
  );

  useEffect(() => {
    onChildAdded(toiletReviewsRef, (data) => {
      console.log("toiletReviewsData added");

      setToiletReviewsData((prev) => [
        ...prev,
        { key: data.key, val: data.val() },
      ]);
    });

    return () => {};
  }, []);

  let reviewListItems = toiletReviewsData.map((review) => (
    <div>
      <li className={"toilet-list"} key={review.key}>
        {/* like button */}
        {/* <span>{toilet.val.Address}</span>{" "} */}
        <p>Date: {review.val.date}</p>
        <p>User: {review.val.email}</p>
        <Rating name="read-only" value={review.val.rating} readOnly />
        <p>Review: {review.val.review}</p>
        {review.val.uploadURL !== "" && (
          <img
            style={{ width: 100, height: 100 }}
            src={review.val.uploadURL}
            alt="img"
          />
        )}
      </li>
    </div>
  ));

  return (
    <div>
      {console.log(toiletReviewsData)} <h1>Reviews</h1>
      {reviewListItems}
    </div>
  );
}

export default ReviewList;