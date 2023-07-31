import React from "react";
import ReactDOM from "react-dom";
import App from "./views/Popup/App";
import Browser from "webextension-polyfill";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
