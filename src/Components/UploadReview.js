import React, { useState } from "react";
import { realTimeDatabase } from "../firebase";
import { push, ref as realTimeDatabaseRef, set } from "firebase/database";

const DB_MESSAGES_KEY = "toilets/";

function UploadReview() {
  const [messageInput, setMessageInput] = useState(null);

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
      <br />
      <h3>Review</h3>
      <input
        type="text"
        value={messageInput}
        onChange={(e) => {
          setMessageInput(e.target.value);
        }}
      />{" "}
      <br />
      <input type="submit" value="Post" />
    </form>
  );
}

export default UploadReview;
