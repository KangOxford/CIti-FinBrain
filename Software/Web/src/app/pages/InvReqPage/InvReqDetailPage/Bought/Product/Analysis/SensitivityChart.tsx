import React from "react";
import DataSet from "@antv/data-set";
import {SensitivityCurveList} from "../../../../../../models/invreq/Bought/Product/ProductAnalysis";
import {LineChart} from "../../Chart/LineChart";
const {DataView} = DataSet;

interface Props {
  data: SensitivityCurveList;
}

export class SensitivityChart extends React.Component<Props, {}> {
  render() {

    const dv = new DataView();
    dv.source(this.props.data);

    const scale = {
      weekIncomeRatio: {
        alias: "组合收益率(曲线拟合)",
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
                 yName={"weekIncomeRatio"}
                 xName={"weekFluctuationRatio"}
                 color={"#6798f7"}
                 shape={"smooth"}
                 scale={scale}/>
    );
  }
}
