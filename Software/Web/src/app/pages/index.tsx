import { Inject, Module } from "react.di";
import React from "react";
import providers from "../providers";
import { Router } from "react-router";
import DevTools from "mobx-react-devtools";
import { LocaleStore } from "../internationalization";
import { RouterStore } from "../routing/RouterStore";
import { KnownRouteConfig, RouteType } from "../routing/RouteConfig";
import routeIndexPage from "../routing/RouteIndexPage";
import { MainLayout } from "../layouts/MainLayout";
import styled from "styled-components";
import { BackTop } from "antd";

function renderDevTool() {
  if (process.env.NODE_ENV !== "production") {
    return (<DevTools/>);
  } else {
    return null;
  }
}

interface State {
  loaded: boolean;
}

const routes = [
  { type: RouteType.Async, path: "/", exact: true, component: import("./HomePage")},
  { type: RouteType.Async, path: "register", exact: false, component: import("./RegisterPage")},
  { type: RouteType.Async, component: import("./FunctionSwitch") },

] as KnownRouteConfig[];

const OverrideCardContainer = styled.div`
  .ant-card {
    margin: 4px !important;
  }
`;

@Module({
  providers,
})
export class App extends React.Component<{}, State> {

  @Inject localeStore: LocaleStore;
  @Inject routerStore: RouterStore;

  state = {
    loaded: false,
  };

  async componentDidMount() {

    const currentLanguage = typeof window !== "undefined" && window.navigator.language;

    // initialize global states here
    await this.localeStore.init(currentLanguage);
    this.setState({
      loaded: true,
    });
  }

  render() {
    if (!this.state.loaded) {
      return null;
    }

    const RouteIndexPage = routeIndexPage(routes, MainLayout, false) as any;

    return <Router history={this.routerStore.history}>
      <OverrideCardContainer>
        <BackTop/>
      <RouteIndexPage/>
      </OverrideCardContainer>
      </Router>;
  }
}
