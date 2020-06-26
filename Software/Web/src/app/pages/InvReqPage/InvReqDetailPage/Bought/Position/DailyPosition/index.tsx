import React from "react";
import DailyPositionPage from "../../Util/DailyPositionPage";
import {Inject} from "react.di";
import {InvreqService} from "../../../../../../api/InvreqService";
import {AsyncComponent} from "../../../../../../routing/AsyncComponent";
import {InvReq} from "../../../../../../models/invreq/InvReq";

interface Props {
  invreq: InvReq;
}
export default class DailyPosition extends React.Component<Props, {}> {
  @Inject service: InvreqService;

  renderItem = async () => {
    const {invreqId} = this.props.invreq;
    const positionData = await this.service.getDailyPositionList(invreqId);

    return (
      <DailyPositionPage data={positionData}/>
    );
  }

  render() {
    return <AsyncComponent render={this.renderItem}/>;
  }
}
