import React, { ReactNode } from "react";
import styled from "styled-components";
import observer from "mobx-react";
import {Col, Row, Card} from "antd";
import { Inject } from "react.di";
import DataSet from "@antv/data-set";
import {PieChart} from "../Chart/PieChart";
import PaddingCard from "../../../../../components/PaddingLayouts/PaddingCard";
import {OverviewMatching} from "../../../../../models/invreq/Bought/MatchingList";

interface Props {
  data: OverviewMatching;
}

function Shell(props: {children: ReactNode}) {
  return <Card title={"当前配比"}>
    {props.children}
  </Card>;
}

export class MatchingChart extends React.Component<Props, {}> {
  render() {
    const {DataView} = DataSet;

    const currentData = [
      {
        item: "股票",
        percentage: this.props.data.stockMatching,
      },
      {
        item: "债券",
        percentage: this.props.data.bondMatching,
      },
      {
        item: "商品市场",
        percentage: this.props.data.productionMatching,
      },
    ];

    const currentDv = new DataView();
    currentDv.source(currentData)
      .transform(
      {
        type: "percent",
        field: "percentage",
        dimension: "item",
        as: "percent",
      },
    );

    const cols = {
      percentage: {
        formatter: (val) => {
          return val.toFixed(2) + "%";
        },
      },
    };

    return (
      <Shell>
        <PieChart dataView={currentDv} cols={cols}/>
      </Shell>
    );
  }
}
