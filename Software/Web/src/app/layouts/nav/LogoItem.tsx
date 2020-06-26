
import { Link } from "react-router-dom";
import React from "react";
import styled from "styled-components";
import SvgImg from "../../components/SvgImg";

const CenterDiv = styled.div`
  display: flex;
  align-items: center;
  margin-left: 12px;
  height: 60px;

  text {
    color: ${(props: LogoItemProps) => props.textColor || "white"};
    //font-size: 68px;
  }

`;

interface LogoItemProps {
  textColor?: string;
}

export function LogoItem(props: LogoItemProps) {
  return (
    <CenterDiv {...props}>
      <text>FinBrain</text>
      {/*<SvgImg width={120} height={35} filePath={"tag_x00_logo_landscape_with_texts.svg"}/>*/}
    </CenterDiv>
  );
}
