import React from "react";
import {Card, Table} from "antd";
import {CardFooter} from "../../Util/CardFooter";
import {StyleConfigList} from "../../../../../../models/invreq/Bought/Stock/AttributeAnalysis";

interface Props {
  data: StyleConfigList;
}

// 风格配置能力表
export class ConfigForm extends React.Component<Props, {}> {

  percentagable = (val: string) => {
    return val + "%";
  }

  render() {
    const cols = [
      {
        title: "风格",
        dataIndex: "style",
      },
      {
        title: "胜率",
        dataIndex: "winRate",
        render: this.percentagable,
      },
      {
        title: "年化收益率",
        dataIndex: "yearRevenue",
        render: this.percentagable,
      },
    ];

    return(
      <Card style={{marginTop: "25px"}}
      >
        <Table columns={cols}
               dataSource={this.props.data}
               bordered={true}
               pagination={false}
        />
        <CardFooter text={"风格配置能力表"}/>
      </Card>
    );
  }
}
