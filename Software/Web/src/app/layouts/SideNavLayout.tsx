import React from "react";
import { NavItemProps } from "./nav/NavItemProps";
import { Inject } from "react.di";
import { NavStore } from "./nav/NavStore";
import { action } from "mobx";
import { Icon, Menu, Layout } from "antd";
import { LocaleMessage } from "../internationalization/components";
import { Link } from "react-router-dom";
import { RouterStore } from "../routing/RouterStore";

const {Sider} = Layout;

interface Props {
  routes: NavItemProps[];
}

export default class SideNavLayout extends React.Component<Props, {}> {

  @Inject navStore: NavStore;
  @Inject routerStore: RouterStore;

  @action componentDidMount() {
    this.navStore.sidenavs = this.props.routes;
  }

  @action componentWillUnmount() {
    this.navStore.sidenavs = null;
  }

  render() {
    return this.props.children;
  }
}
