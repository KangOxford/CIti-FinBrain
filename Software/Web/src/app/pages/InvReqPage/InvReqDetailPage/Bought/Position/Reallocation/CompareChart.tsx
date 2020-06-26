import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import DataSet from "@antv/data-set";
import { ReallocationLog } from "../../../../../../models/invreq/Bought/ReallocationLog";
import { PieChart } from "../../Chart/PieChart";

interface Props {
  data: ReallocationLog;
}

const Container = styled.div`
  border: #d9d9d9 1px solid;
  padding-top: 20px;
  margin: 0px;
  border-radius: 5px;
  background-color: #fafafa;
  text-align: center;
`;

const ChartContainer = styled.div`
  //margin: 20px;
`;
const { DataView } = DataSet;

export class CompareChart extends React.Component<Props, {}> {

  judgeIsNone = (data) => {
    if (data.perOfStock  || data.perOfBond || data.perOfProduct ) {
      return true;
    } else {
      return false;
    }
  };

  render() {

    let lastData = [];
    let lastDv = new DataView();
    let currentData = [];
    let currentDv = new DataView();

    if (this.judgeIsNone(this.props.data[0])) {
      lastData = [
      {
        item: "股票",
        percentage: this.props.data[0].perOfStock,
      },
      {
        item: "债券",
        percentage: this.props.data[0].perOfBond,
      },
      {
        item: "商品市场",
        percentage: this.props.data[0].perOfProduct,
      },
    ];
      lastDv.source(lastData).transform(
      {
        type: "percent",
        field: "percentage",
        dimension: "item",
        as: "percent",
      },
    );
    } else {
      lastDv = null;
    }

    if (this.judgeIsNone(this.props.data[1])) {
      currentData = [
      {
        item: "股票",
        percentage: this.props.data[1].perOfStock,
      },
      {
        item: "债券",
        percentage: this.props.data[1].perOfBond,
      },
      {
        item: "商品市场",
        percentage: this.props.data[1].perOfProduct,
      },
    ];

      currentDv.source(currentData).transform(
      {
        type: "percent",
        field: "percentage",
        dimension: "item",
        as: "percent",
      },
    );
    } else {
      currentDv = null;
    }

    const cols = {
      percentage: {
        formatter: (val) => {
          val = val.toFixed(2) + "%";
          return val;
        },
      },
    };

    return (
      <Container>
        <p style={{fontSize: "20px"}}>上次配比</p>
        <ChartContainer>
          <PieChart dataView={lastDv} cols={cols}/>
        </ChartContainer>

        <p style={{fontSize: "40px", marginBottom: "20px"}}>⬇︎</p>
        <p style={{fontSize: "20px"}}>本次配比</p>

        <ChartContainer>
          <PieChart dataView={currentDv} cols={cols}/>
        </ChartContainer>
      </Container>
    );
  }
}

