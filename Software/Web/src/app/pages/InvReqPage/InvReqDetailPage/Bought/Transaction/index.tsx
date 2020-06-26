import React from "react";
import { InvReq } from "../../../../../models/invreq/InvReq";
import { Card } from "antd";
import { Inject } from "react.di";
import { TransactionLogPage } from "../Util/TransactionLogPage";
import { AsyncComponent } from "../../../../../routing/AsyncComponent";
import { InvreqService } from "../../../../../api/InvreqService";

interface Props {
  invreq: InvReq;
}

export default class TransactionPage extends React.Component<Props, {}> {
  @Inject service: InvreqService;

  renderItem = async () => {
    const { invreqId } = this.props.invreq;
    const tranData = await this.service.getTransactionLog(invreqId);
    return (
      <Card >
        <TransactionLogPage scrollHeight={550} data={tranData}/>
      </Card>
    );
  }

  render() {
    return <AsyncComponent render={this.renderItem}/>;
  }
}
