import React from "react";
import {KnownRouteConfig, RouteType} from "../../../../../routing/RouteConfig";
import routeIndexPage from "../../../../../routing/RouteIndexPage";

const routes = [
  { type: RouteType.Async, path: "", exact: true, component: import("./BondPage") },
  { type: RouteType.Async, path: "credit", exact: true, component: import("./CreditBond") },
  { type: RouteType.Async, path: "rate", exact: true, component: import("./RateBond") },

] as KnownRouteConfig[];

export default routeIndexPage(routes);
