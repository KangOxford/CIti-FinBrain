import React from "react";

import TOS from "../../../assets/tos.md";
import styled from "styled-components";
import Markdown from "../../components/Markdown";

interface Props {

}

const Container = styled.div`
  background: white;
  padding: 32px;
  max-width: 800px;
  margin: 4px auto;
  
    line-height: 28px;
  
  h1, h2, h3 {
    color: #001529 !important;
    margin: 8px 0 !important;
  }

`;

const InnerContainer = styled.div`

`;

export default class TermOfServicePage extends React.Component<Props, {}> {
  render() {
    return <Container>
      <Markdown content={TOS}/>
    </Container>;
  }
}
