import { Checkbox, Form, Icon, Input } from "antd";
import React from "react";
import { Localize } from "../../internationalization/components";
import { observer } from "mobx-react";
import { LoginFormFields } from "./LoginController";
import { action } from "mobx";
import FormItem from "../Form/FormItem";
import lang from "../../internationalization/LocaleStore/lang";

interface Props  {
  fields: LoginFormFields;
}

const root = lang().loginModal;

@observer
export class LoginForm extends React.Component<Props, {}> {

  @action onUsernameChange = (e) => {
    this.props.fields.username = e.target.value;
  }

  @action onPasswordChange = (e) => {
    this.props.fields.password = e.target.value;
  }

  @action onRememberChange = (e) => {
    this.props.fields.remember = e.target.checked;
  }

  render() {
    const {fields} = this.props;
    const props = {
      username: root.username,
      password: root.password,
      requireUsername: root.requireUsername,
      requirePassword: root.requirePassword,
      remember: root.remember,
      forgetPassword: root.forgetPassword,
    };
    return (
      <Localize replacements={props}>
        {
          (p) => <Form className="login-form">
            <FormItem valid={fields.usernameValid} messageOnInvalid={p.requireUsername}>
              <Input prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
                     onChange={this.onUsernameChange}
                     placeholder={p.username as string}
                     value={fields.username}
              />
            </FormItem>
            <FormItem valid={fields.passwordValid} messageOnInvalid={p.requirePassword}>
              <Input prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
                     type="password"
                     onChange={this.onPasswordChange}
                     placeholder={p.password as string}
                     value={fields.password}
              />
            </FormItem>
            <FormItem valid={true} messageOnInvalid={null}>
              <Checkbox onChange={this.onRememberChange}
                        checked={fields.remember}
              >
                {p.remember}
                </Checkbox>
            </FormItem>
          </Form>
        }
      </Localize>
    );
  }
}
