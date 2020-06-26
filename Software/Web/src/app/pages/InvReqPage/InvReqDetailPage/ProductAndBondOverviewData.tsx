import React, { ReactNode } from "react";
import { BondOverviewData } from "../../../models/invreq/Bought/Bond/BondOverviewData";
import { Card, Col, Row } from "antd";
import styled from "styled-components";
import { DataCard } from "./Bought/DataCard";


function DataCol(props: {children: ReactNode }) {
  return <Col xl={3} md={6} xs={24} sm={12}>
    {props.children}
  </Col>;
}

const StyledCard = styled(DataCard)`
  height: 160px;
`;

const Prompt = styled.p`
  color: #979797;
`;

const Data = styled.p`
  font-size: 25px;
  color: #001529;
  margin-top: 10px;
`;

interface Props {
  data: BondOverviewData;
}

export function ProductAndBondOverviewData(props: { data: BondOverviewData }) {
  const { startDate, currentRatio, currentVolume, duration, name, price, profit, quantity, quotationId } = props.data;
  return <Row>
    <DataCol>
      <StyledCard prompt={"标的"} data={<>{name}<br/>{quotationId}</>}/>
    </DataCol>
    <DataCol>
      <StyledCard prompt={"占比"} data={currentRatio + "%"}/>
    </DataCol>
    <Col xl={6} md={12} sm={24} xs={24}>
      <Card style={{ height: "160px"}}>
        <Row>
          <Col span={12}>
            <Prompt>{"期限"}</Prompt>
            <Data>{duration}</Data>
          </Col>
          <Col span={12}>
            <Prompt>{"开始时间"}</Prompt>
            <Data>{startDate}</Data>
          </Col>
        </Row>
      </Card>
    </Col>
    <Col xl={6} md={12} sm={24} xs={24}>
      <Card style={{ height: "160px"}}>
        <Row>
          <Col span={12}>
            <Prompt>{"数量"}</Prompt>
            <Data>{quantity}</Data>
          </Col>
          <Col span={12}>
            <Prompt>{"单价"}</Prompt>
            <Data>{price}</Data>
          </Col>
        </Row>
      </Card>
    </Col>
    <DataCol>
      <StyledCard prompt={"总价"} data={currentVolume}/>
    </DataCol>
    <DataCol>
      <StyledCard prompt={"收益"} data={<span style={{ fontWeight: "bold" }} >{profit}</span>}/>
    </DataCol>

  </Row>;
}
