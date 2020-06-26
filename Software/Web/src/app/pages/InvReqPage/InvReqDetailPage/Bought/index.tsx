import React from "react";
import { KnownRouteConfig, RouteType } from "../../../../routing/RouteConfig";
import { RouteComponentProps, withRouter } from "react-router";
import { InvReq } from "../../../../models/invreq/InvReq";
import routeIndexPage, { pathJoin } from "../../../../routing/RouteIndexPage";
import SideNavLayout from "../../../../layouts/SideNavLayout";
import { NavItemProps } from "../../../../layouts/nav/NavItemProps";
import lang from "../../../../internationalization/LocaleStore/lang";
import { arrayContainsElement } from "../../../../../utils/Array";
// 已买入InvReq的信息界面
// 这应该是一个父路由，所以应该用来做转发

// 由于还需要设置侧边栏导航的参数，所以这里写的对象不一样：同时包含路由和侧边栏所需要的参数

function getSubRoute(pathname: string) {
  const splitted = pathname.split("/").filter((x) => !!x);
  return splitted.slice(2).join("/");
}

const root = lang().invreq.detail.bought;

const routes = [{
  path: "",
  component: import("./Overview"),
  match: (pathname) => !getSubRoute(pathname),
  iconName: "area-chart",
  exact: true,
}, {
  path: "stock",
  textId: root.stock._root,
  component: import("./Stock"),
  match: (pathname) => getSubRoute(pathname).startsWith("stock"),
  iconName: "line-chart",
  exact: false,
  children: [
    {
      path: "stock/",
      match: (pathname) => getSubRoute(pathname) === "stock",
      iconName: "line-chart",
      textId: root.stock._root,
    }, {
      path: "stock/perform",
      match: (pathname) => getSubRoute(pathname).startsWith("stock/perform"),
      iconName: "line-chart",
      textId: root.stock.perform,
    }, {
      path: "stock/attribute",
      match: (pathname) => getSubRoute(pathname).startsWith("stock/attribute"),
      iconName: "eye",
      textId: root.stock.attribute,
    }, {
      path: "stock/scenario",
      match: (pathname) => getSubRoute(pathname).startsWith("stock/scenario"),
      iconName: "radar-chart",
      textId: root.stock.scenario,
    },
  ],
}, {
  path: "bond",
  component: import("./Bond"),
  match: (pathname) => getSubRoute(pathname).startsWith("bond"),
  iconName: "bar-chart",
  textId: root.bond._root,
  exact: false,
  children: [
    {
      path: "bond/",
      match: (pathname) => getSubRoute(pathname) === "bond",
      iconName: "bar-chart",
      textId: root.bond._root,
    }, {
      path: "bond/credit",
      match: (pathname) => getSubRoute(pathname).startsWith("bond/credit"),
      iconName: "bar-chart",
      textId: root.bond.credit,
    },
    {
      path: "bond/rate",
      match: (pathname) => getSubRoute(pathname).startsWith("bond/rate"),
      iconName: "bar-chart",
      textId: root.bond.rate,
    },
  ],
},  {
  path: "goods",
  component: import("./Product"),
  match: (pathname) => getSubRoute(pathname).startsWith("goods"),
  iconName: "dot-chart",
  textId: root.product._root,
  exact: false,
  children: [
    {
      path: "goods/",
      match: (pathname) => getSubRoute(pathname) === "goods",
      iconName: "dot-chart",
      textId: root.product._root,
    }, {
      path: "goods/analysis",
      match: (pathname) => getSubRoute(pathname).startsWith("goods/analysis"),
      iconName: "dot-chart",
      textId: root.product.analysis,
    },
  ],
}, {
  path: "transactions",
  component: import("./Transaction"),
  match: (pathname) => getSubRoute(pathname).startsWith("transactions"),
  iconName: "bars",
  exact: false,
}, {
  path: "position",
  component: import("./Position"),
  match: (pathname) => getSubRoute(pathname).startsWith("position"),
  textId: root.position._root,
  iconName: "profile",
  exact: false,
  children: [
     {
      path: "position/dailyPosition",
      match: (pathname) => getSubRoute(pathname).startsWith("position/dailyPosition"),
      iconName: "clock-circle",
      textId: root.position.dailyPosition,
    },
    {
      path: "position/reallocation",
      match: (pathname) => getSubRoute(pathname).startsWith("position/reallocation"),
      iconName: "profile",
      textId: root.position.reallocation,
      exact: false,
    },
  ],
}, {
  path: "setting",
  component: import("./Setting"),
  match: (pathname) => getSubRoute(pathname) === "setting",
  iconName: "setting",
  exact: true,
}];

interface Props extends Partial<RouteComponentProps<any>> {
  invreq: InvReq;
}

const routerRoutes = routes.map((x) => ({
  type: RouteType.Async,
  path: x.path,
  exact: x.exact,
  component: x.component,
})) as KnownRouteConfig[];

const RouteComponent = routeIndexPage(routerRoutes);

const ignoredWithRouter = withRouter as any;

// 写成一个组件是因为需要传递props，并且需要将侧边栏导航初始化
const InvReqDetailPage = (props: Props) => {

    const { invreq } = props;

    const layoutRoutes = routes.map((x) => ({
      path: pathJoin("invreq", invreq.invreqId, x.path),
      textId: x.textId || root[x.path],
      iconName: x.iconName,
      match: x.match,
      children: arrayContainsElement(x.children)
      ? x.children.map((child) => ({...child, path: pathJoin("invreq", invreq.invreqId, child.path)}))
      : null,
    })) as NavItemProps[];

    // const Component = routeIndexPage(routerRoutes, () => , true);
    return <SideNavLayout routes={layoutRoutes}>
      <RouteComponent {...props} />
    </SideNavLayout>;

};

export default ignoredWithRouter(InvReqDetailPage);
