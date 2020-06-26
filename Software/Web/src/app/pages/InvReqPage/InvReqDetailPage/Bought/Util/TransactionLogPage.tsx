import React from "react";
import { InvReq } from "../../../../../models/invreq/InvReq";
import styled from "styled-components";
import observer from "mobx-react";
import {Col, Row, Table, Card} from "antd";
import { LocaleMessage, LocaleStore } from "../../../../../internationalization/index";
import lang from "../../../../../internationalization/LocaleStore/lang";
import { Inject } from "react.di";
import {Action, TranType} from "../../../../../models/invreq/Bought/TransactionLog";

interface Props {
  scrollHeight: number;
  data: any;
}

const columns = [
  {
    title: "时间",
    dataIndex: "time",
    // TODO sorter: (a,b) => a.time - b.time,
    width: 300,
  },
  {
    title: "种类",
    dataIndex: "type",
    width: 150,
    render: (val) => {
      if (val === TranType.STOCK) {
        return "股票";
      } else if (val === TranType.BOND) {
        return "债券";
      } else if (val === TranType.GOODS) {
        return "商品市场";
      }
      return "";
    } ,
  },
  {
    title: "合约代码",
    dataIndex: "quotaName",
    width: 270,
    render: (val, list) => {
      if (val !== undefined) {
        return val + " " + list.quotaId;
      } else {
        return "";
      }
    },
  },
  {
    title: "买进/卖出",
    dataIndex: "buyOrSale",
    width: 150,
    render: (val) => {
      if (val === Action.BUY) {
        return "买进";
      } else if (val === Action.SALE) {
        return "卖出";
      }
      return "";
    },
  },
  {
    title: "成交量",
    dataIndex: "quantity",
    width: 150,
    render: (val) => {
      if (val !== undefined) {
        return val + "股";
      }
      return "";
    },
  },
  {
    title: "成交价",
    dataIndex: "price",
    width: 150,
    render: (val) => {
      if (val !== undefined) {
        return val.toFixed(2) + "¥";
      }
      return "";
    },
  },
  {
    title: "交易额",
    dataIndex: "totalPrice",
    width: 150,
    render: (val) => {
      if (val !== undefined) {
        return val.toFixed(2) + "¥";
      }
      return "";
    },
  },
];

export class TransactionLogPage extends React.Component<Props, {} > {
  render() {
    return (
      <Table columns={columns}
             dataSource={this.props.data}
             pagination={{pageSize: 16}}
             scroll={{x: 700}}
             size={"small"} />
    );
  }
}
