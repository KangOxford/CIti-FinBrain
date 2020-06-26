import { KnownRouteConfig, RouteType } from "../../routing/RouteConfig";
import routeIndexPage, { pathJoin } from "../../routing/RouteIndexPage";
import lang from "../../internationalization/LocaleStore/lang";
import { NavItemProps } from "../../layouts/nav/NavItemProps";
import SideNavLayout from "../../layouts/SideNavLayout";
import * as React from "react";
import { ReactNode } from "react";

function getSubRoute(pathname: string) {
  const pathItems = pathname.split("/").filter((x) => !!x);
  return pathItems.slice(1).join("/");
}

const root = lang().quotation;

const routes = [{
  path: "overview",
  textId: root.overview,
  component: import("./Overview"),
  match: (pathname) => getSubRoute(pathname).startsWith("overview"),
  iconName: "global",
  exact: true,
}, {
  path: "stock",
  textId: root.stock,
  component: import("./StockQuotation"),
  match: (pathname) => getSubRoute(pathname).startsWith("stock"),
  iconName: "line-chart",
  exact: false,
}, {
  path: "bond",
  component: import("./BondQuotation"),
  match: (pathname) => getSubRoute(pathname).startsWith("bond"),
  iconName: "bar-chart",
  textId: root.bond,
  exact: false,
},  {
  path: "goods",
  component: import("./GoodsQuotation"),
  match: (pathname) => getSubRoute(pathname).startsWith("goods"),
  iconName: "dot-chart",
  textId: root.goods,
  exact: false,
},
];

const routerRoutes = [
  { type: RouteType.Redirect, path: "", exact: true, to: "/quotation/overview" },
  ...routes.map((x) => ({ type: RouteType.Async, path: x.path, exact: x.exact, component: x.component })),
] as KnownRouteConfig[];

const layoutRoutes = routes.map((x) => ({
  path: pathJoin("quotation", x.path),
  textId: x.textId,
  iconName: x.iconName,
  match: x.match,
})) as NavItemProps[];

// const routes = [
//   { type: RouteType.Async, path: "", exact: true, component: import("./StockMarketQuotationPage")},
//   { type: RouteType.Async, path: "stock", component: import("./StockDetailQuotation") },
//   // { type: RouteType.Async, path: "bond", component: import("./InvReqDetailPage") },
//   // { type: RouteType.Async, path: "product", component: import("./InvReqDetailPage") },

// ] as KnownRouteConfig[];

export default routeIndexPage(
  routerRoutes,
  (props: {children: ReactNode}) => <SideNavLayout routes={layoutRoutes}>{props.children}</SideNavLayout>,
);
