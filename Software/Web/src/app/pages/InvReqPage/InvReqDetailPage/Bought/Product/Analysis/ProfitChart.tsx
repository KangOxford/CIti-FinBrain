import React from "react";
import { Chart, Axis, Legend, Tooltip, Geom } from "bizcharts";
import DataSet from "@antv/data-set";
import { ProductDailyProfit } from "../../../../../../models/invreq/Bought/Product/ProductAnalysis";

const {DataView} = DataSet;

interface Props {
  data: ProductDailyProfit[];
}

export class ProfitChart extends React.Component<Props, {}> {
  render() {
    const dv = new DataView();
    dv.source(this.props.data)
      .transform(
        {
          type: "rename",
          map: {
            futuresProfit: "期货收益率",
            spotProfit: "现货收益率",
            totalIncomeRatio: "组合收益率",
          },
        },
      )
      .transform(
        {
          type: "fold",
          fields: ["期货收益率", "现货收益率", "组合收益率"],
          key: "key",
          value: "val",
        },
      );

    const scale = {
      val: {
        formatter: (val) => {
          return val.toFixed(2) + "%";
        },
      },
    };

    return (
      <Chart height={350}
             data={dv}
             padding={[30, 30, 80, 60]}
             scale={scale}
             forceFit={true}
      >
        <Axis name={"date"}/>
        <Axis name={"val"}/>
        <Legend/>
        <Tooltip crosshairs={{
          type: "y",
          style: {
            lineWidth: 1,
            stroke: "#cfcfcf",
          },
        }}/>

        <Geom
          type="line"
          position={"date*val"}
          color={"key"}
        />
        <Geom
          type={"point"}
          position={"date*val"}
          color={"key"}
        />

      </Chart>
    );
  }
}
