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
  height: number;
  data: any;
  yName: string;
  xName: string;
  scale?: any ;
  color: string;
  shape?: string;
}

export class LineChart extends React.Component<Props, {}> {
  render() {
    const yLabel = this.props.yName;
    const xLabel = this.props.xName;

    return (
      <div>
        <Chart height={this.props.height}
               data={this.props.data}
               forceFit={true}
               padding={[30, 60, 90, 80]}
               scale={this.props.scale}
        >
          <Axis name={xLabel}/>
          <Axis
            name={yLabel}
          />
          <Legend />
          <Tooltip
            crosshairs={{
              type: "y",
              style: {
                lineWidth: 1,
                stroke: "#cfcfcf",
              },
            }}/>
          <Geom
            type="line"
            position={xLabel + "*" + yLabel}
            color={this.props.color}
            shape={this.props.shape}
          />
          <Geom
            type={"point"}
            position={xLabel + "*" + yLabel}
            color={this.props.color}
            />

        </Chart>
      </div>
    );
  }
}
