import { observer } from "mobx-react";
import React from "react";
import moment, { MomentInput } from "moment";
import { LocaleStore } from "../LocaleStore/LocaleStore";
import { Inject } from "react.di";

interface LocaleDateProps {
  formatId: string;
  input: MomentInput;
  isUtc?: boolean;
}

@observer
export class LocaleDate extends React.Component<LocaleDateProps, any> {

  @Inject localeStore: LocaleStore;

  render() {
    const format = this.localeStore.get(this.props.formatId) as string;

    const needConvert = this.props.isUtc === undefined || this.props.isUtc;

    const momentObj = needConvert ? moment.utc(this.props.input).local() : moment(this.props.input);
    return momentObj.format(format);

  }
}
