import React from "react";
import {Card} from "antd";
import {CardFooter} from "../../Util/CardFooter";
import {Chart, Axis, Legend, Tooltip, Geom} from "bizcharts";
import {SensibilityChartList} from "../../../../../../models/invreq/Bought/Stock/ScenarioAnalysis";
import DataSet from "@antv/data-set";
const {DataView} = DataSet;
interface Props {
  data: SensibilityChartList;
}
// 因子敏感性分析图
export class SensibilityChart extends React.Component<Props, {}> {
  render() {

    const dv = new DataView();
    dv.source(this.props.data)
      .transform(
        {
          type: "rename",
          map: {
            fluctuation: "波动率因子",
            lineRevenue: "线性拟合",
            curveRevenue: "曲线拟合",
          },
        },
      )
      .transform(
        {
          type: "fold",
          fields: ["线性拟合", "曲线拟合"],
          key: "key",
          value: "val",
          retains: ["波动率因子"],
        },
      );

    const scale = {
      val: {
        alias: "收益率(标准化)",
        formatter: (val) => {
          return  val.toFixed(2);
        },
      },
    };

    const Xtitle = {
      offset: 40,
      position: "end",
    };

    const Ytitle = {
      offset: 80,
      position: "end",
    };

    return (
      <Card style={{marginTop: "25px", textAlign: "center"}}
      >
        <Chart height={400}
               padding={[40, 30, 100, 100]}
               data={dv}
               scale={scale}
               forceFit={true}
        >
          <Axis name={"波动率因子"}
                title={Xtitle}/>
          <Axis name={"val"}
                title={Ytitle}
          />
          <Legend />
          <Tooltip crosshairs={{
            type: "y",
            style: {
              lineWidth: 1,
              stroke: "#cfcfcf",
            },
          }}/>

          <Geom type={"line"}
                position={"波动率因子*val"}
                color={"key"}
                shape={"smooth"}
          />

        </Chart>
        <CardFooter text={"因子敏感性分析图"}/>
      </Card>
    );
  }
}
