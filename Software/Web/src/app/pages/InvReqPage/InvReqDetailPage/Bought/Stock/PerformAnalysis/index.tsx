import React from "react";
import styled from "styled-components";
import {PerformChart} from "./PerformChart";
import {PerformForm} from "./PerformForm";
import {AsyncComponent} from "../../../../../../routing/AsyncComponent";
import {Inject} from "react.di";
import {StockAnalysisService} from "../../../../../../api/StockAnalysisService";
import {InvReq} from "../../../../../../models/invreq/InvReq";
import Loading from "../../../../../../components/Loading";

const Container = styled.div`
  //margin: 10px;
`;

interface Props {
  invreq: InvReq;
}

export default class PerformAnalysis extends React.Component<Props, {}> {
  @Inject service: StockAnalysisService;

  renderItem = async () => {
    const {invreqId} = this.props.invreq;
    const performData = await this.service.getAchievement(invreqId);

    return (
      <Container>
        {/*<PerformChart data={performData.chartData}/>*/}
        <PerformForm data={performData.formData}/>
      </Container>);
  }

  render() {
    return <AsyncComponent render={this.renderItem} componentWhenLoading={<Loading/>}/>;
  }
}
