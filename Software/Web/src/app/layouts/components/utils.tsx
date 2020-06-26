import styled from "styled-components";
import { CSSProperties } from "react";
import { Layout } from "antd";
import { layoutConstants } from "./constants";
const { Header } = Layout;

export const NavItem = styled.div`
    float: right;
    display: inline-flex;
    align-items: center;
    height: ${layoutConstants.headerHeight}px;
    margin-left: 8px;
    margin-right: 8px;
`;

export const MarginedDiv = styled.div`

  display: flex;
  align-items: center;
  & > * {
  margin-right: 4px;
  margin-left: 4px;
  //display: inline-block;
  }

  &:first-child {
    margin-left: 0px;
  }

  &:last-child {
  margin-right: 0px;
  }
`;

export const LogoContainer = styled.div`
  padding-top: 16px;
  padding-left: 24px;
  span {
    color: #ffffff;
  }
  img {
    margin-right: 8px;
    width: 45px;
    height: 41px;
  }
`;

export const Row = styled(Header)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: ${layoutConstants.headerHeight}px;
    background: #405AB9;
    padding: 16px 16px;

`;

export const LeftDiv = styled.div`
    display: flex;
    align-items: center;
    @media (max-width: ${layoutConstants.sidebarBreakpoint}px) {
        width: 100%;
        justify-content: space-between;
    }

`;

export const DropdownContainer = styled.div`
    &:hover {
        cursor: pointer;
    }
    .ant-popover-inner-content {
      padding: 0 !important;
    }

`;

export const MobileNavContainer = styled.div`
    //display: inline;
    &> * {
    margin-right: 24px;
    display: inline;
    }
    @media (min-width: ${layoutConstants.sidebarBreakpoint}px) {
      display: none;
    }
`;

export const SvgImgContainer = styled.div`
    height: ${layoutConstants.headerHeight}px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    &:hover {
      cursor: pointer;
    }

`;

export const RightDiv = styled.div`
    @media (max-width: ${layoutConstants.sidebarBreakpoint}px) {
        display: none;
    }
`;

export const IndicatorContainer = styled.p`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const dropdownMenuStyle: CSSProperties = {
  width: "256px",
  textAlign: "center",
};

export const horizontalMenuStyle: CSSProperties = {
  lineHeight: `${layoutConstants.headerHeight}px`,
};
