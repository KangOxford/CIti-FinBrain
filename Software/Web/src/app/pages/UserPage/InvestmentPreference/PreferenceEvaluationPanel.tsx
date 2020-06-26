import React from "react";
import { Inject } from "react.di";
import { action, observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import { Select, Button, notification, Modal } from "antd";
import { range } from "../../../../utils/Range";
import lang from "../../../internationalization/LocaleStore/lang";
import styled from "styled-components";
import { PreferenceEvaluationAnswer, PreferenceEvaluationSelection, } from "../../../models/user/PreferenceEvaluation";
import { UserService } from "../../../api/UserService";
import { UserStore } from "../../../stores/UserStore";
import { LocaleMessage } from "../../../internationalization/components";
import { InvestmentPreference } from "../../../models/user/InvestmentPreference";
import PreferenceTable from "./PreferenceTable";
import { LocaleStore } from "../../../internationalization";

const QandA = [
  {
    question: "您的年龄是？",
    answers: [
      "大于55岁",
      "45-55岁",
      "35-45岁",
      "25-35岁",
      "小于25岁",
    ],
  }, {
    question: "您的收入来源是：",
    answers: [
      "工资、劳务报酬",
      "生产经营所得",
      "利息、股息、转让证券等金融性资产收入",
      "出租、出售房地产等非金融性资产收入",
      "无固定收入",
    ],
  }, {
    question: "您的家庭可支配年收入是（折合为人民币）",
    answers: [
      "20万以下",
      "20-100万",
      "100-500万",
      "500-1000万",
      "1000万以上",
    ],
  }, {
    question: "在您每年的家庭可支配收入中，可用于金融投资的（储蓄存款除外）的比例为",
    answers: [
      "小于10%",
      "10%-25%",
      "25%-50%",
      "50%-75%",
      "大于75%",
    ],
  }, {
    question: "您的投资知识可描述为：",
    answers: [
      "完全没有",
      "有限，基本我有金融方面的知识",
      "一般，对金融产品及其相关风险具有基本的知识和理解",
      "丰富，对金融产品及其相关风险具有丰富的知识和理解",
      "几乎了解所有金融相关的知识和信息",
    ],
  }, {
    question: "您的投资经验可描述为：",
    answers: [
      "没有投资经验",
      "除银行储蓄外，基本没有其他投资经验",
      "购买过债券、保险等理财产品",
      "参与过股票、基金等产品的交易",
      "参与过权证、期货、期权等产品的交易",
    ],
  }, {
    question: "您有多少年投资基金、股票、信托、私募证券或金融衍生产品等风险投资品的经验？ ",
    answers: [
      "没有经验",
      "少于2年",
      "2-5年",
      "5-10年",
      "10年以上",
    ],
  }, {
    question: "以下哪项描述最符合您的投资态度？",
    answers: [
      "厌恶风险，不希望本金损失，希望能获得稳定回报",
      "保守投资，不希望本金损失，愿意承担一定程度的收益波动",
      "寻求资金的较高收益和成长性，愿意为此承担一定的本金损失",
      "希望赚取高回报，愿意为此承担较大的本金损失",
      "希望赚取极高回报，并愿意为此承担极大的损失",
    ],
  }, {
    question: "短期内，您能接受的亏损范围是",
    answers: [
      "小于5%或不可接受",
      "5%-10%",
      "10%-20%",
      "20%-35%",
      "大于35%",
    ],
  },
];

const root = lang().userCenter.investmentPreference;

function createDefaultAnswers(): PreferenceEvaluationAnswer {
  return range(0, 9).map(() => 0 as 0);
}

interface Props {
  onComplete(needRefresh: boolean): void;
}

interface State {

}

const Form = styled.div`
  overflow: auto;
  max-height: 800px;
  & > * {
  margin-bottom: 8px;
  }
`;

@observer
export default class PreferenceEvaluationPanel extends React.Component<Props, State> {

  @observable answers: PreferenceEvaluationAnswer;

  @observable calculating: boolean = false;

  @Inject localeStore: LocaleStore;

  @Inject userService: UserService;
  @Inject userStore: UserStore;

  @action componentDidUpdate() {
    this.answers = createDefaultAnswers();
  }

  @action componentDidMount() {
    this.answers = createDefaultAnswers();
  }

  @action onSelected = (questionIndex: number, answerIndex: PreferenceEvaluationSelection) => {
    this.answers[questionIndex] = answerIndex;
  }

  @action onOk = async () => {
    this.calculating = true;

    const result = await this.userService.evaluatePreference(this.answers);

    runInAction(() => {
      this.calculating = false;
    });

    // ask user to choose whether to accept the result

    Modal.confirm({
      title: "确认评估结果",
      content: <div>
        <p>您的评估结果如下：</p>
        <PreferenceTable texts={{
          profit: this.localeStore.get(root.profit),
          fluctuation: this.localeStore.get(root.fluctuation),
        }} preference={result} loading={false}/>
        <p>是否接受此评估结果？</p>
      </div>,
      onOk: async () => {
        await this.userService.setUserInvestmentPreference(
          this.userStore.user.username,
          result,
        );
        this.props.onComplete(true);
      },
      onCancel: () => {
        this.props.onComplete(false);
      },
    });
  }

  render() {
    return <Form>
      {QandA.map((x, i) => {
        return <div key={i}>
          <p>{x.question}</p>
          <Select defaultValue={0}
                  onChange={(value: PreferenceEvaluationSelection) => this.onSelected(i, value)}
                  dropdownMatchSelectWidth={false}
          >
            {x.answers.map((ans, j) =>
              <Select.Option value={j} key={`${i}-${j}`}>
                {ans}
              </Select.Option>,
            )}
          </Select>
        </div>;
      })}
      <Button loading={this.calculating} type={"primary"} onClick={this.onOk}>
        <LocaleMessage id={root.evaluation.submit}/>
      </Button>
    </Form>;
  }
}
