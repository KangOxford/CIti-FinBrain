import React from "react";
import styled from "styled-components";
import {MarketRouteChart} from "./MarketRouteChart";
import {MarketRouteForm} from "./MarketRouteForm";
import {SensibilityChart} from "./SensibilityChart";
import {InvReq} from "../../../../../../models/invreq/InvReq";
import {Inject} from "react.di";
import {StockAnalysisService} from "../../../../../../api/StockAnalysisService";
import {AsyncComponent} from "../../../../../../routing/AsyncComponent";

const Container = styled.div`
  //margin: 25px;
`;

interface Props {
  invreq: InvReq;
}

export default class ScenarioAnalysis extends React.Component<Props, {}> {
  @Inject service: StockAnalysisService;

  renderItem = async () => {
    const InvreqId = this.props.invreq.invreqId;
    const sceneData = await this.service.getScene(InvreqId);
    console.log(sceneData);

    return (
      <Container>
        <MarketRouteChart data={sceneData.marketRouteChart}/>
        <MarketRouteForm data={sceneData.marketRouteForm}/>
        <SensibilityChart data={sceneData.sensibilityChart}/>
      </Container>
    );
  }

  render() {
    return <AsyncComponent render={this.renderItem}/>;
    // return <h3>未配置股票市场</h3>;
  }
}
