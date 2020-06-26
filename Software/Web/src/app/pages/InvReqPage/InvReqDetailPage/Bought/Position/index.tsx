import React from "react";
import {KnownRouteConfig, RouteType} from "../../../../../routing/RouteConfig";
import routeIndexPage from "../../../../../routing/RouteIndexPage";

const routes = [
  { type: RouteType.Async, path: "", exact: true, component: import("./PositionPage") },
  { type: RouteType.Async, path: "reallocation", exact: false, component: import("./Reallocation") },
  { type: RouteType.Async, path: "dailyPosition", exact: true, component: import("./DailyPosition") },

] as KnownRouteConfig[];

export default routeIndexPage(routes);
