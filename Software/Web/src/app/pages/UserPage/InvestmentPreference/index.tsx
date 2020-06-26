import React from "react";
import { requireLogin, RequireLoginProps } from "../../hoc/RequireLogin";
import lang from "../../../internationalization/LocaleStore/lang";
import { Inject } from "react.di";
import { UserService } from "../../../api/UserService";
import PreferenceTable from "./PreferenceTable";
import { Collapse } from "antd";
import { defaultInvestmentPreference, InvestmentPreference } from "../../../models/user/InvestmentPreference";
import { LocaleMessage } from "../../../internationalization/components";
import { Link } from "react-router-dom";
import { UserStore } from "../../../stores/UserStore";
import PreferenceEvaluationPanel from "./PreferenceEvaluationPanel";

const Panel = Collapse.Panel;

const root = lang().userCenter.investmentPreference;

interface Props extends RequireLoginProps {

}

interface State {
  loading: boolean;
  guideShown: boolean;
  preference: InvestmentPreference;
}

@requireLogin()
export default class InvestmentPreferencePage extends React.Component<Props, State> {

  state = {
    loading: false,
    guideShown: false,
    preference: null,
  };

  @Inject userService: UserService;
  @Inject userStore: UserStore;

  fetch = async () => {
    this.setState({
      loading: true,
    });
    const data = await this.userService.getUserInvestmentPreference(this.userStore.user.username);
    this.setState({
      loading: false,
      preference: data,
    });
  }

  componentDidMount() {
    this.fetch();
  }

  onEvaluationComplete = async (needRefresh: boolean) => {
    if (needRefresh) {
      this.fetch();
    }
  }

  render() {

    const {loading, preference} = this.state;
    console.log(this.state);

    return <div>
      <h1><LocaleMessage id={root.title}/></h1>
      <PreferenceTable preference={preference || defaultInvestmentPreference}
                       loading={loading}
      />
      <Collapse defaultActiveKey={["1"]}>
        <Panel header={<LocaleMessage id={root.evaluation.title}/>} key={"1"}>
          <PreferenceEvaluationPanel onComplete={this.onEvaluationComplete}/>
        </Panel>
      </Collapse>
    </div>;
  }
}
