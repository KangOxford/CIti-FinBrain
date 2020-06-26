import { UserStore } from "../../../stores/UserStore";
import React from "react";
import { Dropdown, Avatar, Icon, Menu } from "antd";
import { observer } from "mobx-react";
import { LocaleMessage } from "../../../internationalization/components/index";
import { Link } from "react-router-dom";
import { Inject } from "react.di";
import lang from "../../../internationalization/LocaleStore/lang";
import MediaQuery from "react-responsive";
import { layoutConstants } from "../../components/constants";
import NotificationIndicator from "../../notification/NotificationIndicator";
interface Props {

}

const DEFAULT_AVATAR = "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1540823688873&di=18f09cc1a41075294d1c12e67d178594&imgtype=0&src=http%3A%2F%2Fku.90sjimg.com%2Felement_origin_min_pic%2F16%2F06%2F05%2F155753d94b715a2.jpg";

const root = lang().nav;

@observer
export class UserIndicator extends React.Component<Props, {}> {

  @Inject userStore: UserStore;

  logout = () => {
    this.userStore.logout();
  }

  render() {
    const dropdownMenu = <Menu>
      <Menu.Item key="self">
        <Link to={"/user"}><LocaleMessage id={root.selfCenter}/></Link>
      </Menu.Item>
      <Menu.Divider/>
      <Menu.Item key="logout">
        <a onClick={this.logout}><LocaleMessage id={root.logout}/></a>
      </Menu.Item>
    </Menu>;

    return <><Dropdown overlay={dropdownMenu} trigger={["click"]}>
      <a className="ant-dropdown-link">
        <Avatar size="default" src={this.userStore.user.avatarUrl || DEFAULT_AVATAR}/>
        <MediaQuery minWidth={layoutConstants.menuBreakpoint}>
          <span style={{marginLeft: "8px"}}>
          <LocaleMessage id={root.welcome} replacements={{username: this.userStore.user.username}}/>
          <Icon type="down"/>
        </span>
        </MediaQuery>
      </a>
    </Dropdown>
      <NotificationIndicator />
    </>;
  }
}
