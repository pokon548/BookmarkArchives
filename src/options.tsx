import React from "react";
import ReactDOM from "react-dom";
import App from "./views/Options/App";
import Browser from "webextension-polyfill";
import { options } from "./data/optionKeys";

Browser.storage.sync.get(options).then((data) => {
  ReactDOM.render(
    <React.StrictMode>
      <App {...data} />
    </React.StrictMode>,
    document.getElementById("root")
  );
});
