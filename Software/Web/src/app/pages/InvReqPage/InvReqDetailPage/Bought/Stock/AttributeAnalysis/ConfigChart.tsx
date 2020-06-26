import React from "react";
import {Card} from "antd";
import {CardFooter} from "../../Util/CardFooter";
import {StyleConfigChart} from "../../../../../../models/invreq/Bought/Stock/AttributeAnalysis";
import {Chart, Axis, Legend, Tooltip, Geom} from "bizcharts";
import DataSet from "@antv/data-set";
const {DataView} = DataSet;

interface Props {
  data: StyleConfigChart;
}

// 风格配置能力图
export class ConfigChart extends React.Component<Props, {}> {
  render() {

    const dv = new DataView();
    dv.source(this.props.data)
      .transform(
        {
          type: "rename",
          map: {
            styleTiming: "风格择时贡献",
            styleChoosing: "风格选股贡献",
            fundOver: "基金超额收益",
            fundBaseOver: "风格基准超额收益",
          },
        },
      )
      .transform(
        {
          type: "fold",
          fields: ["风格择时贡献", "风格选股贡献"],
          key: "style",
          value: "val",
          retains: ["基金超额收益",  "风格基准超额收益", "date"],
        },
      )
      .transform(
        {
          type: "fold",
          fields: ["基金超额收益", "风格基准超额收益"],
          key: "fundOver",
          value: "fundVal",
        },
      );

    const scale = {
      date: {
        tickCount: 2.5,
      },
      val: {
        alias: "基金收益率",
        min: -30.00,
        max: 30.00,
        formatter: (val) => {
          return val.toFixed(2) + "%";
        },
      },
      fundVal: {
        alias: "市场/风格累计超额收益",
        min: -8.00,
        max: 8.00,
        formatter: (fundVal) => {
          return fundVal.toFixed(2) + "%";
        },
      },
    };

    const title = {
      position: "end",
      offset: 80,
    };

    return(
      <Card>
        <Chart height={450}
               data={dv}
               forceFit={true}
               padding={[50, 100, 80, 100]}
               scale={scale}
        >
          <Tooltip crosshairs={{
            type: "y",
            style: {
              lineWidth: 1,
              stroke: "#cfcfcf",
            },
          }}/>
          <Legend />
          <Axis name={"date"} />
          <Axis name={"val"} position={"left"} title={title}/>
          <Axis name={"fundVal"} position={"right"} title={title} />

          <Geom type={"line"}
                position={"date*fundVal"}
                color={["fundOver", ["#ff7c76", "#5e7cdd"]]}
          />
          <Geom type={"intervalStack"}
                position={"date*val"}
                color={
                  ["style", ["#fffc94", "#d4baff"]]
                }
          />
        </Chart>
        <CardFooter text={"风格配置能力图"}/>
      </Card>
    );
  }
}
