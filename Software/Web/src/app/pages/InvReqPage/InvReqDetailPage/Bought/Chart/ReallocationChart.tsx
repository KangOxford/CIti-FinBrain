import React from "react";
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from "bizcharts";
import DataSet from "@antv/data-set";
import {ReallocationLog} from "../../../../../models/invreq/Bought/ReallocationLog";

interface Props {
  data: ReallocationLog;
}

export class ReallocationChart extends React.Component<Props, {}> {
  render() {
    const ds = new DataSet();
    const dv = ds
      .createView()
      .source(this.props.data)
      .transform(
        {
          type: "rename",
          map: {
            perOfStock: "股票",
            perOfBond: "债券",
            perOfProduct: "商品市场",
          },
        },
      )
      .transform(
        {
          type: "fold",
          fields: ["股票", "债券", "商品市场"],
          key: "key",
          value: "val",
          retains: ["tranDate"],
        })
      .transform(
        {
          type: "percent",
          field: "val",
          dimension: "key",
          groupBy: ["tranDate"],
          as: "percent",
        });
    console.log(dv);

    const cols = {
      percent: {
        min: 0,

        formatter(val) {
          return (val * 100).toFixed(2) + "%" ;
        },
      },
      tranDate: {
        range: [0.1, 0.9],
      },
    };

    return (
      <div>
        <Chart height={400}
               data={dv}
               scale={cols}
               forceFit={true}
               padding={[5, 80, 120, 80]}
        >
          <Legend />
          <Axis name="tranDate" position={"bottom"}/>
          <Axis name="percent" />
          <Tooltip />
          <Geom
            type="intervalStack"
            position="tranDate*percent"
            color={"key"}
          />
        </Chart>
      </div>
    );
  }
}
