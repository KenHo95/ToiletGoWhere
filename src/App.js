import "./App.css";
import { React, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

import UploadReview from "./Components/UploadReview";
import ToiletList from "./Components/ToiletList";
import ReviewList from "./Components/ReviewList";
import LikedToiletList from "./Components/LikedToiletList";

function App() {
  // initialise initial states and set states
  const [selectedToilet, setselectedToilet] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <h1>ToiletGoWhere</h1>
        {/* <LikedToiletList /> */}
        {/* <ReviewList selectedToilet={0} /> */}
        <Link to="/">Home</Link>
        {/* <Link to="/UploadReview">UploadReview</Link> */}
        <Link to="/LikedToiletList">Liked</Link>
        <Link to="/SearchToilets">Search</Link>

        <Routes>
          <Route
            path="/"
            element={<ToiletList setselectedToilet={setselectedToilet} />}
          />
          <Route path="/UploadReview" element={<UploadReview />} />
          <Route
            path="/ReviewList"
            element={<ReviewList selectedToilet={selectedToilet} />}
          />
          <Route path="/:id" element={<LikedToiletList />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
