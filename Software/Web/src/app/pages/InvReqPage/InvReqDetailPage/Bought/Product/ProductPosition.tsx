import React from "react";
import { Card } from "antd";
import { DetailQuotation } from "../../../../../models/quotation/DetailQuotation";

interface Props {
  quotation: DetailQuotation;
}

export class ProductPosition extends React.Component<Props, {}> {
  render() {
    return (
      <Card title={"当前持仓"} style={{height: "362px"}}>
        <div>{this.props.quotation.quotaName} 标的信息和走势图</div>
      </Card>
    );
  }
}
