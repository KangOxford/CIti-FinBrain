import React from "react";
import { Link } from "react-router-dom";
import Particles from "../../components/Particles";
import { layoutConstants } from "../../layouts/components/constants";
import styled from "styled-components";
import Features from "./Features";
import Process from "./Process";
import background from "../../../assets/background/1.png";
import { Row, Col, Divider, Button } from "antd";
import CenterContainer from "./CenterContainer";
import TeamMembers from "./TeamMembers";
import { UiStore } from "../../stores/UiStore";
import { Inject } from "react.di";
import { UserStore } from "../../stores/UserStore";
import { RouterStore } from "../../routing/RouterStore";
import { observer } from "mobx-react";

interface Props {

}

const HomePageContainer = styled.div`
min-height: 800px;
`;

const titleShowcaseHeight = 500;

const BannerContainer = styled.div`
  position: relative;
  height: ${titleShowcaseHeight}px;
  width: 100%;
  background-color: ${layoutConstants.headerBackgrounColor};
`;

const ParticlesContainer = styled.div`
  position: absolute;
  height: ${titleShowcaseHeight}px;
  width: 100%;
  
  z-index: 3;
`;

const BackgroundContainer = styled.div`
  position: absolute;
  height: ${titleShowcaseHeight}px;
  width: 100%;
  
  & > img {
    float: right;
    height: ${titleShowcaseHeight}px;
   
  }
  
  z-index: 1;
`;

const TitleShowcase = styled(CenterContainer)`
  height: ${titleShowcaseHeight}px;
  width: 100%;
  color: white;
  //z-index: 3;
`;

const TitleContent = styled.div`
 
  line-height: 48px;
  //text-align: center;
  
  padding: 16px;
  
  h1 {
    font-size: 32px;
  }
`;

@observer
export default class HomePage extends React.Component<Props, {}> {

  @Inject uiStore: UiStore;
  @Inject userStore: UserStore;
  @Inject routerStore: RouterStore;

  onLogin = () => {
    if (this.userStore.loggedIn) {
      this.routerStore.jumpTo("/invreq");
    } else {
      this.uiStore.toggleLoginModalShown();
    }
  };

  render() {
    return <HomePageContainer>
      <BannerContainer>
        <BackgroundContainer>
          <img src={background}/>
        </BackgroundContainer>
        <ParticlesContainer>
          <Particles marginTop={layoutConstants.headerHeight}
                     height={titleShowcaseHeight + layoutConstants.headerHeight}
          />
        </ParticlesContainer>
        <Row style={{zIndex: 5}}>
          <Col xs={24} md={12}>
            <TitleShowcase>
              <TitleContent>
                <h1 style={{ color: "white" }}>A+Quant人工智能资产管理</h1>
                <h2 style={{ color: "white" }}>专属定制，量化择时</h2>
                <h2 style={{ color: "white" }}>Democratize AI to empower quant</h2>
                <Button size={"large"} type={"primary"} onClick={this.onLogin}>
                  {this.userStore.loggedIn
                    ? "开始投资"
                    : "登录以开始投资"
                  }
                </Button>
              </TitleContent>
            </TitleShowcase>
          </Col>
        </Row>

      </BannerContainer>

      <Features/>
      <Process/>
      <TeamMembers/>
    </HomePageContainer>;
  }
}
