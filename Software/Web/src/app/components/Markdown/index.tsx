import React from "react";

import ReactMarkdown from "react-markdown";
import styled from "styled-components";

const Container = styled.div`
  h1, h2, h3 {
    color: #001529 !important;
  }
  
  ol, ul {
    list-style: initial;
  }
`;

export default function Markdown(props: { content: string }) {
  return <Container>
    <ReactMarkdown source={props.content}/>
  </Container>;
}
