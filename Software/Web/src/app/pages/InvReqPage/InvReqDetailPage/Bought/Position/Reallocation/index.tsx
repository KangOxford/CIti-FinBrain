import React from "react";
import {KnownRouteConfig, RouteType} from "../../../../../../routing/RouteConfig";
import routeIndexPage from "../../../../../../routing/RouteIndexPage";
import { InvReq } from "../../../../../../models/invreq/InvReq";
import todo from "../../../../../../../utils/todo";

const routes = [
  { type: RouteType.Async, path: "", exact: true, component: import("./ReallocationPage") },
  { type: RouteType.Async, path: ":reallocationId", exact: true, component: import("./ReallocationDetail") },
  { type: RouteType.Async, path: ":reallocationId/:type", exact: true, component: import("./TranLog") },

] as KnownRouteConfig[];

export default routeIndexPage(routes);
// export default (props) => { return JSON.stringify(props); };
