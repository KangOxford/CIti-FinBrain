import React from "react";
import {AsyncComponent} from "../../../../../../routing/AsyncComponent";
import {Inject} from "react.di";
import {InvReq} from "../../../../../../models/invreq/InvReq";
import {Card, Row, Col} from "antd";
import {BondAnalysisService} from "../../../../../../api/BondAnalysisService";
import {CardFooter} from "../../Util/CardFooter";
import {PredictValueChart} from "../PredictValueChart";
import {RiskIndicatorForm} from "./RiskIndicatorForm";
import Loading from "../../../../../../components/Loading";

interface Props {
  invreq: InvReq;
}

export default class CreditBondPage extends React.Component<Props, {}> {
  @Inject service: BondAnalysisService;

  renderItem = async () => {
    const invreqId = this.props.invreq.invreqId;
    const creditData = await this.service.getCredictBond(invreqId);

    return(
      <div>
        <Card>
          <PredictValueChart data={creditData.predictValue}/>
          <CardFooter text={"信用债估价表"}/>
        </Card>
        <Card>
          <RiskIndicatorForm data={creditData.riskIndicator}/>
          <CardFooter text={"信用债风险指标表"}/>
        </Card>
      </div>
    );
  }

  render() {
    return <AsyncComponent render={this.renderItem} componentWhenLoading={<Loading/>}/>;
  }
}
