import React from "react";
import DataSet from "@antv/data-set";
import {ComparisionTableList, TableList} from "../../../../../../models/invreq/Bought/Product/ProductAnalysis";
import {LineChart} from "../../Chart/LineChart";
const {DataView} = DataSet;

interface Props {
  data: TableList;
}

export class ComparisionChart extends React.Component<Props, {}> {
  render() {

    const dv = new DataView();
    dv.source(this.props.data)
      .transform(
        {
          type: "rename",
          map: {
            marketRatio1: "南方原油市场基准",
            marketRatio2: "南华商品指数市场基准",
            totalIncomeRatio: "组合收益率",
          },
        },
      )
      .transform(
        {
          type: "fold",
          fields: ["南方原油市场基准", "南华商品指数市场基准", "组合收益率"],
          key: "key",
          value: "val",
        },
      );
    console.log(dv);
    const scale = {
      val: {
        formatter: (val) => {
          return val.toFixed(2) + "%";
        },
      },
      date: {
        range: [0.1, 0.9],
      },
    };

    return (
      <LineChart height={320} data={dv} yName={"val"} xName={"date"} color={"key"} scale={scale}/>
    );
  }
}
