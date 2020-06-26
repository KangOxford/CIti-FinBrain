import React from "react";
import {Chart, Coord, Legend, Label, Axis, Tooltip, Geom} from "bizcharts";

interface Props {
  dataView: DataView;
  cols: any;
}
export class PieChart extends React.Component<Props, {}> {
  render() {
    if (this.props.dataView !== null) {
      return(
      <Chart height={250}
             data={this.props.dataView}
             scale={this.props.cols}
             forceFit={true}
             padding={[40, 60, 20, 80]}
      >
        <Coord type="theta" radius={0.75} />
        <Tooltip
          showTitle={false}
          itemTpl="<li><span style=&quot;background-color:{color};&quot;
            class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
        />
        <Geom
          type="intervalStack"
          position="percent"
          color="item"
          tooltip={[
            "item*percent",
            (item, percent) => {
              percent = percent * 100 + "%";
              return {
                name: item,
                value: percent,
              };
            },
          ]}
          style={{
            lineWidth: 1,
            stroke: "#fff",
          }}
        >
          <Label
            content="percentage"
            formatter={(val, item) => {
              return item.point.item + ": " + val;
            }}
          />
        </Geom>
      </Chart>
    );
    } else {
      return <p style={{margin: "90px"}}>暂无数据</p>;
    }
  }
}
