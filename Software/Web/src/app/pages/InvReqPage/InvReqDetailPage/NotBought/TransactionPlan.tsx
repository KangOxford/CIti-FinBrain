import React from "react";
import styled from "styled-components";
import {Col, Row, Button, Card} from "antd";
import { PlanTransaction, TransactionDetailList } from "../../../../models/invreq/Bought/TransactionLog";
import {TranInfo} from "../Bought/Overview/TranInfo";
import SettingModalView from "./SettingModalView";
import {InvReq} from "../../../../models/invreq/InvReq";
import {Inject} from "react.di";
import {InvreqService} from "../../../../api/InvreqService";
import {AsyncComponent} from "../../../../routing/AsyncComponent";
import { defaultBoughtTranSetting } from "../../../../models/invreq/Bought/BoughtTranSetting";

interface Props {
  invreq: InvReq;
  plannedTransaction: PlanTransaction;
  refreshOnBought(): void;
}

export class TransactionPlan extends React.Component<Props> {

  render() {
    const { invreq, plannedTransaction } = this.props;

    return (
      <Card title={"计划交易"} style={{marginTop: "25px"}}>
        <Row gutter={36}>
          <Col md={6} xs={24}>
            <div>
              <i>交易额</i>
              <i style={{color: "#1890FF", marginLeft: "8px"}}>{plannedTransaction.tranVolume} ¥</i>
            </div>

            <br />
            <br/>

            <span>
              <SettingModalView invreq={this.props.invreq}
                                settingData={defaultBoughtTranSetting}
                                refreshOnBought={this.props.refreshOnBought}
              />
            </span>
            <br/>

          </Col>

          <Col md={16} xs={24}>
            <TranInfo data={plannedTransaction.tranList}/>
          </Col>

        </Row>
      </Card>
    );
  }
}
