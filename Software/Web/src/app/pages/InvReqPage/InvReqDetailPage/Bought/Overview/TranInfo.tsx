import React from "react";
import styled from "styled-components";
import {observer} from "mobx-react";
import {Col, Row, Button, Table} from "antd";
import { LocaleMessage, LocaleStore } from "../../../../../internationalization/index";
import lang from "../../../../../internationalization/LocaleStore/lang";
import { Inject } from "react.di";
import {Action, TransactionDetailList, TranType} from "../../../../../models/invreq/Bought/TransactionLog";

interface Props {
  data: TransactionDetailList;
}

const columns = [
  // {
  //   title: "时间",
  //   dataIndex: "time",
  //   width: 120,
  // },
  {
    title: "种类",
    dataIndex: "type",
    width: 100,
    render: (val) => {
      if (val === TranType.STOCK) {
        return "股票";
      } else if (val === TranType.BOND) {
        return "债券";
      } else {
        return "商品市场";
      }
    } ,
  },
  {
    title: "合约代码",
    dataIndex: "quotaName",
    width: 250,
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
    width: 120,
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

export class TranInfo extends React.Component<Props, {}> {
  render() {
    return (
      <Table dataSource={this.props.data}
             columns={columns}
             size={"small"}
             bordered={true}
             pagination={false}
             scroll={{y: 100, x: 700}}
             style={{ paddingTop: "10px" }}
      />
    );
  }
}
