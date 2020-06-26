import React, { ReactNode } from "react";
import { Card, Col } from "antd";
import styled from "styled-components";

interface Props {
  prompt: string;
  data: any;
  className?: string;
  fontSize?: number;
}

const Prompt = styled.p`
  color: #979797;
`;

const Data = styled.p`
  font-size: 25px;
  color: #001529;
  margin-top: 10px;
  //margin-left: 20px;
`;

export class DataCard extends React.Component<Props, {}> {
  render() {
    return(
      <Card className={this.props.className}>
        <Prompt>{this.props.prompt}</Prompt>
        <Data style={{fontSize: this.props.fontSize,
        }}>{this.props.data}</Data>
      </Card>
    );
  }
}
