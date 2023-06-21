import "./App.css";
import { React, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

import UploadReview from "./Components/UploadReview";
import ToiletList from "./Components/ToiletList";
import ReviewList from "./Components/ReviewList";

function App() {
  // initialise initial states and set states
  const [selectedToilet, setselectedToilet] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <h1>ToiletGoWhere</h1>
        <ReviewList selectedToilet={0} />
        {/* <Link to="/">Home</Link>
        <Link to="/UploadReview">UploadReview</Link>
        <Link to="/ReviewList">ReviewList</Link>

        <Routes>
          <Route
            path="/"
            element={<ToiletList setselectedToilet={setselectedToilet} />}
          />
          <Route
            path="/UploadReview"
            element={<UploadReview selectedToilet={selectedToilet} />}
          />
          <Route
            path="/ReviewList"
            element={<ReviewList selectedToilet={selectedToilet} />}
          />
        </Routes> */}
      </header>
    </div>
  );
}

export default App;
