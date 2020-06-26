import React from "react";
import { observer } from "mobx-react";
import { UserStore } from "../../../stores/UserStore";
import { LoginButton } from "./LoginButton";
import { UserIndicator } from "./UserIndicator";
import { Inject } from "react.di";

@observer
export class NavbarUserIndicator extends React.Component<{}, {}> {

  @Inject userStore: UserStore;

  render() {
    if (this.userStore.loggedIn) {
      return <UserIndicator/>;
    } else {
      return <LoginButton/>;
    }
  }
}
