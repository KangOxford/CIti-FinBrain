import { KnownRouteConfig, RouteType } from "../routing/RouteConfig";
import routeIndexPage from "../routing/RouteIndexPage";
import { FunctionLayout } from "../layouts/FunctionLayout";

const routes = [
  { type: RouteType.Async, path: "user", component: import("./UserPage") },
  { type: RouteType.Async, path: "help", component: import("./HelpPage")},
  { type: RouteType.Async, path: "invreq", component: import("./InvReqPage") },
  { type: RouteType.Async, path: "quotation", component: import("./QuotationPage")},
] as KnownRouteConfig[];

export default routeIndexPage(routes, FunctionLayout);
