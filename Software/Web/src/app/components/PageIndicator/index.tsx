import React from "react";
import { PagingInfo } from "../../models/PagingInfo";

import { Pagination } from "antd";

interface Props {
  fetchPage(pageNumber: number): void;
  currentPageNumber: number;
  pagingInfo: PagingInfo;
}

export default class PageIndicator extends React.PureComponent<Props, {}> {

  onChange = (page: number) => {
    this.props.fetchPage(page);
  }

  render() {
    return <Pagination current={this.props.currentPageNumber}
                       total={this.props.pagingInfo.totalPage}
                       pageSize={this.props.pagingInfo.pageSize}
                       onChange={this.onChange}
                       />;
  }
}
