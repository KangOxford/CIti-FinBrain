import React from "react";
import styled from "styled-components";
import { Icon } from "antd";
import { layoutConstants } from "./constants";
import { IconProps } from "antd/es/icon";
import HeaderItemContainer from "./HeaderItemContainer";

interface Props extends IconProps {
  onRightPadding?: boolean;
}

export const HeaderColoredIcon = styled(Icon)`
  color: ${layoutConstants.headerIconColor};
`;

export default function HeaderIcon(props: Props) {

  const { onClick, ...rest } = props;

  return <HeaderItemContainer onClick={onClick}>
    <HeaderColoredIcon {...rest}/>
  </HeaderItemContainer>;
}
