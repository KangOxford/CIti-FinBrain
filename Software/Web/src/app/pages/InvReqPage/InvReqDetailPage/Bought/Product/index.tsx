import React from "react";
import {KnownRouteConfig, RouteType} from "../../../../../routing/RouteConfig";
import routeIndexPage from "../../../../../routing/RouteIndexPage";

const routes = [
  { type: RouteType.Async, path: "", exact: true, component: import("./ProductPage") },
  { type: RouteType.Async, path: "analysis", exact: true, component: import("./Analysis") },

] as KnownRouteConfig[];

export default routeIndexPage(routes);
