import React, { ReactNode } from "react";
import {AsyncComponent} from "../../../../../routing/AsyncComponent";
import {Row, Col, Card, Divider} from "antd";
import {Inject} from "react.di";
import {BondAnalysisService} from "../../../../../api/BondAnalysisService";
import {InvReq} from "../../../../../models/invreq/InvReq";
import {DataCard} from "../DataCard";
import {QuotationService} from "../../../../../api/QuotationService";
import {BondPosition} from "./BondPosition";
import { BondOverviewData } from "../../../../../models/invreq/Bought/Bond/BondOverviewData";
import styled from "styled-components";
import {ProductOverview} from "../../../../../models/invreq/Bought/Product/ProductOverviewData";

interface Props {
  invreq: InvReq;
}

function DataCol(props: {children: ReactNode, width: number }) {
  return <Col md={props.width} sm={24} xs={24}>
      {props.children}
    </Col>;

}

const StyledCard = styled(DataCard)`
  //height: 160px;
`;

const Prompt = styled.p`
  color: #979797;
`;

const Data = styled.p`
  font-size: 25px;
  color: #001529;
  margin-top: 10px;
`;

function DataComponent(props: { data: BondOverviewData }) {
  const { startDate, currentRatio, currentVolume, duration, name, quotationId } = props.data;
  return <DataCol width={9}>
    <StyledCard prompt={"标的"} data={<>{name} {quotationId}</>}/>
      <StyledCard prompt={"开始时间"} data={startDate} />
      <StyledCard prompt={"占比"} data={currentRatio.toFixed(2) + " %"}/>
    </DataCol>;
}

function PriceInfo(props: { data: BondOverviewData}) {
   const { currentVolume, price, profit, quantity } = props.data;

   return <DataCol width={15}>
    <Card title={"交易详情"}>
        <Row>
          <DataCol width={12}>
            <StyledCard prompt={"数量"} data={quantity} fontSize={26}/>
          </DataCol>
          <DataCol width={12}>
            <StyledCard prompt={"单价"} data={price.toFixed(2)  + " ¥"} fontSize={26}/>
          </DataCol>
        </Row>
      {/*<Divider/>*/}
        <Row>
          <DataCol width={12}>
            <StyledCard prompt={"总价"} data={currentVolume.toFixed(2)  + " ¥"} fontSize={26}/>
          </DataCol>
          <DataCol width={12}>
            <StyledCard prompt={"收益"} data={profit.toFixed(2) + " %"} fontSize={26}/>
          </DataCol>
        </Row>
      </Card>
      </DataCol>;
}

export default class BondPage extends React.Component<Props, {}> {
  @Inject service: BondAnalysisService;
  @Inject quotaSvc: QuotationService;

  renderItem = async () => {
    const invreqId = this.props.invreq.invreqId;
    const overviewData = await this.service.getBondOverviewData(invreqId);
    const creditData = overviewData.creditOverview;
    const rateData = overviewData.rateOverview;
    // const creditBondQuota = await this.quotaSvc.getDetailStockQuotation(creditData.quotationId);
    // const rateBondQuota = await this.quotaSvc.getDetailStockQuotation(creditData.quotationId);

    return (
      <div>
        <Row>
          <DataComponent data={creditData}/>
          <PriceInfo data={creditData}/>
        </Row>
        <Divider/>
        <Row>
          <DataComponent data={rateData}/>
          <PriceInfo data={rateData}/>
        </Row>
      </div>
    );
  }

  render() {
    return <AsyncComponent render={this.renderItem}/>;
  }
}
