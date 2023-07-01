import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { realTimeDatabase } from "../firebase";
import { ref as realTimeDatabaseRef, onChildAdded } from "firebase/database";
import ToiletList from "./ToiletList";

const DB_APPDATA_KEY = "AppData";

function LikedToiletList(props) {
  const [likedToiletData, setLikedToiletData] = useState({});
  let { id } = useParams();

  const LikedToiletRef = realTimeDatabaseRef(
    realTimeDatabase,
    DB_APPDATA_KEY + `/LikedToilets/${props.userEmail.split(".")[0]}/`
  );

  useEffect(() => {
    props.userEmail &&
      onChildAdded(LikedToiletRef, (data) => {
        console.log("LikedToilet added");

        setLikedToiletData((prev) => ({
          ...prev,
          [data.key]: data.val(),
        }));
      });

    return () => {};
  }, [props.userEmail]);

  return (
    <div>
      <ToiletList
        toiletsToDisplay={props.toiletsToDisplay}
        likedToiletData={likedToiletData}
        usersLikesData={props.usersLikesData}
        urlId={id}
        userEmail={props.userEmail}
        handleMarkerClick={props.handleMarkerClick}
      />
    </div>
  );
}

export default LikedToiletList;
