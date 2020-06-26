import React from "react";
import { Layout as AntdLayout } from "antd";
import { BreadcrumbNav } from "./nav/BreadcrumbNav";
import styled from "styled-components";
import { layoutConstants } from "./components/constants";

const { Content } = AntdLayout;

interface Props {

}

const Layout = styled(AntdLayout)`
  @media (min-width: ${layoutConstants.paddingBreakpoint}px) {
   padding: 0 8px 8px;
  }
`;

const StyledBreadcrumbNav = styled(BreadcrumbNav)`
  margin: 4px 4px 4px 4px !important;

  @media (max-width: ${layoutConstants.paddingBreakpoint}px) {
   padding-left: 8px;
  }

`;

const styleContent = {
  padding: 8,
  margin: 0,
  minHeight: 800,
};

export class FunctionLayout extends React.Component<Props, {}> {
  render() {
    return <Layout>
      <StyledBreadcrumbNav/>
      <Content style={styleContent}>
        {this.props.children}
      </Content>
    </Layout>;
  }
}
