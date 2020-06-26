import React from "react";
import styled from "styled-components";
import observer from "mobx-react";
import {Col, Row, Card} from "antd";
import {LocaleMessage, LocaleStore} from "../../../../../internationalization/index";
import lang from "../../../../../internationalization/LocaleStore/lang";
import {Inject} from "react.di";
import {StockOverviewData} from "../../../../../models/invreq/Bought/Stock/StockOverviewData";

const Data = styled.p`
  font-size: 30px;
  color: #001529;
  margin-top: 10px;
`;

const Prompt = styled.p`
  color: #979797;
`;

interface Props {
  data: StockOverviewData;
}

export class DataComponent extends React.Component<Props, any> {
  render() {
    return (

      <div>
        <Card>
          <Prompt>初始时间</Prompt>
          <Data>{this.props.data.startDate}</Data>
        </Card>

        <Card>
          <Prompt>当前金额</Prompt>
          <Data>{this.props.data.currentVolume.toFixed(2)}¥</Data>
        </Card>

        <Card>
          <Prompt>股票占比</Prompt>
          <Data>{this.props.data.currentRatio.toFixed(2)}%</Data>
        </Card>
      </div>

    );
  }
}
