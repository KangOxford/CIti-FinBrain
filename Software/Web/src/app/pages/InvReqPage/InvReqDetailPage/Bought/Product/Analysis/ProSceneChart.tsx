import React from "react";
import {
  SceneAnalysisResponse, TotalIncomeRatioList,
} from "../../../../../../models/invreq/Bought/Product/ProductAnalysis";
import {SceneChart} from "../../Chart/SceneChart";
import DataSet from "@antv/data-set";
const {DataView} = DataSet;

interface Props {
  data: TotalIncomeRatioList;
}

export class ProSceneChart extends React.Component<Props, {}> {
  percentage = (val: number) => {
    return val.toFixed(2) + "%";
  }
  render() {

    const maxNum = 100;

    // add a value, change to chinese

    const dataList = this.props.data.map((x) => ({...x, defaultVal: maxNum }));

    const scale = {
      totalIncomeRatio: {
        alias: "组合收益率",
        max: maxNum,
        formatter: (val) => {
          return val.toFixed(2) + "%";
        },
      },
      date: {
        range: [0.05, 0.95],
      },
    };

    const dv = new DataView();
    dv.source(dataList);
    console.log(dv);

    return (
      <SceneChart data={dv}
                  yName={"totalIncomeRatio"}
                  scale={scale}
                  typeName={"type"}
      />
    );
  }
}
