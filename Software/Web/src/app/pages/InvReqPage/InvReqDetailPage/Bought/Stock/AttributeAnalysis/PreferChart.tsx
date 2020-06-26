import React from "react";
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from "bizcharts";
import {Card} from "antd";
import {CardFooter} from "../../Util/CardFooter";
import DataSet from "@antv/data-set";
import {PreferAndContributionChart} from "../../../../../../models/invreq/Bought/Stock/AttributeAnalysis";

interface Props {
  preferChart: PreferAndContributionChart;
}
// 风格偏好及贡献图
export class PreferChart extends React.Component<Props, {}> {
  render() {
    const ds = new DataSet();
    const dv = ds.createView().source(this.props.preferChart);
    dv.transform({
      type: "rename",
      map: {
        s2016Q4: "2016Q4",
        s2017Q1: "2017Q1",
        s2017Q2: "2017Q2",
        s2017Q3: "2017Q3",
        s2017Q4: "2017Q4",
        s2018Q1: "2018Q1",
        s2018Q2: "2018Q2",
        s2018Q3: "2018Q3",
      },
    })
      .transform({
      type: "fold",
      fields: ["2016Q4", "2017Q1", "2017Q2", "2017Q3", "2017Q4", "2018Q1", "2018Q2", "2018Q3"],
      // 展开字段集
      key: "季度点",
      // key字段
      value: "风格收益(%)", // value字段
    });

    const scale = {
      季度点: {
        tickCount: 4,
      },
    };

    return(
      <Card style={{marginTop: "25px"}}
      >
        <div>
          <Chart height={350} data={dv} forceFit={true} scale={scale}>
            <Legend />
            <Axis name="季度点" />
            <Axis name="风格收益(%)" />
            <Tooltip />
            <Geom
              type="intervalStack"
              position="季度点*风格收益(%)"
              color={"name"}
              style={{
                stroke: "#fff",
                lineWidth: 1,
              }}
            />
          </Chart>
        </div>
        <CardFooter text={"风格偏好及贡献图"}/>
      </Card>
    );
  }
}
