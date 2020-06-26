import React from "react";
import { Dropdown, Icon, Layout, Menu, Popover } from "antd";
import { dropdownMenuStyle, horizontalMenuStyle, MarginedDiv } from "../../components/utils";
import { NavbarUserIndicator } from "../NavbarUserIndicator";
import LanguageSelector from "../../../components/LanguageSelector";
import styled from "styled-components";
import { mainNavs } from "./mainNavs";
import { Inject } from "react.di";
import { RouterStore } from "../../../routing/RouterStore";
import { LocaleMessage } from "../../../internationalization/components";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import MediaQuery from "react-responsive";
import SvgImg from "../../../components/SvgImg";
import { NavStore } from "../NavStore";
import { action, observable } from "mobx";
import NotificationIndicator from "../../notification/NotificationIndicator";
import { layoutConstants } from "../../components/constants";
import HeaderIcon, { HeaderColoredIcon } from "../../components/HeaderIcon";
import HeaderItemContainer from "../../components/HeaderItemContainer";

const {Header: AntdHeader} = Layout;

interface Props {

}

export const Head = styled(AntdHeader)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: ${layoutConstants.headerHeight}px;
    //background: #405AB9;
    padding: 4px;

`;

export const ColoredLanguageSelector = styled(LanguageSelector)`
color: ${layoutConstants.headerIconColor};
`;

export function HeaderNavMenu({vertical, selectedKeys, to}:
                                { vertical: boolean, selectedKeys: string[], to(path: string): void }) {
  return <Menu theme={"dark"}
               mode={vertical ? "vertical" : "horizontal"}
               selectedKeys={selectedKeys}
               style={vertical ? dropdownMenuStyle : horizontalMenuStyle}>
    {mainNavs.map((x) =>
      <Menu.Item
        key={x.path}
        onClick={() => to(x.path)}>
        <Icon type={x.iconName}/>
        <LocaleMessage id={x.id}/>
      </Menu.Item>,
    )}
  </Menu>;
}

const LogoContainer = styled(SvgImg)`
  :hover {
    cursor: pointer;
  }
`;

@observer
export class Header extends React.Component<Props, {}> {

  @Inject routerStore: RouterStore;
  @Inject navStore: NavStore;

  @action collapse = () => {
    this.navStore.sidebarCollapsed = !this.navStore.sidebarCollapsed;
  }

  to = (path: string) => {
    this.routerStore.push(path);
  }

  toHome = () => {
    this.routerStore.push("/");
  }


  render() {

    const selectedKeys = mainNavs.filter((x) => x.match(this.routerStore.path)).map((x) => x.path);

    return <Head>
      <MarginedDiv>
        {this.navStore.hasSider
          ? <a onClick={this.collapse}>
            <HeaderIcon type={this.navStore.sidebarCollapsed ? "menu-fold" : "menu-unfold"}
            />
          </a>
          : null}
        <LogoContainer height={layoutConstants.headerHeight * 1.5}
                       width={130}
                       filePath={"landscape.svg"}
                       onClick={this.toHome}
        />
      </MarginedDiv>
      <MarginedDiv>
        <MediaQuery minWidth={layoutConstants.menuBreakpoint}>
          {(matches) => matches
            ? <>
              <HeaderNavMenu vertical={false} selectedKeys={selectedKeys} to={this.to}/>

              {/*<ColoredLanguageSelector/>*/}
              <NavbarUserIndicator/>
            </>
            : <>
              {/*<ColoredLanguageSelector/>*/}
              <NavbarUserIndicator/>

              <Dropdown overlay={<HeaderNavMenu
                vertical={true}
                selectedKeys={selectedKeys}
                to={this.to}
              />}
                trigger={["click"]}
              >
                <HeaderIcon type={"bars"}/>
              </Dropdown>
            </>
          }
        </MediaQuery>
      </MarginedDiv>
    </Head>;
  }
}
