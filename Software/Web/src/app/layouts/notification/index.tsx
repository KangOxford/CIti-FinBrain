import React from "react";
import { Button, Divider, Drawer, Spin } from "antd";
import { LocaleMessage, lang } from "../../internationalization";
import NotificationItem from "./NotificationItem";
import { Inject } from "react.di";
import { NotificationStore } from "../../stores/NotificationStore";
import { observer } from "mobx-react";
import QueueAnim from "rc-queue-anim";
import { UserStore } from "../../stores/UserStore";

interface Props {

}

const root = lang().notification;

const DRAWER_WIDTH = 300;

@observer
export default class NotificationPanel extends React.Component<Props, {}> {

  @Inject notificationStore: NotificationStore;
  @Inject userStore: UserStore;

  refresh = () => {
    this.notificationStore.refresh();
  }

  onClose = () => {
    this.notificationStore.toggleNotificationDrawerShown();
  }

  onRemove = (id: string) => {
    this.notificationStore.removeNotification(id);
  }

  render() {

    const { refreshing, notifications, notificationDrawerShown, count } = this.notificationStore;

    return <Drawer
      title={<LocaleMessage id={root.panelTitle}/>}
      placement={"right"}
      closable={true}
      onClose={this.onClose}
      visible={notificationDrawerShown}
      width={DRAWER_WIDTH}
    >
      {this.userStore.loggedIn
        ? <>
          <Button style={{width: "100%"}} type={"primary"} onClick={this.refresh}>
            <LocaleMessage id={root.refresh}/>
          </Button>
          <Divider/>
          <div>
            <QueueAnim component="ul" type={["right", "left"]} leaveReverse={true}>
              {refreshing ? <Spin/> : null}
              {
                count === 0
                  ? <h3 style={{textAlign: "center"}}><LocaleMessage id={root.none}/></h3>
                  : notifications.map((x) => <NotificationItem item={x} key={x.id} onRemove={this.onRemove}/>)
              }
            </QueueAnim>
          </div>
        </>
        : <h3 style={{textAlign: "center"}}><LocaleMessage id={lang().common.login.needLogin}/></h3>
      }
    </Drawer>;
  }
}
