import React from "react";
import ReactDOM from "react-dom";
import a from "../public/a.jpg";
import "./index.css";
import "./index.less";
import { value } from "./value.ts";

function App() {
  console.log(value);

  return (
    <div id='circle' className='redRect'>
      react template
      <img src={a} />
    </div>
  );
}
ReactDOM.render(<App />, document.getElementById("root"));
