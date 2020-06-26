import React from "react";
import ReactDOM from "react-dom";
import { configure } from "mobx";
import { App } from "./pages";

import "../assets/less/antMotion_style.less";
// enable MobX strict mode
configure({enforceActions: "observed" });

// render react DOM
ReactDOM.render(
  <App/>,
  document.getElementById("root"),
);
if (module.hot) {
  module.hot.accept();
}
