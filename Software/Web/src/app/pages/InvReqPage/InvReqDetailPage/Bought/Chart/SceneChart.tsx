import React from "react";
import {Chart, Legend, Axis, Tooltip, Geom} from "bizcharts";
import DataSet from "@antv/data-set";
const {DataView} = DataSet;

interface Props {
  data: DataView;
  yName: string;
  scale: any;
  typeName: string;
}

export class SceneChart extends React.Component<Props, {}> {
  render() {
    const yLabel = this.props.yName;

    return (
      <Chart height={undefined}
             forceFit={true}
             padding={[30, 0, 100, 60]}
             data={this.props.data}
             scale={this.props.scale}
      >
        <Axis name={"date"} />
        <Axis name={yLabel} position={"left"} />
        <Axis name={"defaultVal"} visible={false} position={"right"}/>
        <Legend />
        <Tooltip />

        <Geom type={"interval"}
              position={"date*defaultVal"}
              color={[this.props.typeName,
                ["#bdc7f7", "#ffcaca", "#ffffc0", "#e2ffda"]]}
              // size={42}
        />
        <Geom type={"line"}
              position={"date*" + yLabel}
              color={"#ff0505"}
        />

      </Chart>
    );
  }
}
