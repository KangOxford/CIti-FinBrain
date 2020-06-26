import React, { ReactNode } from "react";
import styled from "styled-components";

const Title = styled.h1`
  text-align: center;
  margin: 30px;
`;

interface Props {
  title: ReactNode;
  children: ReactNode;
}

export default function BigContainer({ title, children}: Props) {
  return <div>
    <Title>{title}</Title>
    {children}
  </div>;
}
