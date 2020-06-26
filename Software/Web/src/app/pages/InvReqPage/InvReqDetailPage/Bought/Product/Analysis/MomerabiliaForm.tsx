import React from "react";
import {Table} from "antd";
import {MemorabiliaList} from "../../../../../../models/invreq/Bought/Product/ProductAnalysis";

interface Props {
  data: MemorabiliaList;
}

export class MomerabiliaForm extends React.Component<Props, {}> {
  render() {

    const cols = [
      {
        title: "情景名称",
        dataIndex: "scene",
      },
      {
        title: "情景开始时间",
        dataIndex: "startDate",
      },
      {
        title: "情景结束时间",
        dataIndex: "endDate",
      },
      {
        title: "区间收益率",
        dataIndex: "returnRatio",
      },
      {
        title: "区间最大回撤",
        dataIndex: "maxDrawdown",
      },
      {
        title: "区间波动率",
        dataIndex: "fluctuation",
      },
      {
        title: "南华市场基准",
        dataIndex: "nanhuaMarketRatio",
      },
    ];
    return (
      <Table columns={cols}
             dataSource={this.props.data}
             pagination={false}
             bordered={true}
             scroll={{x: 800}}
      />
    );
  }
}
