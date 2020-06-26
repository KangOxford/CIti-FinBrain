import { KnownRouteConfig, RouteType } from "../../../routing/RouteConfig";
import routeIndexPage from "../../../routing/RouteIndexPage";

const routes = [
  { type: RouteType.Async, path: "", exact: true, component: import("./StockMarketQuotationPage")},
  { type: RouteType.Async, path: ":quotaId", component: import("./StockDetailQuotaPage") },

] as KnownRouteConfig[];

export default routeIndexPage(routes);
