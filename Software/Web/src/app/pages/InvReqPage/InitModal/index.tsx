import React from "react";
import { Form, Input, Modal, Slider, Alert } from "antd";
import { observer } from "mobx-react";
import { LocaleMessage } from "../../../internationalization";
import lang from "../../../internationalization/LocaleStore/lang";
import { Inject } from "react.di";
import { UserService } from "../../../api/UserService";
import { RouterStore } from "../../../routing/RouterStore";
import { UserStore } from "../../../stores/UserStore";
import { InvreqService } from "../../../api/InvreqService";
import FormItem from "../../../components/Form/FormItem";
import { action, observable, runInAction } from "mobx";
import { InvreqInitFormData } from "./InvreqInitFormData";
import { Link } from "react-router-dom";
import styled from "styled-components";

interface Props {
  close(): void;

  shown: boolean;
}

interface State {
}

const root = lang().invreqInit;

const Hint = styled.small`
  line-height: 24px;
  display: block;
`;

/**
 * SignIn Form
 */
@observer
export default class InitModal extends React.Component<Props, State> {

  @Inject userService: UserService;
  @Inject routerStore: RouterStore;
  @Inject userStore: UserStore;
  @Inject invreqService: InvreqService;

  @observable data: InvreqInitFormData;

  @observable initiated: boolean = false;

  componentDidMount() {
    this.initData();
  }

  @action componentDidUpdate() {
    if (!this.initiated) {
      this.initData();
    }
  }

  async initData() {
    const data = await this.userService.getUserInvestmentPreference(this.userStore.user.username);
    runInAction(() => {
      this.data = new InvreqInitFormData(data);
      this.initiated = true;
    });
  }

  @observable submitting = false;

  @action onSubmit = async () => {
    this.data.confirmAttempted = true;
    // console.log(this.data);
    if (!this.data.valid) {
      return;
    }

    this.invreqService.createInvreq(this.data.data);

    Modal.info({
      title: "信息已经提交",
      content: "创建一个资产账户所需要的信息已经提交。创建账户需要一点时间。当账号创建完成时，系统将会发出通知，请耐心等待。",
      onOk: () => this.props.close(),
    });

    // this.submitting = true;
    // // execute fetch
    // const result = await this.invreqService.createInvreq(this.data.data);
    //
    // runInAction(() => {
    //   this.submitting = false;
    // });
    // this.props.close();
    // this.routerStore.jumpTo(`/invreq/${result.invreqId}`);
  };

  @action onYearChange = (value: number) => {
    this.data.year = value;
  };

  @action afterClose = () => {
    this.initiated = false;
  };

  render() {
    if (!this.initiated) {
      return null;
    }

    const {fluctuation, profit, amount, year, fluctuationValid, profitValid, amountValid} = this.data;

    return (
      <Modal
        visible={this.props.shown}
        title={<LocaleMessage id={root.init}/>}
        confirmLoading={this.submitting}
        onCancel={this.props.close}
        afterClose={this.afterClose}
        onOk={this.onSubmit}
      >
        <p>下列数据已通过您的理财偏好自动填写。</p>
        <Link to={"/user/investmentPreference"}>访问此处以访问和修改您的理财偏好</Link>

        <Form>
          <FormItem valid={profitValid} messageOnInvalid={"收益率应该在大于等于0但小于等于10%"}>
            <p><LocaleMessage id={root.profit}/></p>
            <Alert type={"warning"} message={
              <div>
                <p>由于余额宝收益率在3.439%左右，建议预期收益率不要超过8%。</p>
                <p>收益率过高会导致资金全部分配于股票市场，请谨慎考虑。</p>
              </div>}/>
            <Input type={"number"}
                   onChange={this.data.onChange("profit")}
                   value={profit}
                   addonAfter={"%"}
            />
          </FormItem>

          <FormItem valid={fluctuationValid} messageOnInvalid={"波动率应该大于等于3%"}>
            <p><LocaleMessage id={root.fluctuation}/></p>
            <Input type={"number"}
                   onChange={this.data.onChange("fluctuation")}
                   value={fluctuation}
                   addonAfter={"%"}
            />
          </FormItem>

          <FormItem valid={amountValid} messageOnInvalid={"金额应该大于等于0"}>
            <p><LocaleMessage id={root.amount}/></p>
            <Input type={"number"}
                   onChange={this.data.onChange("amount")}
                   value={amount}
            />
          </FormItem>

          <FormItem valid={true} messageOnInvalid={""}>
            <p><LocaleMessage id={root.year}/> <strong>{year}</strong></p>
            <Slider min={1} max={10} onChange={this.onYearChange} value={year}/>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
