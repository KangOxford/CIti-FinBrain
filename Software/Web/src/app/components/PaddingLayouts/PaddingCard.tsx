import React from "react";
import { CardProps } from "antd/es/card";

import { Card } from "antd";

function PaddingCard(props: CardProps) {
  const { style, ...rest} = props;
  const newStyle = { ...style, margin: "4px"};
  return <Card {...rest} style={newStyle} />;
}

export default PaddingCard;
