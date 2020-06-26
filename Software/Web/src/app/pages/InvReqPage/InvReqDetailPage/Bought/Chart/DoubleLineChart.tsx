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
}

export class DoubleLineChart extends React.Component<Props, {}> {
  render() {

    const mobileScale = {
      date: {
        tickCount: 3,
      },
    };
    const pcScale = {
      date: {
        tickCount: 8,
      },
    };

    return (
      <div>
        <Chart height={300}
               data={this.props.data}
               forceFit={true}
               padding={[30, 80, 80, 80]}
               scale={document.body.scrollWidth > 600 ? pcScale : mobileScale}
        >
          <Axis name={"date"}/>
          <Axis
            name="val"
            tickLine={null}
            grid={null}
            title={null}
            label={{
              formatter: (val) => `${val}%`,
            }}
          />
          <Tooltip crosshairs={{
              type: "y",
              style: {
                lineWidth: 1,
                stroke: "#cfcfcf",
              },
            }}/>
          <Legend />
          <Geom
            type="line"
            position="date*val"
            size={1}
            color={"key"}
            shape="smooth"
            style={{
              shadowColor: "l (270) 0:rgba(21, 146, 255, 0)",
              shadowBlur: 60,
              shadowOffsetY: 6,
            }}
          />
        </Chart>
      </div>
    );
  }
}
