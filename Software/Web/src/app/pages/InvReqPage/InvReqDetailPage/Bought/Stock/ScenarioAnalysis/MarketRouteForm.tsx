import React from "react";
import {Card, Table} from "antd";
import {CardFooter} from "../../Util/CardFooter";
import {MarketRouteFormList} from "../../../../../../models/invreq/Bought/Stock/ScenarioAnalysis";

interface Props {
  data: MarketRouteFormList;
}

// 特殊场景分析图
export class MarketRouteForm extends React.Component<Props, {}> {

  handleNull = (val: string) => {
    if (val === null) {
      return "--";
    } else {
      return val;
    }
  }

  render() {

    const cols = [
      {
        title: "指标",
        dataIndex: "index",
        width: 270,
      },
      {
        title: "市场显著上升",
        dataIndex: "obviousUp",
        width: 200,
        render: this.handleNull,
      },
      {
        title: "市场震荡上升",
        dataIndex: "waveryUp",
        width: 200,
        render: this.handleNull,
      },
      {
        title: "市场显著下降",
        dataIndex: "obviousDown",
        width: 200,
        render: this.handleNull,
      },
      {
        title: "市场震荡下降",
        dataIndex: "waveryDown",
        width: 200,
        render: this.handleNull,
      },
    ];
    return (
      <Card style={{marginTop: "25px"}}
      >
        <Table columns={cols}
               dataSource={this.props.data}
               pagination={false}
               bordered={true}
               scroll={{x: 700}}
               footer={() => <p style={{color: "#9e9e9e"}}>该产品在统计区间内的主要收益来源为市场显著上升，其次的收益来源为市场震荡上升</p>}
        />
        <CardFooter text={"市道切分表"}/>
      </Card>
    );
  }
}
