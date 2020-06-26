import React from "react";
import { InvestmentPreference } from "../../../models/user/InvestmentPreference";
import { Table, Button, Input } from "antd";
import { LocaleMessage } from "../../../internationalization/components";
import lang from "../../../internationalization/LocaleStore/lang";
import FormItem from "../../../components/Form/FormItem";
import { Inject } from "react.di";
import { UserService } from "../../../api/UserService";
import { UserStore } from "../../../stores/UserStore";
import { Simulate } from "react-dom/test-utils";
import keyDown = Simulate.keyDown;

interface Props {
  initial: InvestmentPreference;
  loading: boolean;
  refresh(): void;
}

interface State {
  editable: boolean;
  pref: { [key in keyof InvestmentPreference]: string };
}

const root = lang().userCenter.investmentPreference;

export default class EditablePreferenceTable extends React.Component<Props, State> {

  @Inject userService: UserService;
  @Inject userStore: UserStore;

  state = {
    editable: false,
    pref: null,
  };

  onEdit = () => {
    const {fluctuation, profit} = this.props.initial;
    this.setState({
      editable: true,
      pref: {profit: profit + "", fluctuation: fluctuation + ""},
    });
  }

  onChange = (key: string) => (e) => {
    this.setState({
      pref: {
        ...this.state.pref,
        [key]: e.target.value,
      },
    });
  }

  dataValid() {
    const { profit, risk } = this.state.pref;
    return this.isValid(profit) && this.isValid(risk);
  }

  onSubmit = async () => {
    const { profit, risk } = this.state.pref;
    if (this.dataValid()) {
      const newPref = {
        profit: Number(profit),
        fluctuation: Number(risk),
      };
      await this.userService.setUserInvestmentPreference(this.userStore.user.username, newPref);
      this.props.refresh();
      this.onCancel();
    }
  }

  onReset = () => {
    this.onEdit();
  }

  onCancel = () => {
    this.setState({
      editable: false,
    });
  }
  
  isValid = (value) => {
    const parsed = Number(value);
    if (isNaN(parsed)) {
      return false;
    }

    return 0 <= parsed;
  }

  render() {
    const {initial} = this.props;
    const {pref, editable} = this.state;

    const columns = [{
      title: "项目",
      dataIndex: "name",
      key: "key",
      render: (value) => <span><LocaleMessage id={value}/> (%)</span>,
    }, {
      title: "推荐值",
      dataIndex: "value",
      key: "value",
      render: (text, record, index) =>
        editable
          ? <FormItem valid={this.isValid(text)} messageOnInvalid={"应该是一个大于等于0的数字"}>
            <Input value={text}
                   onChange={this.onChange(record.key)}
                   type={"number"}/>
            </FormItem>
          : text,

    }];

    const dict = [
      {key: "profit", name: root.profit, value: editable ? pref.profit : initial.profit},
      {key: "fluctuation", name: root.fluctuation, value: editable ? pref.fluctuation : initial.fluctuation},
      // { key: "金额", value: p.amount },
      // { key: "年限", value: p.year },
    ];

    return <div>
      <Table columns={columns} dataSource={dict} loading={this.props.loading} pagination={false}/>
      {this.state.editable
        ? <p>
          <Button type={"primary"} onClick={this.onSubmit} disabled={!this.dataValid()}>
            <LocaleMessage id={root.submit}/>
          </Button>
          <Button onClick={this.onReset}>
            <LocaleMessage id={root.reset}/>
          </Button>
          <Button onClick={this.onCancel}>
            <LocaleMessage id={root.cancel}/>
          </Button>
        </p>
        :
        <Button onClick={this.onEdit}>
          <LocaleMessage id={root.edit}/>
        </Button>
      }
    </div>;
  }
}
