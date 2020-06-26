import { RouterStore } from "./RouterStore";
import createBrowserHistory from "history/createBrowserHistory";

const history = createBrowserHistory();

export default [
  {provide: RouterStore, useValue: new RouterStore(history) },
];
