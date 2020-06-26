import React, { ReactNode } from "react";
import { InvestmentPreference } from "../../../models/user/InvestmentPreference";
import { Table } from "antd";
import lang from "../../../internationalization/LocaleStore/lang";
import { LocaleMessage } from "../../../internationalization/components";
import { Module } from "react.di";
import { LocaleStore } from "../../../internationalization";

interface Props {
  preference: InvestmentPreference;
  loading: boolean;
  texts?: { [ key in keyof InvestmentPreference]: ReactNode };
}

const root = lang().userCenter.investmentPreference;

const columns = [{
  title: "项目",
  dataIndex: "name",
  key: "key",
}, {
  title: "推荐值",
  dataIndex: "value",
  key: "value",
}];

export default function PreferenceTable(props: Props) {
  const { preference, loading } = props;

  const texts = props.texts
  || { profit: <LocaleMessage id={root.profit}/>, fluctuation: <LocaleMessage id={root.fluctuation}/> };

  const dict = [
    { key: "profit", name: texts.profit, value: preference.profit + "%"},
    { key: "fluctuation", name: texts.fluctuation, value: preference.fluctuation + "%" },
    // { key: "金额", value: p.amount },
    // { key: "年限", value: p.year },
  ];

  return <Table columns={columns}
                dataSource={dict}
                pagination={false}
                loading={loading}
  />;
}
