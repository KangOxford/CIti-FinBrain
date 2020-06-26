import { Redirect, Route } from "react-router";
import React from "react";
import { AsyncRoute } from "./AsyncRoute";

export enum RouteType {
  Normal,
  Async,
  Redirect,
}

export interface RouteConfig {
  path: string;
  exact: boolean;
  type: RouteType;
}

export interface NormalRouteConfig extends RouteConfig {
  type: RouteType.Normal;
  component: any;
}

export interface AsyncRouteConfig extends RouteConfig {
  type: RouteType.Async;
  component: Promise<any>;
}

export interface RedirectRouteConfig extends RouteConfig {
  type: RouteType.Redirect;
  to: string;
}

export type KnownRouteConfig = AsyncRouteConfig | RedirectRouteConfig | NormalRouteConfig;

export function constructRoute(config: KnownRouteConfig, key: number | string, props?: any) {

  switch (config.type) {
    case RouteType.Async:
      return <AsyncRoute exact={config.exact}
                         key={key}
                         path={config.path}
                         component={config.component}
                         props={props}
      />;
    case RouteType.Redirect:
      return <Redirect exact={config.exact}
                       key={key}
                       from={config.path}
                       path={config.path}
                       to={config.to}/>;
    case RouteType.Normal:
      return <Route exact={config.exact}
                    key={key}
                    path={config.path}
                    component={config.component}
                    />;
  }
}
