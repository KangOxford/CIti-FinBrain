import React from "react";
import {Row, Col, Card, Table} from "antd";
import { ProductDailyProfit, ProfitAndDrawDown } from "../../../../../../models/invreq/Bought/Product/ProductAnalysis";
import {CardFooter} from "../../Util/CardFooter";
import {ProfitChart} from "./ProfitChart";
import {TotalProfitChart} from "./TotalProfitChart";

interface Props {
  data: ProfitAndDrawDown;
}

export class ProfitAndDrawdown extends React.Component<Props, {}> {

  render() {

    // let profitList = [];
    // profitList = this.props.data.absoluteReturn;
    //
    // // 处理数据
    // for (let item of profitList) {
    //   item.futuresProfit = item.bonusRatio[0].ratio;
    //   item.spotProfit = item.bonusRatio[1].ratio;
    // }

    const profitList = this.props.data.absoluteReturn.map((x) => ({
      ...x,
      futuresProfit: x.bonusRatio[0].ratio,
      spotProfit: x.bonusRatio[1].ratio,
    })) as ProductDailyProfit[];

    const drawdown = [{
      maxDrawdown: this.props.data.maxDrawdown,
      startDate: this.props.data.startDate,
      endDate: this.props.data.endDate,
      days: this.props.data.days,
    }];

    const cols = [{
      title: "最大回撤",
      dataIndex: "maxDrawdown",
      render: (val) => {
        return val.toFixed(2) + "%";
      },
    }, {
      title: "最大回撤起始日期",
      dataIndex: "startDate",
    },  {
      title: "最大回撤终止日期",
      dataIndex: "endDate",
    }, {
      title: "最大回撤回补期",
      dataIndex: "days",
    }];

    return (
      <div>
        <Row>
          <Col md={13} sm={24}>
            <Card style={{textAlign: "center"}}>
              <ProfitChart data={profitList}/>
              <CardFooter text={"每日收益率"}/>
            </Card>
          </Col>
          <Col md={11} sm={24}>
            <Card>
          <TotalProfitChart data={profitList}/>
          <CardFooter text={"总收益率"}/>
        </Card>
          </Col>
        </Row>
        <Card>
          <Table columns={cols}
                 dataSource={drawdown}
                 pagination={false}
                 bordered={true}
                 scroll={{x: 500}}
          />
          <CardFooter text={"动态回撤数据表"}/>
        </Card>
      </div>
    );
  }
}
