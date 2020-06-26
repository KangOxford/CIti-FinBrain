import React from "react";
import { InvReq } from "../../../../models/invreq/InvReq";
import { Col, Row } from "antd";
import styled from "styled-components";
import { DataComponent } from "./DataComponent";
import { TransactionPlan } from "./TransactionPlan";
import { EarnAndRisk } from "./EarnAndRisk";
import { MatchingChart } from "../Bought/Overview/MatchingChart";
import { MatchingDetail } from "../Bought/Overview/MatchingDetail";
import { Inject } from "react.di";
import { AsyncComponent } from "../../../../routing/AsyncComponent";
import { InvreqService } from "../../../../api/InvreqService";
import { waitForMs } from "../../../../../utils/Wait";
import Loading from "../../../../components/Loading";

interface Props {
  invreq: InvReq;
  refresh(): void;
}

const Container = styled.div`
  //margin: 10px;
`;

// 未买入InvReq的信息界面
// @todo
export default class NotBoughtInvReqDetailPage extends React.Component<Props, {}> {
  @Inject service: InvreqService;

  renderItem = async () => {

    // await waitForMs(1000);
    const { invreqId } = this.props.invreq;
    const overviewData = await this.service.getOverview(invreqId);
    const reallocationData = await this.service.getReallocationLog(invreqId);
    const matchingData = await this.service.getMatching(invreqId);
    const detailMatchingData = await this.service.getDetailMatching(invreqId);
    const earnList = await this.service.getEarningList(invreqId);
    const planTransaction = await this.service.getPlanTransaction(invreqId);

    return(
      <Container>
        <DataComponent data={overviewData}/>
        <TransactionPlan invreq={this.props.invreq}
                         plannedTransaction={planTransaction}
                         refreshOnBought={this.props.refresh}
        />
        <EarnAndRisk earnList={earnList}/>

        <Row>
          <Col xl={10} md={24} sm={24} xs={24}>
            <MatchingChart data={matchingData}/>
          </Col>
          <Col xl={14} md={24} sm={24} xs={24}>
            <MatchingDetail data={detailMatchingData}/>
          </Col>
        </Row>
      </Container>
    );
  }

  render() {
    return <AsyncComponent render={this.renderItem} componentWhenLoading={<Loading/>}/>;
  }
}
