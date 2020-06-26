import React, { ReactNode } from "react";
import { LocaleMessage } from "../../internationalization/components";
import { Link } from "react-router-dom";
import { Divider } from "antd";
import moment from "moment";
import styled, { isStyledComponent } from "styled-components";

interface Props {
  titleId: string;
  dateTime: string;
  link?: ReactNode;
  children?: ReactNode;

  onRemove(): void;
}

const RemoveIcon = styled.span`
  float: right;
  :hover {
    cursor: pointer;
  }
`;

const ChildrenContainer = styled.div`
  margin-top: 8px;
  margin-bottom: 8px;
`;

export default function BaseNotificaton(props: Props) {

  const {titleId, dateTime, link, children, onRemove} = props;


  return <li>

    <h3>
      <LocaleMessage id={titleId}/>
      <RemoveIcon title={"删除"} onClick={onRemove}>×</RemoveIcon>
    </h3>
    <p><small>{moment(dateTime).format("YYYY/M/D HH:mm:ss")}</small></p>
    <ChildrenContainer>
      {children}
    </ChildrenContainer>
    {link}
    <Divider/>
  </li>;
}
