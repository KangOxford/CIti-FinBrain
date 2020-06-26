import { Matching, MatchingList } from "../../../../../models/invreq/Bought/MatchingList";
import React from "react";
import styled from "styled-components";
import observer from "mobx-react";
import {Col, Row, Select, Table, Card} from "antd";
import { LocaleMessage, LocaleStore } from "../../../../../internationalization/index";
import lang from "../../../../../internationalization/LocaleStore/lang";
import { Inject } from "react.di";
import { Link } from "react-router-dom";

interface Props {
  data: Matching[];
}

const columns = [
  {
    title: "名称",
    dataIndex: "quotaName",
    width: 150,
  },
  {
    title: "总价值",
    dataIndex: "totalValue",
    sorter: (a, b) => a.value - b.value,
    width: 150,
    render: (val) => {
      return val.toFixed(2) + " ¥";
    },
  },
  {
    title: "百分比",
    dataIndex: "percentage",
    sorter: (a, b) => a.percent - b.percent,
    width: 150,
    render: (val) => {
      return val.toFixed(2) + " %";
    },
  },
  // {
  //   dataIndex: "quotaId",
  //   render: (val) => <Link to={`/quotation/stock/${val}`}>详情</Link>,
  //   width: 50,
  // },
  ];

export class MatchingPage extends React.Component<Props, {}> {

  render() {
    return (
      <Table columns={columns}
             dataSource={this.props.data}
             size={"small"}
             pagination={false}
             scroll={{y: 180, x: 400}}
      />
    );
  }
}
