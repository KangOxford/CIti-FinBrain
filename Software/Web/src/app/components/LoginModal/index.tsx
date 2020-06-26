import React from "react";
import { Button, message, Modal } from "antd";
import { observer } from "mobx-react";
import { LoginController, LoginState } from "./LoginController";
import { LoginForm } from "./Form";
import { action } from "mobx";
import { Inject, Module } from "react.di";
import { Link } from "react-router-dom";
import Hotkeys from "react-hot-keys";
import { UiStore } from "../../stores/UiStore";
import { LocaleStore } from "../../internationalization";
import { Localize } from "../../internationalization/components";
import lang from "../../internationalization/LocaleStore/lang";
import EmailValidationModal from "../EmailValidationModal";
import { KnownLoginError, LoginErrorType } from "../../stores/UserStore";
import { NotificationStore } from "../../stores/NotificationStore";

interface Props {

}

const root = lang().loginModal;

@Module({
  providers: [
    {provide: LoginController, useClass: LoginController, noSingleton: true},
  ],
})
@observer
export class LoginModal extends React.Component<Props, any> {

  @Inject controller: LoginController;

  @Inject uiStore: UiStore;

  @Inject localeStore: LocaleStore;

  @Inject notificationStore: NotificationStore;

  onCancel = () => {
    this.uiStore.toggleLoginModalShown();
  }

  @action onOk = async () => {
    const {fields} = this.controller;
    fields.loginAttempted = true;
    if (fields.valid) {
      try {
        await this.controller.requestLogin(fields.username, fields.password);
        if (this.controller.state === LoginState.LoggedIn) {
          this.uiStore.toggleLoginModalShown();
        }
      } catch (e) {
        const e1 = e as KnownLoginError;
        message.error(this.localeStore.get(root.error[e1.type]));
        switch (e1.type) {
          case LoginErrorType.ServerError:
            message.error(e1.messages);
        }
        console.log(e);
      }
    }
  }

  onBtnRegisterClick = () => {
    this.uiStore.toggleLoginModalShown();
  }

  onValidationComplete = (validated: boolean) => {
    this.controller.emailValidationComplete(validated);
    if (validated) {
      this.uiStore.toggleLoginModalShown();
    }
  }

  render() {
    const props = {
      title: root.title,
      login: root.login,
      cancel: root.cancel,
      register: root.register,
    };

    return <div>
      <Localize<typeof props> replacements={props}>
        {(p) =>
          <Hotkeys
            keyName={"enter"}
            onKeyDown={this.onOk}
          >
            <Modal visible={this.uiStore.loginModalShown}
                   title={p.title}
                   onCancel={this.onCancel}
                   onOk={this.onOk}
                   footer={[
                     <Link key={"register"} to={"/register"}>
                       <Button onClick={this.onBtnRegisterClick} style={{ float: "left" }}>
                         <span>{p.register}</span>
                       </Button>
                     </Link>,
                     <Button key="back" onClick={this.onCancel}>
                       <span>{p.cancel}</span>
                     </Button>,
                     <Button key="submit"
                             type="primary"
                             loading={this.controller.loggingIn}
                             onClick={this.onOk}>
                       <span>{p.login}</span>
                     </Button>,
                   ]}
            >
              <LoginForm fields={this.controller.fields}/>
            </Modal>
          </Hotkeys>
        }
      </Localize>
        <EmailValidationModal visible={this.controller.state === LoginState.RequireEmailValidation}
                              onClose={this.onValidationComplete}
                              userToken={this.controller.user ? this.controller.user.token : ""}/>
    </div>;
  }
}
