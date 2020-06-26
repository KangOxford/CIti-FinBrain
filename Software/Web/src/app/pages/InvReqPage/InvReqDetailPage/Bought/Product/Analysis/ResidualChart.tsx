import React from "react";
import DataSet from "@antv/data-set";
import {ResidualTableList} from "../../../../../../models/invreq/Bought/Product/ProductAnalysis";
import {LineChart} from "../../Chart/LineChart";

const {DataView} = DataSet;

interface Props {
  data: ResidualTableList;
}

export class ResidualChart extends React.Component<Props, {}> {
  render() {

    const dv = new DataView();
    dv.source(this.props.data)
      .transform(
        {
          type: "rename",
          map: {
            residual: "残差",
          },
        },
      );

    const scale = {
      残差: {
        alias: "残差",
        formatter: (val) => {
          return val.toFixed(2) + "%";
        },
      },
      date: {
        alias: "日期",
        range: [0.05, 0.95],
      },
    };

    return (
      <LineChart height={330}
                 data={dv}
                 yName={"残差"}
                 xName={"date"}
                 color={"#7e3cdd"}
                 scale={scale}
      />
    );
  }
}
