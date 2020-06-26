import React from "react";
import {KnownRouteConfig, RouteType} from "../../../../../routing/RouteConfig";
import routeIndexPage from "../../../../../routing/RouteIndexPage";

const routes = [
  { type: RouteType.Async, path: "", exact: true, component: import("./StockPage") },
  { type: RouteType.Async, path: "perform", exact: true, component: import("./PerformAnalysis") },
  { type: RouteType.Async, path: "attribute", exact: true, component: import("./AttributeAnalysis") },
  { type: RouteType.Async, path: "scenario", exact: true, component: import("./ScenarioAnalysis") },

] as KnownRouteConfig[];

export default routeIndexPage(routes);
