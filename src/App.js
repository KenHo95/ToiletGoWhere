import "./App.css";
import { React, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";

import UploadReview from "./Components/UploadReview";
import ToiletList from "./Components/ToiletList";

function App() {
  // initialise initial states and set states
  const [selectedToilet, setselectedToilet] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <h1>ToiletGoWhere</h1>

        <Link to="/">Home</Link>
        <Link to="/UploadReview">UploadReview</Link>

        <Routes>
          <Route
            path="/"
            element={<ToiletList setselectedToilet={setselectedToilet} />}
          />
          <Route
            path="/UploadReview"
            element={<UploadReview selectedToilet={selectedToilet} />}
          />
          {/* <Route path="*" element={<NoPage />} /> */}
        </Routes>
      </header>
    </div>
  );
}

export default App;
