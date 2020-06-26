import React from "react";
import { Inject } from "react.di";
import { UiStore } from "../../stores/UiStore";
import { Badge, Icon } from "antd";
import HeaderIcon from "../components/HeaderIcon";
import { NotificationStore } from "../../stores/NotificationStore";
import { observer } from "mobx-react";
import styled from "styled-components";
import { layoutConstants } from "../components/constants";
import HeaderItemContainer from "../components/HeaderItemContainer";

interface Props {
}

const StyledIcon = styled(Icon)`
  color: ${layoutConstants.headerIconColor};
`;

@observer
export default class NotificationIndicator extends React.Component<Props, {}> {

  @Inject uiStore: UiStore;
  @Inject notificationStore: NotificationStore;

  render() {
    const {toggleNotificationDrawerShown, count} = this.notificationStore;
    return <HeaderItemContainer onClick={toggleNotificationDrawerShown}>
      <Badge count={count} dot={true}>
        <StyledIcon type="notification"/>
      </Badge>
    </HeaderItemContainer>;
  }
}
