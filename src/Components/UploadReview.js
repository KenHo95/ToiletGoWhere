import React, { useState } from "react";
import { realTimeDatabase, storage } from "../firebase";
import { push, ref as realTimeDatabaseRef, set } from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytesResumable,
} from "firebase/storage";

import Rating from "@mui/material/Rating";

const DB_APPDATA_KEY = "AppData/";
const STORAGE_USERUPLOADS_KEY = "user-review-uploads/";

function UploadReview() {
  // initialise initial states and set states
  const [reviewInput, setReviewInput] = useState("");
  const [fileInputFile, setfileInputFile] = useState(null);
  const [ratingInputValue, setRatingInputValue] = useState(3);

  // functions
  const writeData = (url) => {
    const PostRef = realTimeDatabaseRef(
      realTimeDatabase,
      DB_APPDATA_KEY + "Reviews/ToiletId1/" // Todo: change to receive toiletid prop
    );
    const newPostRef = push(PostRef);

    set(newPostRef, {
      date: new Date().toLocaleString(),
      email: "testing123@gmail.com", // Todo: change to receive email prop from firebase or google auth
      review: reviewInput,
      rating: ratingInputValue,
      uploadURL: url,
    });

    // reset states
    setReviewInput("");
    setfileInputFile(null);
    setRatingInputValue(3);
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();

    // if user did not select a photo
    if (fileInputFile === null) {
      // upload review without a photo
      writeData("");
      return;
    }

    const fullStorageRef = storageRef(
      storage,
      STORAGE_USERUPLOADS_KEY + "testing123@gmail.com/" + fileInputFile.name
    );

    const uploadTask = uploadBytesResumable(fullStorageRef, fileInputFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        // error message to user
        switch (error.code) {
          case "storage/unauthorized":
            alert(
              "We are having trouble verifying your permission to post image. Please contact the app creator on this issue."
            );
            break;

          case "storage/unknown":
            alert(
              "We are currently having trouble uploading your photo. Your review will be posted without the photo. Please try again later."
            );
            break;
          // no default
        }
      },
      () => {
        // upload review
        getDownloadURL(uploadTask.snapshot.ref, fileInputFile.name).then(
          (url) => {
            writeData(url);
          }
        );
      }
    );
  };

  // display
  return (
    <form onSubmit={handlePostSubmit}>
      {/* message input */}
      <h3>Review</h3>
      <Rating
        name="simple-controlled"
        value={ratingInputValue}
        onChange={(event, newValue) => {
          setRatingInputValue(newValue);
        }}
      />
      <br />
      <input
        type="text"
        value={reviewInput}
        onChange={(e) => {
          setReviewInput(e.target.value);
        }}
        placeholder="How is this toilet?"
      />{" "}
      <br />
      <br />
      {/* photo upload */}
      <div className="inputContainer">
        <label>
          {fileInputFile !== null ? "Change Photo" : "Select Photo"}
          <br />
          <br />
          <i className="fa fa-2x fa-camera"></i>
          <input
            className="inputTag"
            type="file"
            value={""}
            onChange={(e) => {
              setfileInputFile(e.target.files[0]);
            }}
          />
          <br />
        </label>
      </div>
      <br />
      <div>
        {fileInputFile !== null ? (
          <img
            className="uploadPhoto"
            src={URL.createObjectURL(fileInputFile)}
            alt="User upload of toilet"
          />
        ) : null}
      </div>
      <br />
      <input type="submit" value="Post" />
    </form>
  );
}

export default UploadReview;
