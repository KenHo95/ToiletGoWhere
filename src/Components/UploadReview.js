import { React, useState, useEffect } from "react";
import { realTimeDatabase, storage } from "../firebase";
import {
  push,
  ref as realTimeDatabaseRef,
  set,
  update,
} from "firebase/database";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytesResumable,
} from "firebase/storage";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";

const DB_APPDATA_KEY = "AppData/";
const STORAGE_USERUPLOADS_KEY = "user-review-uploads/";

function UploadReview(props) {
  // initialise initial states and set states
  const [reviewInput, setReviewInput] = useState("");
  const [fileInputFile, setfileInputFile] = useState(null);
  const [ratingInputValue, setRatingInputValue] = useState(3);
  const [user, setUser] = useState({ email: "" });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });
    return;
  }, []);

  // functions
  const writeData = (url) => {
    // set ref with relevant toilet id
    const PostRef = realTimeDatabaseRef(
      realTimeDatabase,
      DB_APPDATA_KEY + `Reviews/${props.selectedToilet}/`
    );

    const newPostRef = push(PostRef);

    // upload data to firebase at ref
    set(newPostRef, {
      date: new Date().toLocaleString(),
      email: user.email,
      review: reviewInput,
      rating: ratingInputValue,
      uploadURL: url,
    });

    update(
      realTimeDatabaseRef(
        realTimeDatabase,
        DB_APPDATA_KEY + `Ratings/${props.selectedToilet}/`
      ),
      { [newPostRef.key]: ratingInputValue }
    );

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
      STORAGE_USERUPLOADS_KEY +
        `${user.email.split(".")[0]}/` +
        fileInputFile.name
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
    <form className="Review-Container" onSubmit={handlePostSubmit}>
      {/* message input */}
      <h3>Review</h3>
      <Rating
        name="simple-controlled"
        value={ratingInputValue}
        onChange={(event, newValue) => {
          setRatingInputValue(newValue);
        }}
      />
      <input
        type="text"
        value={reviewInput}
        onChange={(e) => {
          setReviewInput(e.target.value);
        }}
        placeholder="How is this toilet?"
      />{" "}
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
        </label>
      </div>
      <div>
        {fileInputFile !== null ? (
          <img
            className="uploadPhoto"
            src={URL.createObjectURL(fileInputFile)}
            alt="User upload of toilet"
          />
        ) : null}
      </div>
      <Button type="submit" variant="contained" endIcon={<SendIcon />}>
        Post
      </Button>
    </form>
  );
}

export default UploadReview;
