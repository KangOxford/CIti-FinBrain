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
import { RouterStore } from "../../../routing/RouterStore";
import { Inject } from "react.di";
import { CardFooter } from "../../InvReqPage/InvReqDetailPage/Bought/Util/CardFooter";
import { Card } from "antd";

const {Text} = Guide;

interface Props {

}

const data = [
  {name: "国债*", benefit: 2.7, fluctuation: 2, radius: 1, color: "#48AFF2", link: "bond"},
  {name: "货币基金", benefit: 2.5, fluctuation: 3.1, color: "#4E70C3", radius: 0.2},
  {name: "中债国债总财富", benefit: 3, fluctuation: 4.5, color: "#4E70C3", radius: 0.3},
  {name: "沪深300*", benefit: 6.5, fluctuation: 13, radius: 2.7, color: "#B95C20", link: "stock"},
  {name: "标普500", benefit: 7.7, fluctuation: 14.5, radius: 0.2, color: "#4E70C3"},
  {name: "黄金", benefit: 4, fluctuation: 10, radius: 0.2, color: "#F7BF23"},
  {name: "石油现货*", benefit: 2, fluctuation: 21.67, radius: 1.8, color: "#000000", link: "goods"},
  {name: "南华工业品指数", benefit: 3, fluctuation: 23, radius: 0.2, color: "#4E70C3"},
  {name: "MSCI新兴市场", benefit: 1.5, fluctuation: 4.5, radius: 0.1, color: "#7B7C7F"},
  {name: "俄罗斯RTS", benefit: 4, fluctuation: 12, radius: 0.1, color: "#786013"},
  {name: "MSCI发达市场", benefit: 4.5, fluctuation: 11.2, radius: 0.2, color: "#4E70C3" },
  {name: "MSCI发达市场成长", benefit: 4.8, fluctuation: 13.1, radius: 0.2, color: "#4E70C3"},
  {name: "恒生小型股", benefit: 2.1, fluctuation: 23.1, radius: 0.2, color: "#4E70C3"},
];

export default class MarketOverview extends React.Component<Props, {}> {

  @Inject routerStore: RouterStore;

  onClick = (ev) => {
    if (ev.data) {
      const link = ev.data._origin.link;
      if (link) {
        this.routerStore.jumpTo(`/quotation/${link}`);
      }
    }

  }
  render() {

    const cols = {
      benefit: {
        alias: "年化收益",
      },
      fluctuation: {
        // type: "pow",
        alias: "年化波动",
      },
      name: {
        alias: "名称",
      },
    };

    return <div style={{
      // backgroundColor: "#ffffff",
      // paddingTop: "24px",
    }}>
      <Chart height={undefined}
             padding={60}
             data={data} scale={cols} forceFit={true} onPlotClick={this.onClick}>
        <Tooltip showTitle={false}/>
        <Axis
          name="fluctuation"
          label={{
            formatter: (value: any) => {
              return value + "%";
            }, // 格式化坐标轴的显示
          }}
          title={{autoRotate: false}}

        />
        <Axis name="benefit"
              title={{autoRotate: true}}
              label={{
                formatter: (value: any) => {
                  return value + "%";
                }, // 格式化坐标轴的显示
              }}
        />
        {/*<Legend reversed={true} />*/}
        <Geom
          type="point"
          position="fluctuation*benefit"
          color={"color"}
          tooltip="name*benefit*fluctuation"
          opacity={0.5}
          shape="circle"
          size={["radius", [4, 65]]}
        />
        <Guide>
          {data.map((x) =>
            <Text
              key={x.name}
              top={true} // 指定 guide 是否绘制在 canvas 最上层，默认为 false, 即绘制在最下层
              position={[x.fluctuation, x.benefit]} // 文本的起始位置，值为原始数据值，支持 callback
              content={x.name} // 显示的文本内容
              style={{
                fill: "#666", // 文本颜色
                fontSize: "16", // 文本大小
                // fontWeight: "bold", // 文本粗细
              }} // 文本的图形样式属性
              offsetX={-30} // x 方向的偏移量
              offsetY={-10} // y 方向偏移量
            />,
          )}
        </Guide>
      </Chart>
      <CardFooter text={"波动率-收益率图（点击带*号项查看对应市场情况）"}/>
    </div>;
  }
}
