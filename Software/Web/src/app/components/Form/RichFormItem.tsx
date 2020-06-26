import React from "react";
import { Form } from "antd";
import { FormProps } from "antd/es/form";

const AntdFormItem = Form.Item;

interface Props<T> {
  status: T;
  mapToFormProps(prop: T): FormProps;
}

export default class RichFormItem<T> extends React.Component<Props<T>, {}> {
  render() {
    return <AntdFormItem {...this.props.mapToFormProps(this.props.status)}>
      {this.props.children}
    </AntdFormItem>;
  }
}
