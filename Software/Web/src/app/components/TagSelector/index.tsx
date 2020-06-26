import React, { CSSProperties } from "react";
import { Checkbox, Input, Tag, Select } from "antd";
import { SelectValue } from "antd/es/select";
const { Option } = Select;

export interface TagSelectorProps {
  availableTags?: string[];
  onSelectedChanged: (selected: string[]) => void;
  selectedTags: string[];
  placeholder?: string;
  allowCustomTag?: boolean;
  style?: CSSProperties;
}

export interface TagSelectorStates {
  inputtingTag: string;
}

export class TagSelector extends React.Component<TagSelectorProps, TagSelectorStates> {

  static defaultProps = {
    allowCustomTag: true,
    availableTags: [],
  };

  state = { inputtingTag: ""};

  handleChange = (e) => {
    this.setState({ inputtingTag: e.target.value });
  }

  handleTagClose(item) {
    this.props.onSelectedChanged(this.props.selectedTags.filter((x) => x !== item));
  }

  get addable() {
    if (!this.state.inputtingTag) {
      return false;
    }
    if (!this.props.allowCustomTag &&
      this.props.availableTags &&
      this.props.availableTags.indexOf(this.state.inputtingTag) === -1) {
      return false;
    }
    return true;

  }

  createNewOne = () => {
    if (this.addable) {
      this.props.onSelectedChanged([...new Set(this.props.selectedTags.concat(this.state.inputtingTag))]);
    }
    this.setState({ inputtingTag: "" });
  }

  onCheckboxGroupChanged = (values: string[]) => {
    this.props.onSelectedChanged(values);
  }

  onChange = (value: SelectValue) => {
    if (value === undefined) {
      this.props.onSelectedChanged([]);
    }
    if (Array.isArray(value)) {
      this.props.onSelectedChanged((value as Array<string|number>).map((x) => x + ""));
    } else {
      this.props.onSelectedChanged([value + ""]);
    }
  }

  render() {

    return <Select
      style={this.props.style}
      mode={this.props.allowCustomTag ? "tags" : "multiple"}
      placeholder={this.props.placeholder}
      // value={this.props.selectedTags}
      onChange={this.onChange}
      >
      {this.props.availableTags.map((x) => <Option key={x} value={x}>{x}</Option>)}
    </Select>;

    // const tags = this.props.selectedTags.map(item =>
    //   <Tag closable afterClose={() => this.handleTagClose(item)} key={item}>{item}</Tag>
    // );
    // return <div>
    //   {this.props.availableTags &&
    //   <Checkbox.Group options={this.props.availableTags}
    //                   value={this.props.selectedTags}
    //                   onChange={this.onCheckboxGroupChanged} />}
    //   {this.props.allowCustomTag && <Input placeholder={this.props.placeholder}
    //          onChange={this.handleChange} value={this.state.inputtingTag} onPressEnter={this.createNewOne} />}
    //   {tags}
    // </div>
  }
}
