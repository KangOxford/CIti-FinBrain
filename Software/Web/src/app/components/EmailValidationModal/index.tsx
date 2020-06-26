import React from "react";
import { Checkbox, Input, message, Modal } from "antd";
import lang from "../../internationalization/LocaleStore/lang";
import { observer } from "mobx-react";
import { Inject } from "react.di";
import { LocaleMessage, LocaleStore } from "../../internationalization";
import { action, observable, runInAction } from "mobx";
import FormItem from "../Form/FormItem";
import { UserService } from "../../api/UserService";
import { NetworkError } from "../../api/NetworkResponse";
import SendEmailIndicator from "./SendEmailIndicator";
import { EmailValidationRequestReceipt } from "../../models/user/EmailValidation";

interface Props {
  onClose(validated: boolean, remember?: boolean): void; // 关闭的时候的回调。参数为用户是否已经验证成功。
  userToken: string; // 用户的token。注册成功后会返回
  sendEmailDirectly?: boolean; // 是否一渲染这个组件就发邮件。
  visible: boolean; // 这个modal是否可以显示。当然也可以在父组件条件渲染这个组件，但是通过visible控制可以显示关闭动画
  showRememberCheck?: boolean; // 是否显示记住我的选择卡。若此为true，则onClose回调第二个参数为是否勾选记住我，否则为undefined
}

enum VerifyState {
  FirstRun,
  Inputting,
  Verifying,
  BadCode,
}

const root = lang().emailValidationModal;

@observer
export default class EmailValidationModal extends React.Component<Props, {}> {

  @observable code: string = "";
  @observable remember: boolean = false;
  @observable verifyState: VerifyState = VerifyState.FirstRun;
  @Inject userService: UserService;

  token: string = null;

  @Inject localeStore: LocaleStore;

  @action onOk = async () => {
    this.verifyState = VerifyState.Verifying;
    try {
      await this.userService.validateEmail(this.token, this.code, this.props.userToken);
      message.success(this.get(root.message.success));
      this.props.onClose(true, this.props.showRememberCheck ? this.remember : undefined);
    } catch (e) {
      const e1 = e as NetworkError;
      switch (e1.statusCode) {
        case 400:
          runInAction(() => this.verifyState = VerifyState.BadCode);
          break;
        default:
          message.error(e1.statusCode);
      }
    }
  }

  @action clearUp = () => {
    this.verifyState = VerifyState.FirstRun;
    this.code = "";
    this.token = "";
  }

  onCancel = () => {
    this.props.onClose(false, this.props.showRememberCheck ? this.remember : undefined);
  }

  get = (id: string) => {
    return this.localeStore.get(id);
  }

  @action onInputChange = (e) => {
    this.verifyState = VerifyState.Inputting;
    this.code = e.target.value;
  }

  @action onRememberChecked = (e) => {
    this.remember = e.target.checked;
  }

  onSend = (receipt: EmailValidationRequestReceipt) => {
    this.token = receipt.validationToken;
  }

  render() {
    return <Modal visible={this.props.visible}
                  afterClose={this.clearUp}
                  onOk={this.onOk}
                  title={this.get(root.title)}
                  okText={this.get(root.footer.confirm) as string}
                  cancelText={this.get(root.footer.cancel) as string}
                  onCancel={this.onCancel}
                  confirmLoading={this.verifyState === VerifyState.Verifying}
    >
      <p>{this.get(root.description)}</p>
      <SendEmailIndicator onSend={this.onSend}
                          userToken={this.props.userToken}
                          sendDirectly={this.props.sendEmailDirectly}/>
      <FormItem valid={this.verifyState !== VerifyState.BadCode} messageOnInvalid={this.get(root.message.failure)}>
        <Input size={"large"}
               placeholder={this.get(root.placeholder) as string}
               onChange={this.onInputChange}
               value={this.code}/>
      </FormItem>
      {this.props.showRememberCheck
        ? <Checkbox checked={this.remember} onChange={this.onRememberChecked}>
          <LocaleMessage id={root.remember}/>
        </Checkbox>
        : null
      }
    </Modal>;
  }
}
