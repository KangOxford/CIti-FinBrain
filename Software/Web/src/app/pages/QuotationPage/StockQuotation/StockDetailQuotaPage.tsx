import React from "react";
import styled from "styled-components";
import { Card, Row, Col, Icon } from "antd";
import { RouteComponentProps } from "react-router";
import { Inject } from "react.di";
import { AsyncComponent } from "../../../routing/AsyncComponent";
import { QuotationService } from "../../../api/QuotationService";
import { StockDetailQuotation } from "../../../models/quotation/stock/StockDetailQuotation";
import { QuotationChart } from "../QuotationChart";

const QuoCode = styled.p`
  font-size: 28px;
`;

const Volume = styled.p`
  font-size: 45px;
  color: #52c41b;
`;

const Prompt = styled.p`
  color: #9e9e9e;
  font-size: 12px;
`;

const Data = styled.p`
  font-size: 20px;
  //font-weight: bold;
  margin-bottom: 10px;
`;

interface Props extends RouteComponentProps<{ quotaId: string }> {

}

const OverviewCard = styled(Card)`
  height: 150px;
`;

export default class StockDetailQuotaPage extends React.Component<Props, {}> {
  @Inject service: QuotationService;

  renderItem = async () => {
    const {quotaId} = this.props.match.params;
    const quotaInfo: StockDetailQuotation = await this.service.getDetailStockQuotation(quotaId);

    return (
      <div>
        <Row>
          <Col lg={4} sm={12}>
            <OverviewCard>
              <QuoCode>
                {quotaInfo.quotaName}
                <br/>
                {quotaInfo.quotaId}
                </QuoCode>
            </OverviewCard>
          </Col>

          <Col lg={8} sm={12}>
            <OverviewCard>
              <Row>
                {/*现价*/}
                <Col span={16}>
                  <Prompt>现价</Prompt>
                  <Volume>
                    {quotaInfo.currentVolume}
                    <Icon type="caret-up" style={{color: "#52c41b", marginTop: "35px", fontSize: "25px"}}/>
                    </Volume>

                </Col>
                <Col span={8}>
                    <Prompt>涨幅:</Prompt>
                    <Data>{quotaInfo.rising}%</Data>
                    <Prompt>涨跌:</Prompt>
                    <Data>{quotaInfo.upAndDown}</Data>
                </Col>
              </Row>
            </OverviewCard>
          </Col>
          <Col lg={12} sm={24}>
            <Row>
              <Col span={8}>
                <OverviewCard>
                <Prompt>今开:</Prompt>
                <Data>{quotaInfo.todayPrice}</Data>
                <Prompt>昨收:</Prompt>
                <Data>{quotaInfo.yesterdayPrice}</Data>
                </OverviewCard>
              </Col>
              <Col span={8}>
                <OverviewCard>
                <Prompt>最高:</Prompt>
                <Data>{quotaInfo.highest}</Data>
                <Prompt>最低:</Prompt>
                <Data>{quotaInfo.lowest}</Data>
                </OverviewCard>
              </Col>

              <Col span={8}>
                <OverviewCard>
                <Prompt>成交额(亿)</Prompt>
                <Data>{quotaInfo.totalVolume}</Data>
                <Prompt>成交量(万)</Prompt>
                <Data>{quotaInfo.totalQuantity}</Data>
                </OverviewCard>
              </Col>
            </Row>
          </Col>
        </Row>

        <Card title={"走势图"}>
          <QuotationChart data={quotaInfo.history}/>
        </Card>
      </div>
    );
  };

  render() {
    return <AsyncComponent render={this.renderItem}/>;
  }
}
