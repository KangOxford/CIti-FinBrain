import React from "react";
import styled from "styled-components";
import { Col, Row } from "antd";
import { DataComponent } from "./DataComponent";
import { TransactionPlan } from "./TransactionPlan";
import { EarnAndRisk } from "./EarnAndRisk";
import { MatchingChart } from "./MatchingChart";
import { MatchingDetail } from "./MatchingDetail";
import { LatestReallocation } from "./LatestReallocation";
import { AsyncComponent } from "../../../../../routing/AsyncComponent";
import { Inject } from "react.di";
import { InvreqService } from "../../../../../api/InvreqService";
import { InvReq } from "../../../../../models/invreq/InvReq";

interface Props {
  invreq: InvReq;
}
const Container = styled.div`
`;

export default class OverviewPage extends React.Component<Props, any> {
  @Inject service: InvreqService;

  confirm = async (id) => {
    await this.service.confirmPlanTran(id);
  }

  cancelTran = async (id) => {
    await this.service.cancelPlanTran(id);
  }

  renderItem = async () => {
    const {invreqId} = this.props.invreq;
    const overviewData = await this.service.getOverview(invreqId);
    const reallocationData = await this.service.getReallocationLog(invreqId);
    const matchingData = await this.service.getMatching(invreqId);
    const detailMatching = await this.service.getDetailMatching(invreqId);
    const earningData = await this.service.getEarningList(invreqId);
    const planTranData = await this.service.getPlanTransaction(invreqId);

    console.log(detailMatching);

    return(
      <Container>
        <DataComponent data={overviewData}/>
        <TransactionPlan data={planTranData}
                         invreqId={invreqId}
                         confirmTran={this.confirm}
                         cancelTran={this.cancelTran}
        />
        <EarnAndRisk earnList={earningData}/>

        <Row>
          <Col xl={10} md={24} sm={24} xs={24}>
            <MatchingChart data={matchingData}/>
          </Col>
          <Col xl={14} md={24} sm={24} xs={24}>
            <MatchingDetail data={detailMatching}/>
          </Col>
        </Row>

        <LatestReallocation data={reallocationData} invreqId={invreqId}/>
      </Container>
    );
  }

  render() {
    return <AsyncComponent render={this.renderItem}/>;
  }
}
