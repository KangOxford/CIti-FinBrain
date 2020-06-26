import React from "react";
import styled from "styled-components";
import {Divider} from "antd";
import {PromptComponent} from "./RegisterPromptDetail";
import {LocaleStore} from "../../internationalization";
import lang from "../../internationalization/LocaleStore/lang";
import { Inject } from "react.di";
import {observer} from "mobx-react";
import SvgImg from "../../components/SvgImg";

const Title = styled.div`
  text-align:right;
  color: #FFFFFF;
  border-bottom: #FFFFFF 1px solid;
  margin-left: 30px;
  margin-bottom: 5px;
  margin-top: 50px;
`;

const ChineseTitle = styled.p`
  text-align:right;
  font-size:30px;
  color: #FFFFFF;
  margin-bottom: 100px;
`;

/**
 * 注册界面右边的标题+介绍组件
 */
@observer
export  class RegisterPrompt extends React.Component<{}, {}> {
  @Inject localeStore: LocaleStore;

  render() {
    return (
      <div>
        <Title> <SvgImg filePath={"landscape.svg"} width={360} height={90}/></Title>
        <ChineseTitle>{this.localeStore.get(lang().signIn.title)}</ChineseTitle>
        <PromptComponent text={this.localeStore.get(lang().signIn.feature1)} />
        <PromptComponent text={this.localeStore.get(lang().signIn.feature2)} />
        <PromptComponent text={this.localeStore.get(lang().signIn.feature3)} />
      </div>
    );
  }
}
