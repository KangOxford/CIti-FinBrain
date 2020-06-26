// import React from "react";
// import {Table} from "antd";
// import { Link } from "react-router-dom";
// import {StyleStockIndexForm} from "../../models/quotation/BaseQuotation";
//
// interface Props {
//   data: StyleStockIndexForm;
//   columnWidth: number;
// }
//
// export class StockIndexForm extends React.Component<Props> {
//   render() {
//
//     const mockData = [
//       {
//       indexIntroduction: "指数名称",
//       content: "沪深300",
//       },
//       {
//         indexIntroduction: "指数类别",
//         content: "股票指数",
//       },
//       {
//         indexIntroduction: "发布方",
//         content: "中证指数有限公司",
//       },
//       {
//         indexIntroduction: "基准日期",
//         content: "2004-12-31",
//       },
//       {
//         indexIntroduction: "基准点数",
//         content: "1,000",
//       },
//     ];
//
//     const { columnWidth } = this.props;
//
//     const columns = [
//       {
//         title: "指数简介",
//         dataIndex: "indexIntroduction",
//         width: columnWidth,
//       },
//       {
//         title: " ",
//         dataIndex: "content",
//         width: columnWidth,
//       },
//     ];
//
//     return (
//       <Table columns={columns}
//              dataSource={mockData}
//              size={"small"}
//              style={{fontSize: "15px", textAlign: "center"}}
//              pagination={{pageSize: 30}}
//              scroll={{y: 250}} />
//     );
//   }
// }
