import React from "react";
import { message } from "antd";
import lang from "../../internationalization/LocaleStore/lang";
import { EmailValidationRequestReceipt } from "../../models/user/EmailValidation";
import { UserService } from "../../api/UserService";
import { Inject } from "react.di";
import { observer } from "mobx-react";
import { action, observable, runInAction } from "mobx";
import { LocaleMessage } from "../../internationalization/components";

interface Props {
  sendDirectly?: boolean;
  onSend(receipt: EmailValidationRequestReceipt): void;
  userToken: string;
}

const root = lang().emailValidationModal;

@observer
export default class SendEmailIndicator extends React.Component<Props, {}> {

  @Inject userService: UserService;

  timer: NodeJS.Timer;
  
  @observable requestingEmail = false;

  @observable secondsRemainingForNextSend = 0;

  @action sendEmail = async () => {
    this.requestingEmail = true;
    try {
      const res = await this.userService.requestEmailValidation(this.props.userToken);
      runInAction(() => {
        this.requestingEmail = false;
        this.startTimer();
        this.props.onSend(res);
      });
    } catch (e) {
      runInAction(() => {
        this.requestingEmail = false;
        message.error("发送出错，请重试。");
      });
    }

  }

  componentDidMount() {
    if (this.props.sendDirectly) {
      this.sendEmail();
    }
  }

  clearTimer() {
    clearInterval(this.timer);
  }

  @action startTimer() {
    this.secondsRemainingForNextSend = 60;

    this.timer = setInterval(this.tick, 1000);
  }

  @action tick = () => {
    this.secondsRemainingForNextSend--;
    if (this.secondsRemainingForNextSend <= 0) {
      this.clearTimer();
    }

  }

  componentWillUnmount() {
    this.clearTimer();
  }

  render() {
    return <p>
      { this.requestingEmail
        ? <span>正在发送邮件……</span>
        : 
        this.secondsRemainingForNextSend === 0
        ? <a onClick={this.sendEmail}><LocaleMessage id={root.sendIndicator.send}/></a>

        : <span>
          <LocaleMessage id={root.sendIndicator.sent}
                         replacements={{seconds: this.secondsRemainingForNextSend}}/>
        </span>
      }
    </p>;
  }
}
