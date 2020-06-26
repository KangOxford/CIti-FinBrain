import React from "react";
import styled from "styled-components";
import {Row, Col} from "antd";
import {ConfigChart} from "./ConfigChart";
import {ConfigForm} from "./ConfigForm";
import {ExposeChart} from "./ExposeChart";
import {ExplainForm} from "./ExplainForm";
import {PreferChart} from "./PreferChart";
import {PreferForm} from "./PreferForm";
import {AsyncComponent} from "../../../../../../routing/AsyncComponent";
import {InvReq} from "../../../../../../models/invreq/InvReq";
import {Inject} from "react.di";
import {StockAnalysisService} from "../../../../../../api/StockAnalysisService";
import Loading from "../../../../../../components/Loading";

interface Props {
  invreq: InvReq;
}

const Container = styled.div`
  //margin: 10px;
`;

export default class AttributeAnalysis extends React.Component<Props, {}> {
  @Inject service: StockAnalysisService;

  renderItem = async () => {

    const InvreqId = this.props.invreq.invreqId;
    const attributeData = await this.service.getReason(InvreqId);

    return (
      <Container>
        <ConfigChart data={attributeData.styleConfigChart}/>
        <ConfigForm data={attributeData.styleConfigForm}/>
        <Row>
          <Col sm={24} md={16}>
            <PreferForm data={attributeData.preferAndContributionChart}/>
          </Col>
          <Col sm={24} md={8}>
            <ExplainForm data={attributeData.styleExplainForm}/>
          </Col>
        </Row>
      </Container>
    );
  }

  render() {
    return <AsyncComponent render={this.renderItem} componentWhenLoading={<Loading/>}/>;
  }
}
