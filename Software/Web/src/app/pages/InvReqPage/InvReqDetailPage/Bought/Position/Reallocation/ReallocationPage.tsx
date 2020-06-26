import React from "react";
import { ReallocationLogPage } from "../../Util/ReallocationLogPage";
import { Card } from "antd";
import { InvReq } from "../../../../../../models/invreq/InvReq";
import { Inject } from "react.di";
import { AsyncComponent } from "../../../../../../routing/AsyncComponent";
import { InvreqService } from "../../../../../../api/InvreqService";

interface Props {
  invreq: InvReq;
}

export default class ReallocationPage extends React.Component<Props, {}> {
  @Inject service: InvreqService;

  renderItem = async () => {

    const {invreqId} = this.props.invreq;
    const reallocationData = await this.service.getReallocationLog(invreqId);

    return (
      <Card>
        <ReallocationLogPage invreqId={invreqId}
                             columnWidth={200}
                             data={reallocationData}
        />
      </Card>
    );
  }

  render() {
    return <AsyncComponent render={this.renderItem}/>;
  }
}
