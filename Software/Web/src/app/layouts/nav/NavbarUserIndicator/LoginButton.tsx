import React from "react";
import { Button } from "antd";
import { observer } from "mobx-react";
import { UiStore } from "../../../stores/UiStore";
import { LocaleMessage, lang } from "../../../internationalization";
import { Inject } from "react.di";

interface Props {

}

@observer
export class LoginButton extends React.Component<Props, {}> {

  @Inject uiStore: UiStore;

  onButtonClick = () => {
    this.uiStore.toggleLoginModalShown();
  }

  render() {
    return <Button onClick={this.onButtonClick}>
      <LocaleMessage id={lang().nav.login}/>
    </Button>;
  }
}
