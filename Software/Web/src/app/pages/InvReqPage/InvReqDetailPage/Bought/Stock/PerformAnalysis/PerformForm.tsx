import React from "react";
import {Card, Table} from "antd";
import {CardFooter} from "../../Util/CardFooter";
import {PerformFormList} from "../../../../../../models/invreq/Bought/Stock/PerformAnalysis";

interface Props {
  data: PerformFormList;
}

// 超额动态回撤和超额收益率表
export class PerformForm extends React.Component<Props, {}> {

  percentagable = (val: string) => {
    if (val === null) {
      return "--";
    } else {
      return val + "%";
    }
  }

  render() {

    const cols = [
      {
        title: "名称",
        dataIndex: "quotaName",
        width: 200,
      },
      {
        title: "周期数(月)",
        dataIndex: "period",
        width: 120,
        render: (val) => {
          if (val === null) {
            return "--";
          } else {
            return val ;
          }
        },
      },
      {
        title: "累计超额收益率",
        dataIndex: "totalRevenue",
        render: this.percentagable,
        width: 170,
      },
      {
        title: "月胜率",
        dataIndex: "monthly",
        render: this.percentagable,
        width: 120,
      },
      {
        title: "超额最大回撤率",
        dataIndex: "maxReturn",
        render: this.percentagable,
        width: 150,
      },
      {
        title: "超额最大回撤起止日",
        dataIndex: "maxReturnBegin",
        width: 250,
        render: (val, list) => {
          if (val === null) {
            return "--";
          } else {
            return val + " ~ " + list.maxReturnEnd;
          }
        },
      },
      {
        title: "超额最大回撤补期(天)",
        dataIndex: "maxReturnSupplement",
        render: (val) => {
          if (val === null) {
            return "--";
          } else {
            return val ;
          }
        },
        width: 190,
      },
    ];

    return (
      <Card style={{marginTop: "25px"}}
      >
        <Table
          columns={cols}
          dataSource={this.props.data}
          bordered={true}
          pagination={{ position: "bottom"}}
          scroll={{x: 700}}
        />
        <CardFooter text={"超额动态回撤和超额收益率表"}/>
      </Card>
    );
  }
}
