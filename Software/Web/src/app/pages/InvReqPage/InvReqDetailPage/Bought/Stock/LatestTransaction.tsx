import React from "react";
import styled from "styled-components";
import observer from "mobx-react";
import {Card, Button} from "antd";
import { LocaleMessage, LocaleStore } from "../../../../../internationalization/index";
import lang from "../../../../../internationalization/LocaleStore/lang";
import { Inject } from "react.di";
import { Link } from "react-router-dom";
import {TransactionLog} from "../../../../../models/invreq/Bought/TransactionLog";
import {TransactionLogPage} from "../Util/TransactionLogPage";

interface Props {
  data: TransactionLog;
  invreqId: string;
}

export class LatestTransaction extends React.Component<Props, {}> {
  render() {
    const { data, invreqId } = this.props;
    return (
      <Card title={"最近交易"}
            extra={<Button style={{float: "right"}}>
              <Link to={`/invreq/${invreqId}/transactions`}>详情</Link></Button>}
            style={{ marginTop: "25px"}} >
        <TransactionLogPage scrollHeight={150} data={data}/>
      </Card>
    );
  }
}
