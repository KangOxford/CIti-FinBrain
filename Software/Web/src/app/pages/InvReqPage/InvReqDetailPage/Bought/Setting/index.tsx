import React from "react";
import { Col, Row } from "antd";
import { Inject } from "react.di";
import { TransactionSetting } from "./TransactionSetting";
import { ReturnSetting } from "./ReturnSetting";
import { AsyncComponent } from "../../../../../routing/AsyncComponent";
import { InvreqService } from "../../../../../api/InvreqService";
import { InvReq } from "../../../../../models/invreq/InvReq";
import {RouteComponentProps, withRouter} from "react-router";

interface Props extends RouteComponentProps<{invreqId: string}> {

}

const ignoredWithRouter = withRouter as any;
@ignoredWithRouter
export default class SettingPage extends React.Component<Props, {}> {
  @Inject service: InvreqService;

  renderItem = async () => {

    console.log(this.props);

    const { invreqId } = this.props.match.params;
    const settingData = await this.service.getBoughtTranSetting(invreqId);

    return (
      <Row>
        <Col xl={15} sm={24}>
          <TransactionSetting data={settingData} id={invreqId} beModified={true}/>
        </Col>
        <Col xl={9} sm={24}>
          <ReturnSetting id={invreqId}/>
        </Col>
      </Row>
    );
  }

  render() {
    return <AsyncComponent render={this.renderItem}/>;
  }
}
