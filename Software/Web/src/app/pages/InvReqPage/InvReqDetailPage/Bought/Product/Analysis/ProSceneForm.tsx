import React from "react";
import {Table} from "antd";
import {SceneDatas} from "../../../../../../models/invreq/Bought/Product/ProductAnalysis";

interface Props {
  data: SceneDatas;
}

export class SceneForm extends React.Component<Props, {}> {
  percentage = (val: number) => {
    return + val.toFixed(2) + "%";
  }
  render() {

    const cols = [
      {
        title: "类型",
        dataIndex: "type",
      },
      {
        title: "周数",
        dataIndex: "weekNum",
      },
      {
        title: "夏普比率",
        dataIndex: "sharpeRatio",
      },
      {
        title: "Calmar比率",
        dataIndex: "calmarRatio",
      },
      {
        title: "最大周收益率",
        dataIndex: "maxWeekIncomeRatio",
        render: this.percentage,
      },
      {
        title: "最小周收益率",
        dataIndex: "minWeekIncomeRatio",
        render: this.percentage,
      },
      {
        title: "波动率",
        dataIndex: "fluctuationRatio",
        render: this.percentage,
      },
      {
        title: "最大回撤",
        dataIndex: "maxDrawdown",
        render: this.percentage,
      },
    ];

    return (
      <Table columns={cols}
             dataSource={this.props.data}
             size={"small"}
             bordered={true}
             pagination={false}
             scroll={{x: 700}}
      />
    );
  }
}
