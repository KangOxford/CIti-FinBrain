import React from "react";
import {DailyPositionList} from "../../../../../models/invreq/Bought/DailyPosition";
import {Table, Card} from "antd";

interface Props {
  data: DailyPositionList;
}

export default class DailyPositionPage extends React.Component<Props, {}> {

  moneyable = (val: number) => {
    if (val === undefined) {
      return "";
    } else {
      return val.toFixed(2) + "¥";
    }
  }

  render() {
    const cols = [
      // {
      //   title: "日期",
      //   dataIndex: "date",
      //   width: 220,
      // },
      {
        title: "合约代码",
        dataIndex: "quotaId",
        render: (val, list) => {
          if (val === undefined) {
            return "";
          } else {
            return val + " " + list.quotaName;
          }
        },
        width: 250,
      },
      {
        title: "当前价",
        dataIndex: "currentValue",
        width: 170,
        render: this.moneyable,
      },
      {
        title: "持有量",
        dataIndex: "quantity",
        width: 150,
      },
      {
        title: "总额",
        dataIndex: "totalValue",
        width: 200,
        render: this.moneyable,
      },
      {
        title: "盈亏",
        dataIndex: "profitAndLoss",
        width: 170,
        render: this.moneyable,
      },
      {
        title: "费用",
        dataIndex: "serviceCharge",
        width: 170,
        render: this.moneyable,
      },
    ];

    return (
      <Card >
        <Table columns={cols}
               dataSource={this.props.data}
               size={"small"}
               scroll={{x: 800}}
        />
      </Card>
    );
  }
}
