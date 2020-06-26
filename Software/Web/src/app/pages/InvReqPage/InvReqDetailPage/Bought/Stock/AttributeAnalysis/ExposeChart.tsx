import React from "react";
import {Card} from "antd";
import {CardFooter} from "../../Util/CardFooter";
import DataSet from "@antv/data-set";
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
  } from "bizcharts";
import {StyleExposeChart} from "../../../../../../models/invreq/Bought/Stock/AttributeAnalysis";

interface Props {
  exposeChart: StyleExposeChart;
}
// 风格暴露图
export class ExposeChart extends React.Component<Props, {}> {
  render() {
    const cols = {
      dateq: {
        type: "linear",
        // tickInterval: 50,
      },
      season: {
        tickCount: 4,
      },
    };
    const {DataView} = DataSet;
    const dv = new DataView();

    return(
      <Card style={{height: "480px", marginTop: "25px", marginRight: "25px"}}>
        <div>
          <Chart height={400} data={this.props.exposeChart}
                 padding={[30, 60, 80, 60]}
                 scale={cols} forceFit={true}>
            <Axis name="season" />
            <Axis name="value" />
            <Legend />
            <Tooltip
              crosshairs={{
                type: "y",
              }}
            />
            <Geom type="areaStack" position="season*value" color="name" />
            <Geom type="lineStack" position="season*value" size={2} color="name" />
          </Chart>
        </div>
        <CardFooter text={"风格暴露图"}/>
      </Card>
    );
  }
}
