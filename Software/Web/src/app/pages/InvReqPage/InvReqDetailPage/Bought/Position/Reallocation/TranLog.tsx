import React from "react";
import { InvReq } from "../../../../../../models/invreq/InvReq";
import styled from "styled-components";
import observer from "mobx-react";
import {Col, Row, Table, Card} from "antd";
import { LocaleMessage, LocaleStore } from "../../../../../../internationalization/index";
import lang from "../../../../../../internationalization/LocaleStore/lang";
import { Inject } from "react.di";
import {TransactionLogPage} from "../../Util/TransactionLogPage";
import {InvreqServiceMock} from "../../../../../../api/mock/InvreqServiceMock";
import {AsyncComponent} from "../../../../../../routing/AsyncComponent";
import { RouteComponentProps } from "react-router";
import { InvreqService } from "../../../../../../api/InvreqService";
import {TranType} from "../../../../../../models/invreq/Bought/TransactionLog";

interface RouteMatching {
  type: string;
  date: string;
}

interface Props extends RouteComponentProps<RouteMatching> {
  invreq: InvReq;
}

export default class TranLog extends React.Component<Props, {}> {
  @Inject service: InvreqService;

  renderItem = async () => {
    const { invreqId } = this.props.invreq;
    const { date } = this.props.match.params;
    const { type } = this.props.match.params;
    const tranData = await this.service.getDailyTransaction(invreqId, date);
    return (
      <Card style={{height: "750px"}} >
        <TransactionLogPage scrollHeight={550} data={tranData[0].children.filter((x) => x.type === type )}/>
      </Card>
    );
  }

  render() {
    return <AsyncComponent render={this.renderItem}/>;
  }
}
