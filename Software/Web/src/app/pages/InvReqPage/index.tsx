import { KnownRouteConfig, RouteType } from "../../routing/RouteConfig";
import routeIndexPage from "../../routing/RouteIndexPage";
import { requireLogin } from "../hoc/RequireLogin";
import React from "react";

const routes = [
  { type: RouteType.Async, path: "", exact: true, component: import("./InvReqListPage") },
  // { type: RouteType.Async, path: "init", component: import("./InitModal/index") },
  { type: RouteType.Async, path: ":invreqId", component: import("./InvReqDetailPage") },

] as KnownRouteConfig[];

export default requireLogin()(routeIndexPage(routes));
