import React from "react";
import { Spin } from "antd";
import { LocaleMessage } from "../../internationalization/components";
import styled from "styled-components";

interface Props {
  size?: "small" | "default" | "large";
}

const Padding = styled.div`
  padding: 16px;
  margin-left: auto;
  margin-right: auto;
`

export default class Loading extends React.Component<Props, {}> {
  render() {
    return <Padding>
      <Spin size={this.props.size}/><LocaleMessage id={"common.loading"}/>
    </Padding>;
  }
}
