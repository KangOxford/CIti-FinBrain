import React from "react";
import { KnownNotification, NotificationType } from "../../models/notification/Notification";
import { LocaleMessage } from "../../internationalization/components";
import lang from "../../internationalization/LocaleStore/lang";
import { Link } from "react-router-dom";
import BaseNotificaton from "./BaseNotificationItem";
import { Inject } from "react.di";
import { NotificationStore } from "../../stores/NotificationStore";
import { RouterStore } from "../../routing/RouterStore";

interface Props {
  item: KnownNotification;
  onRemove(id: string): void;
}

const root = lang().notification;

export default class NotificationItem extends React.Component<Props> {

  @Inject notificationStore: NotificationStore;
  @Inject routerStore: RouterStore;

  onLinkClick = (link: string) => () => {
    this.routerStore.jumpTo(link);
    this.notificationStore.toggleNotificationDrawerShown();
  }

  render() {
    const {item, onRemove} = this.props;
    switch (item.type) {
      case NotificationType.PREFERENCE_EVALUATION:
        return <BaseNotificaton titleId={root.preferenceEvaluation.title}
                                dateTime={item.dateTime}
                                onRemove={() => onRemove(item.id)}
                                link={<a onClick={this.onLinkClick("/user/investmentPreference")}>
                                  <LocaleMessage id={root.preferenceEvaluation.readMore}/>
                                </a>}
        >
          <p><LocaleMessage id={root.preferenceEvaluation.content}/></p>
        </BaseNotificaton>;
      case NotificationType.OTHERS:
        return <BaseNotificaton
          titleId={root.others.title}
          dateTime={item.dateTime}
          onRemove={() => onRemove(item.id)}
        >
          <p>{item.content}</p>
        </BaseNotificaton>;
    }
  }

}
