import React from "react";

import styled from "styled-components";

interface Props {
  sidebarShown: boolean;
  breakpoint: number;
}

const Mask = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.35);
  z-index:2;
  
  display: none;
  
  @media (max-width: ${(props: Props) => props.breakpoint}px) {
    display: ${(props: Props) => props.sidebarShown ? "initial" : "none"};
  }
  
  
`;

export default function BodyMask(props: Props) {
  return <Mask breakpoint={props.breakpoint}
               sidebarShown={props.sidebarShown} />;
}
