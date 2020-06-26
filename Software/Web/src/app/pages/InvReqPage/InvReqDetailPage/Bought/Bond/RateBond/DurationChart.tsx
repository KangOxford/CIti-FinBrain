import React from "react";
import {RateDurationList} from "../../../../../../models/invreq/Bought/Bond/BondAnalysis";
import {LineChart} from "../../Chart/LineChart";
import DataSet from "@antv/data-set";

const {DataView} = DataSet;

interface Props {
  data: RateDurationList;
}

export class DurationChart extends React.Component<Props, {}> {
  render() {

    const dv = new DataView();
    dv.source(this.props.data)
      .transform(
        {
          type: "rename",
          map: {
            fixedDuration: "估价修正久期",
          },
        },
      );

    const scale = {
      season: {
        alias: "季度",
      },
    };

    return(
      <LineChart height={350}
                 data={dv}
                 xName={"season"}
                 yName={"估价修正久期"}
                 color={"#396add"}
                 scale={scale}
      />
    );
  }
}
