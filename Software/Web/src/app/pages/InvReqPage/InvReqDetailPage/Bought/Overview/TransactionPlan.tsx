import React from "react";
import styled from "styled-components";
import observer from "mobx-react";
import { Col, Row, Button, Card, message, Modal } from "antd";
import { LocaleMessage, LocaleStore } from "../../../../../internationalization/index";
import lang from "../../../../../internationalization/LocaleStore/lang";
import { TranInfo } from "./TranInfo";
import { PlanTransaction } from "../../../../../models/invreq/Bought/TransactionLog";

const ChartContainer = styled.div`
  border: #979797 1px solid;
  height: 140px;
`;

interface Props {
  data: PlanTransaction;
  invreqId: string;

  confirmTran(invreqId: string): Promise<void>;

  cancelTran(invreqId: string): Promise<void>;
}

interface State {
  hasData: string; // 是否有交易计划
  confirmLoading: boolean;
  cancelLoading: boolean;
}

export class TransactionPlan extends React.Component<Props, State> {

  state = {
    hasData: "none",
    confirmLoading: false,
    cancelLoading: false,
  };

  componentWillMount() {
    if (this.props.data.tranVolume === 0) {
      this.setState({
        hasData: "none",
      });
    } else {
      this.setState({
        hasData: "block",
      });
    }
  }

  confirmPlan = async () => {
    const thisClass = this;

    try {
      Modal.confirm({
        title: "是否确认进行交易？",
        onOk() {
          const res = thisClass.props.confirmTran(thisClass.props.invreqId);
          thisClass.setState({
            confirmLoading: true,
          });
          thisClass.setState({
            confirmLoading: false,
            hasData: "none",
          });
          message.success("交易成功");
        },
        onCancel() {
          message.error("确认交易操作取消");
        },
      });

    } catch (e) {

    }
  };

  cancelPlan = async () => {

    try {
      Modal.confirm({
        title: "是否确认取消交易？",
        onOk: async () => {
          this.setState({
            confirmLoading: true,
          });
          const res = await this.props.cancelTran(this.props.invreqId);
          this.setState({
            confirmLoading: false,
            hasData: "none",
          });
          message.success("取消交易成功");
        },
        onCancel() {
          message.error("取消交易操作取消");
        },
      });

    } catch (e) {

    }
  };

  render() {
    return (
      <Row id={"planTran"}>
        <Col>
          <Card title={"计划交易"}
                style={{display: this.state.hasData}}
          >
            <Row gutter={16}>
              <Col xs={24} md={6}>
            <span>
              <i>交易额 </i>
              <i style={{color: "#1890FF"}}>{this.props.data.tranVolume}¥</i>
            </span>
                <br/>

                <span>
              <i>交易时间 </i>
              <i style={{color: "#1890FF"}}>{this.props.data.tranDate}</i>
            </span>

                <br/>
                <br/>

<br/>                <br/>

                <span>
              <Button type={"primary"}
                      onClick={this.confirmPlan}
              >确认</Button>
              <Button style={{marginLeft: "8px"}}
                      onClick={this.cancelPlan}
              >取消</Button>
            </span>
                <br/>

              </Col>

              <Col xs={24} md={18}>
                <TranInfo data={this.props.data.tranList}/>
              </Col>

            </Row>
          </Card>
        </Col>
      </Row>
    );
  }
}
