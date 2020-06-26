import { Row, Col } from "antd";
import styled from "styled-components";
import { RowProps } from "antd/es/grid";
import React from "react";

const PaddingCol = styled(Col as any)`

  padding: 4px !important;
  
  //&:first-child {
  //  padding-left: 0 !important;
  //}
  //
  //&:last-child {
  //padding-right: 0 !important; 
  //}
`;

export default PaddingCol;
