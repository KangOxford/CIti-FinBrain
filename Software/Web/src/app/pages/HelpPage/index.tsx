import { KnownRouteConfig, RouteType } from "../../routing/RouteConfig";
import routeIndexPage, { pathJoin } from "../../routing/RouteIndexPage";
import lang from "../../internationalization/LocaleStore/lang";
import { NavItemProps } from "../../layouts/nav/NavItemProps";
import { ReactNode } from "react";
import SideNavLayout from "../../layouts/SideNavLayout";
import React from "react";

function getSubRoute(pathname: string) {
  const pathItems = pathname.split("/").filter((x) => !!x);
  return pathItems.slice(1).join("/");
}

const root = lang().help;

const routes = [{
  path: "tos",
  textId: root.tos,
  component: import("./TermOfServicePage"),
  match: (pathname) => getSubRoute(pathname).startsWith("tos"),
  iconName: "global",
  exact: true,
}, {
  path: "privacyPolicy",
  textId: root.privacyPolicy,
  component: import("./PrivacyPolicyPage"),
  match: (pathname) => getSubRoute(pathname).startsWith("privacyPolicy"),
  iconName: "lock",
  exact: true,
},
];

const routerRoutes = [
  { type: RouteType.Redirect, path: "", exact: true, to: "/help/tos" },
  ...routes.map((x) => ({ type: RouteType.Async, path: x.path, exact: x.exact, component: x.component })),
] as KnownRouteConfig[];

const layoutRoutes = routes.map((x) => ({
  path: pathJoin("help", x.path),
  textId: x.textId,
  iconName: x.iconName,
  match: x.match,
})) as NavItemProps[];

export default routeIndexPage(
  routerRoutes,
  (props: { children: ReactNode }) => <SideNavLayout routes={layoutRoutes}>{props.children}</SideNavLayout>,
);
