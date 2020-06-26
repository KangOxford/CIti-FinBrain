import React from "react";
import {Col, Row, Card} from "antd";
import { DoubleLineChart } from "../Bought/Chart/DoubleLineChart";
import {EarningList} from "../../../../models/invreq/Bought/EarnList";
import DataSet from "@antv/data-set";
interface Props {
  earnList: EarningList;
}

export class EarnAndRisk extends React.Component<Props> {
  render() {
    const {DataView} = DataSet;

    const dv = new DataView();
    dv.source(this.props.earnList)
      .transform(
        {
          type: "rename",
          map: {
            straEarning: "策略收益",
            baseEarning: "基准收益",
          },
        },
      )
      .transform(
        {
          type: "fold",
          fields: ["策略收益", "基准收益"],
          key: "key",
          value: "val",
          retains: ["date"],
        },
      );

    return (
      <Card title={"收益与风险"}>
        <DoubleLineChart data={dv}/>
      </Card>
    );
  }
}
