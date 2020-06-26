import { Button, Modal } from "antd";
import React from "react";
import { TransactionSetting } from "../Bought/Setting/TransactionSetting";
import { InvReq } from "../../../../models/invreq/InvReq";
import { BoughtTranSetting } from "../../../../models/invreq/Bought/BoughtTranSetting";
import { InvreqService } from "../../../../api/InvreqService";
import { Inject } from "react.di";
import { RouterStore } from "../../../../routing/RouterStore";

interface Props {
  invreq: InvReq;
  settingData: BoughtTranSetting;
  refreshOnBought(): void;
}

interface State {
  visible: boolean;
  requesting: boolean;
}

export default class SettingModalView extends React.Component<Props, State> {

  @Inject invreqService: InvreqService;
  @Inject routerStore: RouterStore;

  state = { visible: false, requesting: false };

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = async (e) => {
    const { invreqId } = this.props.invreq;
    this.setState({ requesting: true });
    await this.invreqService.confirmPlanTran(invreqId);
    this.setState({ requesting: false, visible: false});
    this.props.refreshOnBought();
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  render() {

    return (
      <div>
        <Button type="primary" onClick={this.showModal}>我要买</Button>
        <Modal
          title="确认交易设置"
          confirmLoading={this.state.requesting}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>请确认此资产账户的交易设置</p>
          <div style={{margin: "15px"}}>
            <TransactionSetting id={this.props.invreq.invreqId}
                              data={this.props.settingData}
                              beModified={false}
          />
          </div>
        </Modal>
      </div>
    );
  }
}
