import React from "react";
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
  View,
} from "bizcharts";
import DataSet from "@antv/data-set";
import Slider from "bizcharts-plugin-slider";
import { BaseQuotation } from "../../models/quotation/BaseQuotation";

interface Props {
  data: BaseQuotation[];
}

export class QuotationChart extends React.Component<Props> {

  ds = new DataSet({
    state: {
      start: "2018-09-10",
      end: "2018-10-23",
    },
  });

  onChange = (obj) => {
    const {startText, endText} = obj;
    this.ds.setState("start", startText);
    this.ds.setState("end", endText);
  }

  render() {

    const {DataView} = DataSet;

    const { data } = this.props;

    const cols = {
      time: {
        type: "timeCat",
        nice: false,
        range: [0, 1],
      },
      trend: {
        values: ["上涨", "下跌"],
      },
      volume: {
        alias: "成交量",
      },
      start: {
        alias: "开盘价",
      },
      end: {
        alias: "收盘价",
      },
      max: {
        alias: "最高价",
      },
      min: {
        alias: "最低价",
      },
      range: {
        alias: "股票价格",
      },
    };
    // 设置状态量，时间格式建议转换为时间戳，转换为时间戳时请注意区间

    const dv = this.ds.createView();
    dv.source(data)
      .transform({
        type: "filter",
        callback: (obj) => {
          const date = obj.time;
          return date <= this.ds.state.end && date >= this.ds.state.start;
        },
      })
      .transform({
        type: "map",
        callback: (obj) => {
          obj.trend = obj.start <= obj.end ? "上涨" : "下跌";
          obj.range = [obj.start, obj.end, obj.max, obj.min];
          return obj;
        },
      });

    return (
      <div>
        <Chart
          height={600}
          animate={false}
          padding={[30, 60, 40, 80]}
          data={dv}
          scale={cols}
          forceFit={true}
        >
          <Legend/>
          <Tooltip
            showTitle={false}
            itemTpl="<li data-index={index}><span style=&quot;background-color:{color};&quot;
              class=&quot;g2-tooltip-marker&quot;></span>{name}{value}</li>"
          />
          <View
            end={{
              x: 1,
              y: 0.5,
            }}
            data={dv}
          >
            <Axis name="time"/>
            <Axis name="range"/>
            <Geom
              type="schema"
              position="time*range"
              color={[
                "trend",
                (val) => {
                  if (val === "上涨") {
                    return "#f04864";
                  }

                  if (val === "下跌") {
                    return "#2fc25b";
                  }

                  return "#ffffff";
                },
              ]}
              tooltip={[
                "time*start*end*max*min",
                ((time, start, end, max, min) => {
                  return {
                    name: time,
                    value:
                      '<br><span style="padding-left: 16px">开盘价：' +
                      start +
                      "</span><br/>" +
                      '<span style="padding-left: 16px">收盘价：' +
                      end +
                      "</span><br/>" +
                      '<span style="padding-left: 16px">最高价：' +
                      max +
                      "</span><br/>" +
                      '<span style="padding-left: 16px">最低价：' +
                      min +
                      "</span>",
                  };
                }) as any,
              ]}
              shape="candle"
            />
          </View>
          <View
            start={{
              x: 0,
              y: 0.65,
            }}
            data={dv}
            scale={{
              volume: {
                tickCount: 2,
              },
            }}
          >
            <Axis
              name="volume"
              label={{
                formatter(val) {
                  return parseInt(val, 10) / 1000 + "k";
                },
              }}
            />
            <Axis name="time" tickLine={null} label={null}/>
            <Geom
              type="interval"
              position="time*volume"
              color={[
                "trend",
                (val) => {
                  if (val === "上涨") {
                    return "#f04864";
                  }

                  if (val === "下跌") {
                    return "#2fc25b";
                  }

                  return "#ffffff";
                },
              ]}
              tooltip={[
                "time*volume",
                (time, volume) => {
                  return {
                    name: time,
                    value:
                      '<br/><span style="padding-left: 16px">成交量：' +
                      volume +
                      "</span><br/>",
                  };
                },
              ]}
              shape="candle"
            />
          </View>
        </Chart>
        <div>
          <Slider
            padding={[40, 80, 40, 80]}
            width="auto"
            // height={26}
            start={this.ds.state.start}
            end={this.ds.state.end}
            xAxis="time"
            yAxis="volume"
            // scales={{
            //   time: {
            //     type: "timeCat",
            //     nice: false,
            //   },
            // }}
            data={data}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}
