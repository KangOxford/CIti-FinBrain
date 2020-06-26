import React from "react";
import styled from "styled-components";
import observer from "mobx-react";
import { Col, Row, Select, Table, Card } from "antd";
import { LocaleMessage, LocaleStore } from "../../../../../internationalization/index";
import lang from "../../../../../internationalization/LocaleStore/lang";
import { Inject } from "react.di";
import { MatchingPage } from "../Util/MatchingPage";
import { MatchingList } from "../../../../../models/invreq/Bought/MatchingList";
import PaddingCard from "../../../../../components/PaddingLayouts/PaddingCard";

interface Props {
  data: MatchingList;
}

interface State {
  key: string;
}

export class MatchingDetail extends React.Component<Props, State> {

  state = {
    key: "STOCK",
  };

  onChange = (value) => {
    this.setState({
      key: value,
    });
  }

  render() {
    return (
      <Card
        style={{height: "360px"}}
        title={"配比详情"}>
        <Select defaultValue={"STOCK"}
                style={{height: "25px", width: "120px", marginBottom: "30px"}} onChange={this.onChange} >
          <Select.Option value={"STOCK"}>股票</Select.Option>
          <Select.Option value={"BOND"}>债券</Select.Option>
          <Select.Option value={"GOODS"}>商品市场</Select.Option>
        </Select>

        <MatchingPage data={this.props.data.filter((x) => x.type === this.state.key)}/>
      </Card>
    );
  }
}
