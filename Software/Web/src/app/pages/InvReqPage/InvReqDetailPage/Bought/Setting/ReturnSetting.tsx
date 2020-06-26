import React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import { Alert, Button, Card, message, Modal } from "antd";
import { Inject } from "react.di";
import { InvReq } from "../../../../../models/invreq/InvReq";
import { InvreqService } from "../../../../../api/InvreqService";
import { RouterStore } from "../../../../../routing/RouterStore";

const Prompt = styled.div`
   margin-top: 10px;
   padding: 10px;
   border: #979797 1px solid;
   background-color: #e9e9e9;
   font-size: 12px;
`;

interface Props {
  id: string;
}

@observer
export class ReturnSetting extends React.Component<Props, {}> {
  @Inject service: InvreqService;
  @Inject routerStore: RouterStore;

  showConfirm = () => {

    Modal.confirm({
      title: "确认要赎回此资产账户吗？",
      onOk: async () => {
        await this.service.redeemAccount(this.props.id);
        message.success("资产账户已赎回。");
        this.routerStore.jumpTo("/invreq");
      },
      onCancel() {
        // message.error("已取消赎回");
      },
    });
  }

  render() {
    return (
      <Card>
        <p style={{fontSize: "20px"}}>账户设置</p>

        <Alert
          message="警告"
          description={`赎回后无法回退,
            所有未到账的收益将全部无效
            请谨慎选择`}
          type="warning"
          // showIcon={true}
          // style={{margin: "10px"}}
        />

        <Button style={{marginTop: "20px"}} type={"danger"} onClick={this.showConfirm}>赎回账户</Button>
      </Card>
    );
  }
}
