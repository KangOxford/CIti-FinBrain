import React from "react";
import styled from "styled-components";
import observer from "mobx-react";
import {Table} from "antd";
import { LocaleMessage, LocaleStore } from "../../../../../internationalization/index";
import lang from "../../../../../internationalization/LocaleStore/lang";
import { Inject } from "react.di";
import { Link } from "react-router-dom";
import {ReallocationLog} from "../../../../../models/invreq/Bought/ReallocationLog";

interface Props {
  columnWidth: number;
  invreqId: string;
  data: ReallocationLog;
}

export class ReallocationLogPage extends React.Component<Props, {}> {
  render() {
    const { columnWidth, invreqId } = this.props;

    const columns = [
      {
        title: "日期",
        dataIndex: "tranDate",
        width: columnWidth,
      },
      {
        title: "股票配资比例",
        dataIndex: "perOfStock",
        width: columnWidth,
        render: (val, list) => {
          return val.toFixed(2) + "(" + list.changeOfStock + ")%";
        },
      },
      {
        title: "债券配资比例",
        dataIndex: "perOfBond",
        width: this.props.columnWidth,
        render: (val, list) => {
          return val.toFixed(2) + "(" + list.changeOfBond + ")%";
        },
      },
      {
        title: "商品市场配资比例",
        dataIndex: "perOfProduct",
        width: this.props.columnWidth + 20,
        render: (val, list) => {
          return val.toFixed(2) + "(" + list.changeOfProduct + ")%";
        },
      },
      // {
      //   title: "更多操作",
      //   dataIndex: "",
      //   render: (val, list) => <Link to={`/invreq/${invreqId}/position/reallocation/${list.tranDate}`}>详情</Link>,
      //   width: 100,
      // },
    ];

    return (
      <Table columns={columns}
             dataSource={this.props.data}
             size={"small"}
             style={{fontSize: "15px", textAlign: "center"}}
             pagination={{pageSize: 30}}
             scroll={{y: 250, x: 600}} />
    );
  }
}
