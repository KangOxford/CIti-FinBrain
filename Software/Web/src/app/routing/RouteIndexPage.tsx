import React from "react";
import { constructRoute, KnownRouteConfig, RouteType } from "./RouteConfig";
import { RouteComponentProps, Switch, withRouter } from "react-router";

export function pathJoin(...parts: string[]) {
  const separator = "/";
  const replace = new RegExp(separator + "{1,}", "g");
  const path = parts.join(separator).replace(replace, separator);
  return path.startsWith("/") ? path : "/" + path;
}

interface Props extends Partial<RouteComponentProps<any>> {
  [key: string]: any;
}

/**
 * 用在一个Page的index.tsx中，常用写法为export default routeIndexPage(routes)
 *
 * 生成一个以routes为路由的Switch组件，并可选拼接父路径和使用Layout
 * @param routes 路由信息对象数组
 * @param layout 使用的Layout，默认为null。注意Layout是在父Layout的基础上再次添加，所以请不要添加重复的Layout。
 * @param combineParentPaths 是否拼接父路径，默认为true。若自己为路径/a的子路由组件，则自己的所有子路由都自带/a前缀。
 */
export default function routeIndexPage(
  routes: KnownRouteConfig[],
  layout: React.ComponentType = null,
  combineParentPaths: boolean = true,
) {
  return (props: Props) => {
      const { match, location, history, staticContext, ...rest } = props;

      const parentPath = combineParentPaths ? match.path : "";
      const Layout = layout;

      const s = <Switch>
        {routes.map((x) => ({
          ...x,
          path: pathJoin(parentPath, x.path),
        })).map((x, key) => constructRoute(x, key, rest))}
      </Switch>;

      if (layout) {
        return <Layout>{s}</Layout>;
      } else {
        return s;
      }
  };
}
