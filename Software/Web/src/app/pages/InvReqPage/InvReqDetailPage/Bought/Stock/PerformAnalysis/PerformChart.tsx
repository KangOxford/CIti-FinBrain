import React from "react";
import {Card} from "antd";
import {Chart, Axis, Geom, Tooltip, Legend} from "bizcharts";
import {CardFooter} from "../../Util/CardFooter";
import DataSet from "@antv/data-set";
import {PerformChartList} from "../../../../../../models/invreq/Bought/Stock/PerformAnalysis";

const {DataView} = DataSet;
interface Props {
  data: PerformChartList;
}

// 超额动态回撤和超额收益率图
export class PerformChart extends React.Component<Props, {}> {
  render() {

    // transform data
    const dv = new DataView();
    dv.source(this.props.data)
      .transform(
        {
          type: "rename",
          map: {
            returnNum: "超额动态回撤",
            revenueNum: "超额收益率",
          },
        },
      );

    const scale = {
      date: {
        tickCount: 3,
      },
      超额动态回撤: {
        min: -40.00,
        max: 10.00,
        formatter: (val) => {
          return val.toFixed(2) + "%";
        },
      },
      超额收益率: {
        min: -80.00,
        max: 20.00,
        formatter: (val) => {
          return val.toFixed(2) + "%";
        },
      },
    };

    return(
      <Card>
        <Chart height={500}
               width={1050}
               data={dv}
               scale={scale}
               padding={[30, 100, 80, 100]}
               forceFit={true}
        >
          <Axis name={"date"}/>
          <Axis name={"超额动态回撤"}
                position={"left"}/>
          <Axis name={"超额收益率"} position={"right"}/>
          <Tooltip crosshairs={{
            type: "y",
            style: {
              lineWidth: 1,
              stroke: "#cfcfcf",
            },
          }}
          />
          <Legend />

          <Geom
            type={"area"}
            position={"date*超额动态回撤"}
          />
          <Geom
            type={"line"}
            position={"date*超额动态回撤"}
          />
          <Geom
            type={"interval"}
            position={"date*超额收益率"}
            color={"#ff6f83"}
          />

        </Chart>
        <CardFooter text={"超额动态回撤和超额收益率图"}/>
      </Card>
    );
  }
}
