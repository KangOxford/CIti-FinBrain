import React from "react";
import { Inject } from "react.di";
import { QuotationService } from "../../../api/QuotationService";
import { QuotationChart } from "../QuotationChart";
import { AsyncComponent } from "../../../routing/AsyncComponent";
import Loading from "../../../components/Loading";
import { Row, Col, Card } from "antd";

interface Props {

}

export default class BondQuotation extends React.Component<Props, {}> {
  @Inject quotationService: QuotationService;

  renderItem = async () => {
    const data = await this.quotationService.getBondQuotationData();

    return <Card>
      <h1>国债 债券市场表现</h1>
      <QuotationChart data={data}/>
    </Card>;
  }

  render() {
    return <AsyncComponent render={this.renderItem} componentWhenLoading={<Loading/>}/>;

  }
}
