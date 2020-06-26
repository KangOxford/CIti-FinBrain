import React from "react";
import { News } from "../../../models/quotation/news/News";
import { Divider, List, Icon, Card } from "antd";
import styled from "styled-components";
import Markdown from "../../../components/Markdown";

interface Props {
  news: News;
}

interface State {
  opened: boolean;
}

function takeStart(content: string) {
  if (content.length <= 20) {
    return content;
  } else {
    return content.substr(0, 20) + "...";
  }
}

const ClickableIcon = styled(Icon)`
  :hover {
  cursor: pointer;

  }
    float: right;
`;

export default class NewsItem extends React.PureComponent<Props, State> {

  state = {
    opened: false,
  };

  onOpen = () => {
    this.setState({
      opened: !this.state.opened,
    });
  };

  render() {
    const {title, content, time} = this.props.news;
    return <Card style={{ width: "100%"}} title={<>
    {title}
    <small style={{ marginLeft: "24px" }}>发布于 {time}</small>
    </>}
                 extra={<a onClick={this.onOpen}>{this.state.opened ? "收回" : "更多"}</a>}
                 hoverable={true}
    >
      {this.state.opened
        ? <Markdown content={content}/>
        : takeStart(content)
      }
    </Card>;
  }
}
