import React from "react";
import styled from "styled-components";
import observer from "mobx-react";
import {Col, Row, Button, Card} from "antd";
import { LocaleMessage, LocaleStore } from "../../../../../internationalization/index";
import lang from "../../../../../internationalization/LocaleStore/lang";
import { Inject } from "react.di";
import {ReallocationLogPage} from "../Util/ReallocationLogPage";
import { Link } from "react-router-dom";
import {ReallocationLog} from "../../../../../models/invreq/Bought/ReallocationLog";
import {ReallocationChart} from "../Chart/ReallocationChart";
import PaddingCol from "../../../../../components/PaddingLayouts/PaddingCol";
import PaddingCard from "../../../../../components/PaddingLayouts/PaddingCard";

interface Props {
  data: ReallocationLog;
  invreqId: string;
}

const GraphContainer = styled.div`
  padding: 10px;
`;

export class LatestReallocation extends React.Component<Props, {}> {
  render() {
    return (
      <Card title={"最近调仓"}
            // style={{marginTop: "25px"}}
            // extra={<Button style={{float: "right"}}>
            //   <Link to={"./reallocation"}>详情</Link>
            // </Button>}>
        >
        <Row>
          <Col xl={9} md={24} sm={24} xs={24}>
            <GraphContainer>
              <ReallocationChart data={this.props.data}/>
            </GraphContainer>
          </Col>

          <Col xl={15} md={24} sm={24} xs={24} style={{marginTop: "10px"}}>
            <ReallocationLogPage invreqId={this.props.invreqId} columnWidth={120} data={this.props.data}/>
          </Col>
        </Row>
      </Card>
    );
  }
}
