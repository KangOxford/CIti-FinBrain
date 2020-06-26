import React from "react";
import { Inject } from "react.di";
import { Row, Col, Card } from "antd";
import { QuotationService } from "../../../api/QuotationService";
import { QuotationChart } from "../QuotationChart";
import { AsyncComponent } from "../../../routing/AsyncComponent";
import Loading from "../../../components/Loading";

interface Props {

}

export default class GoodsQuotation extends React.Component<Props, {}> {
  @Inject quotationService: QuotationService;

  renderItem = async () => {
    const data = await this.quotationService.getGoodsQuotationData();

    return <Card>
      <h1>原油现货 商品市场表现</h1>
      <QuotationChart data={data}/>
    </Card>;
  }

  render() {
    return <AsyncComponent render={this.renderItem} componentWhenLoading={<Loading/>}/>;
  }
}
