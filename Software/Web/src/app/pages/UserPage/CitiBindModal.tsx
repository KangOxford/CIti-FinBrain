import React from "react";
import { Form, Input, Modal, message } from "antd";
import { observer } from "mobx-react";
import {action, computed, observable, runInAction} from "mobx";
import { UserService } from "../../api/UserService";
import { Inject } from "react.di";
import FormItem from "../../components/Form/FormItem";

interface Props {
  shown: boolean;
  onClose(refresh: boolean): void;
}

@observer
export default class CitiBindModal extends React.Component<Props, {}> {

  @observable binding: boolean = false;
  @observable username: string = "";
  @observable password: string = "";

  @Inject userService: UserService;

  @observable confirmed: boolean = false;

  @action bind = async () => {
    this.confirmed = true;
    if (!this.valid) {
      return;
    }

    this.binding = true;

    try {
         await this.userService.setCitiAccount(this.username, this.password);
    this.props.onClose(true);
    } catch (e) {
      message.error("绑定失败！");
    }

    runInAction(() => {
      this.binding= false;
    });

  }

  @computed get usernameValid() {
    return !this.confirmed || !!this.username;
  }

  @computed get passwordValid() {
    return !this.confirmed || !!this.password;
  }

  @computed get valid() {
    return this.usernameValid && this.passwordValid;
  }

  @action onUsernameChange = (e) => {
    this.username = e.target.value;
  }

  @action onPasswordChange = (e) => {
    this.password = e.target.value;
  }

  onCancel = () => {
    this.props.onClose(false);
  }

  render() {
    return <Modal
      title={"绑定花旗银行账户"}
      visible={this.props.shown}
      confirmLoading={this.binding}
      onOk={this.bind}
      onCancel={this.onCancel}
      destroyOnClose={true}
    >
      <Form>
        <FormItem valid={this.usernameValid} messageOnInvalid={"请输入用户名"}>
          <span>用户名</span>
          <Input value={this.username} onChange={this.onUsernameChange}/>
        </FormItem>
        <FormItem valid={this.passwordValid} messageOnInvalid={"请输入密码"}>
          <span>密码</span>
          <Input value={this.password} onChange={this.onPasswordChange}/>
        </FormItem>
      </Form>
    </Modal>;
  }
}
