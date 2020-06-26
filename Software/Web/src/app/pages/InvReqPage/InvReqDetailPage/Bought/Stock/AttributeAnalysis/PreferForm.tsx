import React from "react";
import {Card, Table} from "antd";
import {CardFooter} from "../../Util/CardFooter";
import {PreferAndContrList} from "../../../../../../models/invreq/Bought/Stock/AttributeAnalysis";

interface Props {
  data: PreferAndContrList;
}

// 风格偏好及贡献表
export class PreferForm extends React.Component<Props, {}> {

  percentagable = (val) => {
    return val + "%";
  }

  render() {

    const cols = [
      {
        title: "风格",
        dataIndex: "style",
        width: 250,
      },
      {
        title: "大盘成长",
        dataIndex: "largeGrowth",
        width: 170,
      },
      {
        title: "大盘价值",
        dataIndex: "largeValue",
        width: 170,
      },
      {
        title: "中盘成长",
        dataIndex: "middleGrowth",
        width: 170,
      },
      {
        title: "中盘价值",
        dataIndex: "middleValue",
        width: 170,
      },
      {
        title: "小盘价值",
        dataIndex: "smallGrowth",
        width: 170,
      },
      {
        title: "小盘价值",
        dataIndex: "smallValue",
        width: 170,
      },
    ];

    return(
      <Card  style={{ height: "480px", marginTop: "25px"}}
      >
        <Table columns={cols}
               style={{marginTop: "50px"}}
               dataSource={this.props.data}
               pagination={false}
               bordered={true}
               scroll={{x: 700}}
               footer={() => <p style={{color: "#9e9e9e"}}>
                 该图反映了产品超配/低配其风格所带来的收益，超额贡献最大来自于大盘成长，其中正向贡献主要来自小盘成长，负向贡献主要来自小盘成长</p>}
        />
        <CardFooter text={"风格偏好及贡献表"}/>
      </Card>
    );
  }
}
