import React from "react";
import styled from "styled-components";
import observer from "mobx-react";
import {Collapse, Row, Col, Card, Table} from "antd";
import { LocaleMessage, LocaleStore } from "../../../../../../internationalization/index";
import lang from "../../../../../../internationalization/LocaleStore/lang";
import { Inject } from "react.di";
import { Link } from "react-router-dom";
import { InvreqService } from "../../../../../../api/InvreqService";
import { AsyncComponent } from "../../../../../../routing/AsyncComponent";
import { CompareChart } from "./CompareChart";
import { RouteComponentProps } from "react-router";
import { InvReq } from "../../../../../../models/invreq/InvReq";
import { TranType } from "../../../../../../models/invreq/Bought/TransactionLog";

const column = [
  {
    title: "合约代码",
    dataIndex: "quotaName",
    width: 400,
    render: (val, list) => {
      if (val !== undefined) {
        return val + " " + list.quotaId;
      } else {
        return "";
      }
    },
  },
  {
    title: "上期(%)",
    dataIndex: "lastMatching",
    width: 150,
  },
  {
    title: "本期(%)",
    dataIndex: "matching",
    width: 150,
  },
];

interface Props extends RouteComponentProps<{ date: string}> {
  invreq: InvReq;
}

const StyledRow = styled(Row as any)`
  & > * {
    
  }
`;

export default class ReallocationDetail extends React.Component<Props, {}> {
  @Inject service: InvreqService;

  renderItem = async () => {
    const { invreqId } = this.props.invreq;
    const { date } = this.props.match.params;
    const reallocationData = await this.service.getReallocationLog(invreqId);
    const realData =  await this.service.getReallocation(invreqId, date);
    const tranData = await this.service.getDailyTransaction(invreqId, realData.tranDate);
    const dailyTran = tranData[0].children;

    return (
      <Card>
        <StyledRow gutter={8}>
          <Col md={15} sm={24}>

            <Collapse accordion={true}>

              <Collapse.Panel
                header={<p>股票市场
                  <Link style={{float: "right", marginRight: "20px"}}
                        to={`/invreq/${invreqId}/position/reallocation/${realData.tranDate}/STOCK`}>
                    查看交易</Link>
                  </p>} key={"1"}>
                <Table size={"small"}
                       dataSource={dailyTran.filter((x) => x.type === TranType.STOCK)}
                       pagination={{pageSize: 10}}
                       columns={column}

                />
              </Collapse.Panel>

              <Collapse.Panel header={<p>债券市场
                <Link style={{float: "right", marginRight: "20px"}}
                      to={`/invreq/${invreqId}/position/reallocation/${realData.tranDate}/BOND`}>
                  查看交易</Link>
              </p>} key={"2"}>
                <Table size={"small"}
                       dataSource={dailyTran.filter((x) => x.type === TranType.BOND)}
                       pagination={false}
                       columns={column}/>
              </Collapse.Panel>
              <Collapse.Panel header={<p>商品市场
                <Link style={{float: "right", marginRight: "20px"}}
                      to={`/invreq/${invreqId}/position/reallocation/${realData.tranDate}/PRODUCT`}>
                  查看交易</Link>
              </p>} key={"3"}>
                <Table size={"small"}
                       dataSource={dailyTran.filter((x) => x.type === TranType.GOODS)}
                       pagination={false}
                       columns={column}/>
              </Collapse.Panel>
            </Collapse>

          </Col>

          <Col md={9} sm={24}>
            <CompareChart data={reallocationData}/>
          </Col>
        </StyledRow>
      </Card>
    );
  }

  render() {
    return <AsyncComponent render={this.renderItem}/>;
  }
}
