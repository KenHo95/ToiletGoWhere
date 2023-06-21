import "./App.css";
import React from "react";
import UploadReview from "./Components/UploadReview";
// import ToiletList from "./Components/ToiletList";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>ToiletGoWhere</h1>
        <UploadReview />
        {/* <ToiletList /> */}
      </header>
    </div>
  );
}

export default App;
