import React, { useState } from "react";
import { realTimeDatabase } from "../firebase";
import { push, ref as realTimeDatabaseRef, set } from "firebase/database";
import Rating from "@mui/material/Rating";

const DB_MESSAGES_KEY = "toilets/";

function UploadReview() {
  const [messageInput, setMessageInput] = useState(null);
  const [fileInputFile, setfileInputFile] = useState(null);
  const [fileInputValue, setfileInputValue] = useState("");
  const [ratingInputValue, setRatingInputValue] = useState("");

  const writeData = (url) => {
    const PostRef = realTimeDatabaseRef(realTimeDatabase, DB_MESSAGES_KEY);
    const newPostRef = push(PostRef);

    set(newPostRef, {
      message: messageInput,
    });

    setMessageInput("");
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();

    writeData();
  };

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
        value={messageInput}
        onChange={(e) => {
          setMessageInput(e.target.value);
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
            value={fileInputValue}
            onChange={(e) => {
              setfileInputFile(e.target.files[0]);
              setfileInputValue(e.target.file);
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
            alt="User snapshot of toilet"
          />
        ) : null}
      </div>
      <br />
      <input type="submit" value="Post" />
    </form>
  );
}

export default UploadReview;
