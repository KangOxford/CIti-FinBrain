import React from "react";
import { News } from "../../../models/quotation/news/News";
import { Inject } from "react.di";
import { QuotationService } from "../../../api/QuotationService";
import { Collapse, Divider, Icon, List } from "antd";
import styled from "styled-components";
import NewsItem from "./NewsItem";

const Panel = Collapse.Panel;

interface Props {

}

interface State {
  loading: boolean;
  data: News[];
}

const ClickableIcon = styled(Icon)`
  float: right;
  :hover {
    cursor: pointer;
  }
`;

const NewsTitle = styled.h3`
   small {
    margin-left: 16px;
   }
`;

export default class NewsPanel extends React.Component<Props, State> {

  @Inject quotationService: QuotationService;

  state = {
    loading: false,
    data: [] as News[],
  };

  loadData = async () => {
    this.setState({
      loading: true,
    });
    const data = await this.quotationService.getNews();
    this.setState({
      loading: false,
      data,
    });
  }

  componentDidMount() {
    this.loadData();
  }

  render() {

    const {loading, data} = this.state;
    return <div>

      {/*<Divider/>*/}
      <List dataSource={data}
            renderItem={(x, i) => (
        <List.Item key={i}>
          <NewsItem news={x}/>
        </List.Item>
      )}
            loading={loading}
            header={<h1>新闻列表 <ClickableIcon type={"reload"} spin={loading} onClick={this.loadData}/></h1>}
            pagination={{position: "bottom"}}
      />
    </div>;
  }
}
