import { React } from "react";
import { useParams } from "react-router-dom";
import ToiletList from "./ToiletList";

function LikedToiletList(props) {
  let { id } = useParams();

  return (
    <div>
      <ToiletList
        toiletsToDisplay={props.toiletsToDisplay}
        usersLikesData={props.usersLikesData}
        urlId={id}
        userEmail={props.userEmail}
        handleMarkerClick={props.handleMarkerClick}
      />
    </div>
  );
}

export default LikedToiletList;
