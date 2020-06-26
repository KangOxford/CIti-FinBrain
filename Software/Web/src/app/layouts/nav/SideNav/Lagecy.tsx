import React from "react";
import { Icon, Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import { Inject } from "react.di";
import { RouterStore } from "../../../routing/RouterStore";
import { navRoutes, NOT_LOGIN_FLAG, submenuMap } from "./SubMenus";
import { LocaleMessage } from "../../../internationalization/components";
import { UserStore } from "../../../stores/UserStore";
import { computed } from "mobx";
import styled from "styled-components";
import { arrayContainsElement, flatten } from "../../../../utils/Array";
import { NavItemProps } from "../NavItemProps";

const {SubMenu} = Menu;
const {Sider} = Layout;

// import pages will result in circular dependency and I can't figure out why
// hard-code is the only option :(

interface MySiderProps {
  shown: boolean;
}

const MySider = styled(Sider) `
    position: absolute;
    z-index: 5;
    height: 100%;

    @media (min-width: 700px) {
      position: relative;
      height: initial;
    }

    .ant-layout-sider-trigger {
      bottom: initial !important;
    }
`;

interface Props {
  collapsed: boolean;
  onBreakpoint(broken: boolean): void;
}

@observer
export class SideNav extends React.Component<Props, {}> {

  @Inject routerStore: RouterStore;
  @Inject userStore: UserStore;

  @computed get currentSubMenuMap() {
    return submenuMap[this.userStore.loggedIn ? this.userStore.user.role : NOT_LOGIN_FLAG];
  }

  get selectedRoute() {
    const selected = Object.keys(navRoutes)
      .map((x) => navRoutes[x])
      .filter((x) => x.match(this.routerStore.path))
      .map((x) => x.path);

    const selectedSubMenus = Object.keys(this.currentSubMenuMap).map((x) => this.currentSubMenuMap[x])
      .map((x) => x.filter((y) => y.match(this.routerStore.path)).map((z) => z.path));

    return [...selected, ...flatten(selectedSubMenus)];
  }

  jumpTo = (path: string) => {
    this.routerStore.jumpTo(path);
  }

  render() {
    return <Sider
      collapsed={this.props.collapsed}
      onBreakpoint={this.props.onBreakpoint}
      collapsedWidth={0}
      breakpoint={"lg"}
      trigger={null}
    >
      <Menu
        theme="dark"
        mode={"inline"}
        selectedKeys={this.selectedRoute}
      >
        {Object.keys(navRoutes)
          .map((x) => {
              const root = navRoutes[x];
              const subs: NavItemProps[] = this.currentSubMenuMap[x];
              if (!arrayContainsElement(subs)) {
                return <Menu.Item key={root.path}>
                  <Icon type={root.iconName}/>
                  <span onClick={() => this.jumpTo(root.path)}>
            <LocaleMessage id={root.textId}/>
          </span>
                </Menu.Item>;
              } else {
                return (
                  <SubMenu key={root.path} title={
                    <span>
                      <Icon type={root.iconName}/>
                      <span><LocaleMessage id={root.textId}/></span>
                    </span>
                  }>
                  {subs.map((sub) =>
                    <Menu.Item key={sub.path}>
                      <Icon type={sub.iconName}/>
                      <span onClick={() => this.jumpTo(sub.path)}>
                      <LocaleMessage id={sub.textId}/>
                      </span>
                    </Menu.Item>,
                  )}
                </SubMenu>
                );
              }

            },
          )}
      </Menu>
    </Sider>;
  }
}
