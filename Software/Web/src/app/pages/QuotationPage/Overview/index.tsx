import React from "react";
import NewsPanel from "./NewsPanel";
// import MarketOverview from "../../../../assets/marketOverview.png";
import {Card} from "antd";
import styled from "styled-components";
import MarketOverview from "./MarketOverview";

interface Props {

}

const ImgContainer = styled.img`
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`

export default class OverviewPage extends React.Component<Props, {}> {
  render() {
    return <div>
      <Card>
        <MarketOverview/>
      </Card>
      {/*<ImgContainer src={MarketOverview}/>*/}
      <NewsPanel/>
    </div>;
  }
}
