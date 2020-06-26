import React from "react";
import { Row, Col, Card } from "antd";
import { QuotationChart } from "../QuotationChart";
import styled from "styled-components";
// import {PriceChangeRatioForm} from "../PriceChangeRatioForm";
import { AsyncComponent } from "../../../routing/AsyncComponent";
import { Inject } from "react.di";
import { QuotationService } from "../../../api/QuotationService";
import { StockQuotation } from "../../../models/quotation/stock/StockQuotation";

const Prompt = styled.p`
  color: #FFFFFF;
`;

interface Props {
  // chartData: StockQuotation[];
}

export default class StockMarketQuotationPage extends React.Component<Props, {}> {
  @Inject service: QuotationService;

  renderItem = async () => {

    const stockChartData = await this.service.getStockQuotationData();
    // const stockIndexFormData = await this.service.getStockIndexFormQuotation();
    // const priceChangeRatioFormData = await this.service.getPriceChangeRatioFormQuotation();

    return (
      <Card>
        <h1>沪深300 股票市场表现</h1>
        {/*<Row>*/}
        {/*<Col md={15} sm={24}>*/}
        <QuotationChart data={stockChartData}/>
        {/*</Col>*/}
        {/*<Col md={1} sm={24} />*/}
        {/*<Col md={9} sm={24}>*/}
        {/*<Card>*/}
        {/*<PriceChangeRatioForm columnWidth={40} data={this.props.data2}/>*/}
        {/*<StockIndexForm columnWidth={40} data={this.props.data3}/>*/}
        {/*</Card>*/}
        {/*</Col>*/}
        {/*</Row>*/}
      </Card>
    );
  };

  render() {
    return <AsyncComponent render={this.renderItem}/>;
  }
}
