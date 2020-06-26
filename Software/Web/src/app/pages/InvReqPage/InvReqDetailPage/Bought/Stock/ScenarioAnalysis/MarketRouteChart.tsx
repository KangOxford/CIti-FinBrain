import React from "react";
import {Card} from "antd";
import {CardFooter} from "../../Util/CardFooter";
import {Chart, Legend, Axis, Tooltip, Geom} from "bizcharts";
import DataSet from "@antv/data-set";
import {MarketRouteChartList, MarketState} from "../../../../../../models/invreq/Bought/Stock/ScenarioAnalysis";
import {SceneChart} from "../../Chart/SceneChart";
const {DataView} = DataSet;

interface Props {
  data: MarketRouteChartList;
}

// 市道切分图
export class MarketRouteChart extends React.Component<Props, {}> {
  render() {
    const maxNum = 14000;

    // add a value, change to chinese
    let dataList = [];
    dataList = this.props.data;
    for (let item of dataList) {
      item.defaultVal = maxNum;
      switch (item.marketState) {
        case MarketState.OBVIOUS_UP:
          item.marketState = "市道显著上升";
          break;
        case MarketState.OBVIOUS_DOWN:
          item.marketState = "市道显著下降";
          break;
        case MarketState.WAVERY_UP:
          item.marketState = "市道震荡上升";
          break;
        case MarketState.WAVERY_DOWN:
          item.marketState = "市道震荡下降";
          break;
      }
    }

    const scale = {
      myfund: {
        alias: "净值",
        max: maxNum,
      },
      date: {
        range: [0.05, 0.95],
        tickCount: 4,
      },
    };

    const dv = new DataView();
    dv.source(dataList);

    return (
      <Card style={{overflowX: "scroll"}}
      >
        <SceneChart data={dv}
                    yName={"myfund"}
                    scale={scale}
                    typeName={"marketState"}
        />
        <CardFooter text={"市道切分图"}/>
      </Card>
    );
  }
}
