import React from "react";
import lang from "../../internationalization/LocaleStore/lang";
import { KnownRouteConfig, RouteType } from "../../routing/RouteConfig";
import routeIndexPage, { pathJoin } from "../../routing/RouteIndexPage";
import SideNavLayout from "../../layouts/SideNavLayout";
import { NavItemProps } from "../../layouts/nav/NavItemProps";

function getSubRoute(pathname: string) {
  const splitted = pathname.split("/").filter((x) => !!x);
  return splitted.slice(1).join("/");
}

const root = lang().userCenter;

const routes = [
  {
    path: "",
    component: import("./ProfileDisplay"),
    match: (pathname) => !getSubRoute(pathname),
    iconName: "user",
    textId: root.profile.title,
    exact: true,
  }, {
    path: "investmentPreference",
    component: import("./InvestmentPreference"),
    textId: root.investmentPreference.title,
    match: (pathname) => getSubRoute(pathname).startsWith("investmentPreference"),
    iconName: "radar-chart",
  },
];

const routerRoutes = routes.map((x) => ({
  type: RouteType.Async,
  path: x.path,
  exact: x.exact,
  component: x.component,
})) as KnownRouteConfig[];

const layoutRoutes = routes.map((x) => ({
  path: pathJoin("user", x.path),
  textId: x.textId || root[x.path],
  iconName: x.iconName,
  match: x.match,
})) as NavItemProps[];

const RouteComponent = routeIndexPage(routerRoutes);

export default function(props: {}) {
  return <SideNavLayout routes={layoutRoutes}>
    <RouteComponent {...props}/>
  </SideNavLayout>;
}
