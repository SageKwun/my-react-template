import React from "react";
import ReactDOM from "react-dom";
import a from "../public/a.jpg";

function App() {
  return (
    <div>
      react template
      <img src={a} />
    </div>
  );
}
ReactDOM.render(<App />, document.getElementById("root"));
