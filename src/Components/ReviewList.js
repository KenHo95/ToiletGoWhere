import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { realTimeDatabase } from "../firebase";
import {
  ref as realTimeDatabaseRef,
  onChildAdded,
  get,
} from "firebase/database";

// styling for toilet button
import Rating from "@mui/material/Rating";
import UploadReview from "./UploadReview";

const DB_TOILETDATA_KEY = "ToiletData";
const DB_TOILET_REVIEWLIST_KEY = "AppData/Reviews";

function ReviewList(props) {
  // initialise initial states and set states
  const [selectToiletAddress, setSelectToiletAddress] = useState([]);
  const [toiletReviewsData, setToiletReviewsData] = useState([]);
  let { id } = useParams(); // get selected toilet from url params as this persist after user refreshes page

  const toiletReviewsRef = realTimeDatabaseRef(
    realTimeDatabase,
    DB_TOILET_REVIEWLIST_KEY + `/${id}/`
  );

  useEffect(() => {
    onChildAdded(toiletReviewsRef, (data) => {
      console.log("toiletReviewsData added");

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
  }, []);

  const selectToiletAddressRef = realTimeDatabaseRef(
    realTimeDatabase,
    DB_TOILETDATA_KEY + `/${id}/Address`
  );

  let reviewListItems = toiletReviewsData.map((review) => (
    <li key={review.key}>
      {/* like button */}
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
  ));

  return (
    <div>
      <h1>{selectToiletAddress}</h1>
      <UploadReview selectedToilet={id} />
      <h1>Reviews</h1>
      <ul className={"review-list"}>{reviewListItems}</ul>
    </div>
  );
}

export default ReviewList;
