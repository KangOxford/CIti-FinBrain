import React from "react";
import {Table} from "antd";
import {CreditRiskIndicatorList} from "../../../../../../models/invreq/Bought/Bond/BondAnalysis";
interface Props {
  data: CreditRiskIndicatorList;
}

export class RiskIndicatorForm extends React.Component<Props, {}> {

  percentage = (val: number) => {
    return val.toFixed(2) + "%";
  }

  render() {
    const cols = [
      {
        title: "季度",
        dataIndex: "season",
      },
      {
        title: "估价修正久期",
        dataIndex: "fixedDuration",
        render: this.percentage,
      },
      {
        title: "资产负债率",
        dataIndex: "liability",
        render: this.percentage,
      },
      {
        title: "现金流量比率",
        dataIndex: "cashFlow",
        // render: this.percentage,
      },
      {
        title: "信用评级",
        dataIndex: "creditRate",
      },
    ];

    return (
      <Table columns={cols}
             dataSource={this.props.data}
             pagination={{ position: "bottom"}}
             bordered={true}
             scroll={{x: 550}}
      />
    );
  }
}
