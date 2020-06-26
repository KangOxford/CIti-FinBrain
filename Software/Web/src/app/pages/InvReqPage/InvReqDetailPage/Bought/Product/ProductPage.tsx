import React, { ReactNode } from "react";
import { Inject } from "react.di";
import { InvReq } from "../../../../../models/invreq/InvReq";
import { AsyncComponent } from "../../../../../routing/AsyncComponent";
import { Row, Col, Card, Divider } from "antd";
import { DataCard } from "../DataCard";
import { ProductAnalysisService } from "../../../../../api/ProductAnalysisService";
import { QuotationService } from "../../../../../api/QuotationService";
import { ProductPosition } from "./ProductPosition";
import styled from "styled-components";
import { BondOverviewData } from "../../../../../models/invreq/Bought/Bond/BondOverviewData";
import { ProductOverview, ProductOverviewData } from "../../../../../models/invreq/Bought/Product/ProductOverviewData";

interface Props {
  invreq: InvReq;
}

function DataCol(props: { children: ReactNode, width: number }) {
  return <Col md={props.width} sm={24} xs={24}>
    {props.children}
  </Col>;

}

const StyledCard = styled(DataCard)`
  
`;

function DataComponent(props: { data: ProductOverview }) {
  const {startDate, currentRatio, currentVolume, name, price, profit, quantity, quotaId} = props.data;
  return <DataCol width={9}>
    <StyledCard prompt={"标的"} data={<>{name} {quotaId}</>}/>
    <StyledCard prompt={"开始时间"} data={startDate}/>
    <StyledCard prompt={"占比"} data={currentRatio.toFixed(2) + " %"}/>
  </DataCol>;
}

function PriceInfo(props: { data: ProductOverview }) {
  const {currentVolume, price, profit, quantity} = props.data;

  return <DataCol width={15}>
    <Card title={"交易详情"}>
      <Row>
        <DataCol width={12}>
          <StyledCard prompt={"数量"} data={quantity} fontSize={26}/>
        </DataCol>
        <DataCol width={12}>
          <StyledCard prompt={"单价"} data={price.toFixed(2) + " ¥"} fontSize={26}/>
        </DataCol>
      </Row>
      <Row>
        <DataCol width={12}>
          <StyledCard prompt={"总价"} data={currentVolume.toFixed(2) + " ¥"} fontSize={26}/>
        </DataCol>
        <DataCol width={12}>
          <StyledCard prompt={"收益"} data={profit.toFixed(2) + " %"} fontSize={26}/>
        </DataCol>
      </Row>
    </Card>
  </DataCol>;
}

export default class ProductPage extends React.Component<Props, {}> {
  @Inject service: ProductAnalysisService;
  @Inject quotaSvc: QuotationService;

  renderItem = async () => {
    const invreqId = this.props.invreq.invreqId;
    const overview = await this.service.getProductOverviewData(invreqId);
    const futuresOverview = overview.futuresOverview;
    const spotOverview = overview.spotOverview;

    return (
      <div>
        <Row>
          <DataComponent data={futuresOverview}/>
          <PriceInfo data={futuresOverview}/>
        </Row>
        <Divider/>
        <Row>
          <DataComponent data={spotOverview}/>
          <PriceInfo data={spotOverview}/>
        </Row>
      </div>
    );
  }

  render() {
    return <h3>目前没有配置商品市场。</h3>;
    // return <AsyncComponent render={this.renderItem}/>;
  }
}
