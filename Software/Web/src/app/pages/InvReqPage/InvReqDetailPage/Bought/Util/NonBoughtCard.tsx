import React from "react";
import {Card, Icon} from "antd";

export class NonBoughtCard extends React.Component<{}, {}> {
  render() {
    return (
      <Card style={{textAlign: "center", height: "750px", paddingTop: "150px"}}>
        <Icon type="info-circle" theme="outlined" style={{fontSize: "200px", color: "#ffeeb6"}}/>
        <p style={{fontSize: "30px", margin: "40px"}}>您尚未购买该产品</p>
      </Card>
    );
  }
}
