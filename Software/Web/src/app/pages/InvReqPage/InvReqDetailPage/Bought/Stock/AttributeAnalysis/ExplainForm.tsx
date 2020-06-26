import React from "react";
import {Card, Table} from "antd";
import {CardFooter} from "../../Util/CardFooter";
import {StyleExplainList} from "../../../../../../models/invreq/Bought/Stock/AttributeAnalysis";

interface Props {
  data: StyleExplainList;
}

// 风格解释度表
export class ExplainForm extends React.Component<Props, {}> {
  render() {

    const cols = [
      {
        title: "季度",
        dataIndex: "season",
      },
      {
        title: "调整R方",
        dataIndex: "rSquare",
      },
    ];

    return(
      <Card style={{height: "480px", marginTop: "25px"}}
      >
        <Table columns={cols}
               dataSource={this.props.data}
               size={"small"}
               bordered={true}
               pagination={false}
        />
        <CardFooter text={"风格解释度表"}/>
      </Card>
    );
  }
}
