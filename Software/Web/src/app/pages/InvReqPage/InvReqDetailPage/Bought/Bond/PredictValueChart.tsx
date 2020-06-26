import React from "react";
import {PredictValueList} from "../../../../../models/invreq/Bought/Bond/BondAnalysis";
import {IntervalChart} from "../Chart/IntervalChart";
import DataSet from "@antv/data-set";
const {DataView} = DataSet;

interface Props {
  data: PredictValueList;
}

export class PredictValueChart extends React.Component<Props, {}> {
  render() {
    const dv = new DataView();
    dv.source(this.props.data)
      .transform({
        type: "rename",
        map: {
          predictValue: "估价",
        },
      });

    return(
      <IntervalChart data={dv} yLabel={"估价"}/>
    );
  }
}
