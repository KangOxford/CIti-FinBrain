import React from "react";
import styled from "styled-components";
import {Col, Row, Card} from "antd";
import {OverviewData} from "../../../../models/invreq/Bought/OverviewData";

interface Props {
  data: OverviewData;
}

const Data = styled.p`
  font-size: 30px;
  color: #001529;
  margin-top: 10px;
  margin-bottom: 40px;
`;

const Prompt = styled.p`
  color: #979797;
`;

export class DataComponent extends React.Component<Props> {
  render() {
    return (
        <Row >
          <Col span={12}>
            <Card>
              <Prompt>预期年化收益</Prompt>
              <Data>{this.props.data.predRorYear}%</Data>
            </Card>
          </Col>

          <Col span={12}>
            <Card>
              <Prompt>今日收益</Prompt>
              <Data>{this.props.data.todayRevenue}%</Data>
            </Card>
          </Col>
        </Row>

    );
  }
}
