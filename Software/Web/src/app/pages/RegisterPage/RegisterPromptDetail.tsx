import React from "react";
import styled from "styled-components";
import {Row, Col, Icon} from "antd";
import {ReactNode} from "react";

interface Props {
  text: ReactNode;
}

const Prompt = styled.p`
  text-align:center;
  font-size:20px;
  color: #FFFFFF;
  margin-bottom: 50px;
  margin-top: 0px;
  padding: 0px;
`;

export const PromptComponent = (props: Props) => (
  <Row>
    <Col span={5}/>
    <Col span={1}>
      <Icon type="check-square-o" style={{fontSize: 30, color: "#FFFFFF"}}/>
    </Col>
    <Col span={12}>
      <Prompt>{props.text}</Prompt>
    </Col>
  </Row>
);
