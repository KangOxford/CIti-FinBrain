import React from "react";
import { Inject } from "react.di";
import { NavStore } from "../NavStore";
import { Icon, Layout, Menu } from "antd";
import { LocaleMessage } from "../../../internationalization/components";
import { observer } from "mobx-react";
import { RouterStore } from "../../../routing/RouterStore";
import { Link as RouterLink } from "react-router-dom";
import { action, computed, runInAction } from "mobx";
import { NavItemProps } from "../NavItemProps";
import { arrayContainsElement, flatten } from "../../../../utils/Array";
import styled from "styled-components";
import { antdBreakpoints, layoutConstants } from "../../components/constants";
import BodyMask from "./BodyMask";

const {Sider} = Layout;
const {SubMenu} = Menu;

const breakpoint = "lg";

interface Props {

}

const StyledSider = styled(Sider)`

@media (max-width: ${antdBreakpoints[breakpoint]}px ) {
  position:absolute;
  height: 100%;
  z-index:5;
  
body, html { 
    overflow-x: hidden; 
    overflow-y: auto;
}
  
}

`;

@observer
export default class SideNav extends React.Component<Props, {}> {

  @Inject navStore: NavStore;
  @Inject routerStore: RouterStore;

  @action onBreakpoint = (broken: boolean) => {
    if (broken) {
      // big to small. collapse the sidebar
      this.navStore.sidebarCollapsed = true;
    } else {
      // small to big. expand the sidebar
      this.navStore.sidebarCollapsed = false;
    }
    // console.log(broken);
  }

  onClick = (path: string) => (e) => {
    e.preventDefault();
    this.routerStore.jumpTo(path);
    if (window.innerWidth <= antdBreakpoints[breakpoint]) {
      runInAction(() => {
        this.navStore.sidebarCollapsed = true;
      });
    }
  };

  Link = (props: { path: string, icon: string, textId: string }) => {
    const {path, icon, textId} = props;
    return <a href={path} title={path} onClick={this.onClick(path)}>
      <Icon type={icon}/>
      <LocaleMessage id={textId}/>
    </a>;
  };

  @computed get selectedKeys() {
    // root selected keys
    if (!this.navStore.hasSider) {
      return [];
    }
    const path = this.routerStore.path;
    const rootSelected: NavItemProps[] = this.navStore.sidenavs.filter((x) => x.match(path));

    // children selected keys
    const childrenSelected: NavItemProps[] = flatten(rootSelected.map((x) => {
      if (arrayContainsElement(x.children)) {
        return x.children.filter((child) => child.match(path));
      } else {
        return null;
      }
    }).filter((x) => !!x));

    return flatten([rootSelected, childrenSelected]).map((x) => x.path);
  }

  render() {
    const {Link} = this;
    if (!this.navStore.hasSider) {
      return null;
    }
    return <>
      <BodyMask sidebarShown={!this.navStore.sidebarCollapsed} breakpoint={antdBreakpoints[breakpoint]}/>
      <StyledSider
      onBreakpoint={this.onBreakpoint}
      collapsed={this.navStore.sidebarCollapsed}
      collapsedWidth={0}
      breakpoint={breakpoint}
      trigger={null}>
      <Menu
        mode="inline"
        selectedKeys={this.selectedKeys}
        // theme={'dark'}
        style={{height: "100%", borderRight: 0}}
      >
        {this.navStore.sidenavs
          .map((x) => {
              const subs: NavItemProps[] = x.children;
              if (!arrayContainsElement(subs)) {
                return <Menu.Item key={x.path}>
                  <Link path={x.path} textId={x.textId} icon={x.iconName}/>
                </Menu.Item>;
              } else {
                return (
                  <SubMenu key={x.path} title={
                    <span>
                      <Icon type={x.iconName}/>
                      <span><LocaleMessage id={x.textId}/></span>
                    </span>}
                  >
                    {subs.map((sub) =>
                      <Menu.Item key={sub.path}>
                        <Link path={sub.path} textId={sub.textId} icon={sub.iconName}/>
                      </Menu.Item>,
                    )}
                  </SubMenu>
                );
              }

            },
          )}
      </Menu>
    </StyledSider>
      </>;
  }
}
