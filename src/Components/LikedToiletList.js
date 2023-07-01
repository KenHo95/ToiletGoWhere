import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { realTimeDatabase } from "../firebase";
import { ref as realTimeDatabaseRef, onChildAdded } from "firebase/database";
import ToiletList from "./ToiletList";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const DB_APPDATA_KEY = "AppData";

function LikedToiletList(props) {
  const [likedToiletData, setLikedToiletData] = useState({});
  let { id } = useParams();
  const navigate = useNavigate();

  const LikedToiletRef = realTimeDatabaseRef(
    realTimeDatabase,
    DB_APPDATA_KEY + `/LikedToilets/${props.userEmail.split(".")[0]}/`
  );

  useEffect(() => {
    onChildAdded(LikedToiletRef, (data) => {
      console.log("LikedToilet added");

      setLikedToiletData((prev) => ({
        ...prev,
        [data.key]: data.val(),
      }));
    });

    return () => {};
  }, []);

  return (
    <div>
      <Button onClick={() => navigate("/")}> back </Button>
      <ToiletList
        toiletsToDisplay={props.toiletsToDisplay}
        likedToiletData={likedToiletData}
        usersLikesData={props.usersLikesData}
        urlId={id}
        userEmail={props.userEmail}
      />
    </div>
  );
}

export default LikedToiletList;
