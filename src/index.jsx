import React from "react";
import ReactDOM from "react-dom";
import a from "../public/a.jpg";
import "./index.css";

function App() {
  return (
    <div class='redRect'>
      react template
      <img src={a} />
    </div>
  );
}
ReactDOM.render(<App />, document.getElementById("root"));
