import React from "react";
import {AsyncComponent} from "../../../../../../routing/AsyncComponent";
import {Inject} from "react.di";
import {InvReq} from "../../../../../../models/invreq/InvReq";
import {Card} from "antd";
import {BondAnalysisService} from "../../../../../../api/BondAnalysisService";
import {CardFooter} from "../../Util/CardFooter";
import {PredictValueChart} from "../PredictValueChart";
import {DurationChart} from "./DurationChart";

interface Props {
  invreq: InvReq;
}

export default class RateBondPage extends React.Component<Props, {}> {
  @Inject service: BondAnalysisService;

  renderItem = async () => {
    const invreqId = this.props.invreq.invreqId;
    const rateData = await this.service.getRatetBondData(invreqId);

    return(
      <div>
        <Card>
          <PredictValueChart data={rateData.predictValue}/>
          <CardFooter text={"利率债估价表"}/>
        </Card>
        <Card>
          <DurationChart data={rateData.duration}/>
          <CardFooter text={"利率债估价修正久期表"}/>
        </Card>
      </div>
    );
  }

  render() {
    return <AsyncComponent render={this.renderItem}/>;
  }
}
