import React from "react";
import {AbsoluteReturn} from "../../../../../../models/invreq/Bought/Product/ProductAnalysis";
import {LineChart} from "../../Chart/LineChart";

interface Props {
  data: AbsoluteReturn;
}

export class TotalProfitChart extends React.Component<Props, {}> {
  render() {

    const scale = {
      totalIncomeRatio: {
        alias: "总收益率",
        formatter: (val) => {
          return val.toFixed(2) + "%";
        },
      },
    };

    return (
      <LineChart data={this.props.data}
                 yName={"totalIncomeRatio"}
                 xName={"date"}
                 height={350}
                 color={"#396add"}
                 scale={scale}/>
    );
  }
}
