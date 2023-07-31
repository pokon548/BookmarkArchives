import React from "react";
import ReactDOM from "react-dom";
import App from "./views/Options/App";
import Browser from "webextension-polyfill";

Browser.storage.sync.get(null).then((data) => {
  ReactDOM.render(
    <React.StrictMode>
      <App {...data} />
    </React.StrictMode>,
    document.getElementById("root")
  );
});
