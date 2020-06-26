import React, { ReactNode } from "react";
import styled from "styled-components";
import { Card, Col as AntdCol, Row } from "antd";
import { OverviewData } from "../../../../../models/invreq/Bought/OverviewData";
import PaddingCard from "../../../../../components/PaddingLayouts/PaddingCard";

interface Props {
  data: OverviewData;
}

const Data = styled.p`
  font-size: 30px;
  color: #001529;
  margin-top: 10px;
  margin-bottom: 40px;
`;

const StaticData = styled.p`
  font-size: 20px;
  color: #001529;
`;

const Prompt = styled.p`
  color: #979797;
`;

function format(value: number) {
  return value.toFixed(2) + "%";
}

function Col(props: {children: ReactNode}) {
  return <AntdCol xs={24} sm={12} lg={6}>{props.children}</AntdCol>;
}

export function DataComponent(props: Props) {
  const { accuRevenue, predRorYear, todayRevenue, startDate, startVolume } = props.data;
  return (
    <Row>
      <Col>
        <Card>
          <Prompt>累计收益</Prompt>
          <Data>{format(accuRevenue)}</Data>
        </Card>
      </Col>

      <Col>
        <Card>
          <Prompt>预期年化收益率</Prompt>
          <Data>{format(predRorYear)}</Data>
        </Card>
      </Col>

      <Col>
        <Card>
          <Prompt>今日收益</Prompt>
          <Data>{format(todayRevenue)}</Data>
        </Card>
      </Col>

      <Col>
        <Card>
          <Prompt>初始时间</Prompt>
          <StaticData>{startDate}</StaticData>

          <Prompt style={{marginTop: "15px"}}>初始金额</Prompt>
          <StaticData>$ {startVolume.toFixed(2)}</StaticData>
        </Card>
      </Col>

    </Row>

  );
}
