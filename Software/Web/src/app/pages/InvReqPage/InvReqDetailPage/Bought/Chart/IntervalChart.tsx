import React from "react";
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util,
} from "bizcharts";
import DataSet from "@antv/data-set";

const {DataView} = DataSet;

interface Props {
  data: DataView;
  yLabel: string;
}

export class IntervalChart extends React.Component<Props, {}> {
  render() {
    const yName = this.props.yLabel;
    const scale = {
      date: {
        range: [0.1, 0.9],
      },
    };

    return (
      <div>
        <Chart height={400}
               data={this.props.data}
               forceFit={true}
               padding={[30, 60, 50, 100]}
               scale={scale}
        >
          <Axis name={"date"}/>
          <Axis
            name={yName}
            label={{
              formatter: (val) => `${val}.00¥`,
            }}
          />
          <Tooltip />
          <Legend />
          <Geom
            type="interval"
            position={"date*" + yName}
            color={"#6798f7"}
          />
        </Chart>
      </div>
    );
  }
}
