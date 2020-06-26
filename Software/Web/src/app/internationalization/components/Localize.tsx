import React, { ReactNode } from "react";
import { observer } from "mobx-react";
import { LocaleStore, ReplacementMap } from "../LocaleStore/LocaleStore";
import { Inject } from "react.di";
import { Lang } from "../LocaleStore/lang";

interface LocalizeProps<T> {

  children: (props: { [k in keyof T]: React.ReactNode[] | string }) => ReactNode;
  replacements?: { [ k in keyof T]: string | Lang };
}

@observer
export class Localize<T> extends React.Component<LocalizeProps<T>, {}> {

  @Inject localeStore: LocaleStore;

  render() {
    const childProducer = this.props.children;
    const properties = Object.keys(this.props.replacements)
      .reduce((obj, key) => ({ ...obj, [key]: this.localeStore.get(this.props.replacements[key]) }), {}) as any;
    return childProducer(properties);
  }
}
