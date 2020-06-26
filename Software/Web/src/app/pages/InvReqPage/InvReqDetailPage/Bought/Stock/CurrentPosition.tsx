import React from "react";
import { Card } from "antd";
import { MatchingPage } from "../Util/MatchingPage";
import { Matching, MatchingList } from "../../../../../models/invreq/Bought/MatchingList";

interface Props {
  data: Matching[];
}

export class CurrentPosition extends React.Component<Props, {}> {

  render() {
    return (
      <Card style={{ height: "385px"}} title={"当前持仓"}>

        <MatchingPage data={this.props.data}/>

      </Card>
    );
  }
}
