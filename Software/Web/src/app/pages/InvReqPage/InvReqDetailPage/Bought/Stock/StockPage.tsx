import React from "react";
import { InvReq } from "../../../../../models/invreq/InvReq";
import styled from "styled-components";
import {DataComponent} from "./DataComponent";
import {EarnAndRisk} from "../Overview/EarnAndRisk";
import {Col, Row, Button} from "antd";
import {CurrentPosition} from "./CurrentPosition";
import {LatestTransaction} from "./LatestTransaction";
import {AsyncComponent} from "../../../../../routing/AsyncComponent";
import { Inject } from "react.di";
import {InvreqServiceMock} from "../../../../../api/mock/InvreqServiceMock";
import { InvreqService } from "../../../../../api/InvreqService";
import { Link } from "react-router-dom";
import {QuotationService} from "../../../../../api/QuotationService";
import { StockAnalysisService } from "../../../../../api/StockAnalysisService";
import {StockOverviewData} from "../../../../../models/invreq/Bought/Stock/StockOverviewData";
import {MatchingList} from "../../../../../models/invreq/Bought/MatchingList";
import {TransactionLog} from "../../../../../models/invreq/Bought/TransactionLog";

interface Props {
  invreq: InvReq;
}

const Container = styled.div`
  //margin: 10px;
`;

function StockOverview(props: {invreqId: string, overviewData: StockOverviewData, matchingData: MatchingList,
  tranData: TransactionLog}) {
  return <Container>
      <Row>
        <Col md={7} sm={24}>
          <DataComponent data={props.overviewData}/>
        </Col>
        <Col md={17} sm={24}>
          <CurrentPosition data={props.matchingData.filter((x) => x.type === "STOCK")}/>
        </Col>
      </Row>
      <LatestTransaction invreqId={props.invreqId} data={props.tranData}/>
    </Container>;
}

export default class StockPage extends React.Component<Props, {}> {
  @Inject service: InvreqService;
  @Inject stockAnalysisService: StockAnalysisService;

  renderItem = async () => {
    const {invreqId} = this.props.invreq;
    const overviewData = await this.stockAnalysisService.getStockOverviewData(invreqId);
    const tranData = await this.service.getTransactionLog(invreqId);
    const matchingData = await this.service.getDetailMatching(invreqId);

    return <StockOverview invreqId={invreqId}
                          overviewData={overviewData}
                          matchingData={matchingData} tranData={tranData}/>;
  }

  render() {
    return <AsyncComponent render={this.renderItem}/>;
  }
}
