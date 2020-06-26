import React from "react";
import DataSet from "@antv/data-set";
import {SensitivityList} from "../../../../../../models/invreq/Bought/Product/ProductAnalysis";
import {LineChart} from "../../Chart/LineChart";
const {DataView} = DataSet;

interface Props {
  data: SensitivityList;
}

export class SensitivityLinearChart extends React.Component<Props, {}> {
  render() {

    const linearList = [
      {
        weekFluctuationRatio: this.props.data.x1,
        WeekIncomeRatio: this.props.data.y1,
      },
      {
        weekFluctuationRatio: this.props.data.x2,
        WeekIncomeRatio: this.props.data.y2,
      },
    ];

    const dv = new DataView();
    dv.source(linearList);

    const scale = {
      WeekIncomeRatio: {
        alias: "组合收益率(线性拟合)",
        formatter: (val) => {
          return val.toFixed(2) + "%";
        },
      },
      weekFluctuationRatio: {
        alias: "波动率",
        range: [0.1, 0.9],
        formatter: (val) => {
          return val.toFixed(2) + "%";
        },
        tickCount: 3,
      },
    };

    return (
      <LineChart height={300}
                 data={dv}
                 yName={"WeekIncomeRatio"}
                 xName={"weekFluctuationRatio"}
                 color={"#ff5348"}
                 scale={scale}/>
    );
  }
}
