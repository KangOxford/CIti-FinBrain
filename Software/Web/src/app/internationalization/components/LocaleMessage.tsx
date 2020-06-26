import { observer } from "mobx-react";
import React from "react";
import { Inject } from "react.di";
import { LocaleStore, ReplacementMap } from "../LocaleStore/LocaleStore";
import { Lang } from "../LocaleStore/lang";

interface LocaleMessageProps {
  id: string;
  replacements?: ReplacementMap;
}

interface State {
  hasError: boolean;
}

@observer
export class LocaleMessage extends React.Component<LocaleMessageProps, State> {

  @Inject localeStore: LocaleStore;

  render() {
    try {

      return this.localeStore.get(this.props.id, this.props.replacements);
    } catch (e) {
      console.error(e);
      return this.props.id;
    }
  }

}
