// import React from "react";
// import {Table} from "antd";
// import { Link } from "react-router-dom";
// import {StylePriceChangeRatioForm} from "../../models/quotation/BaseQuotation";
//
// interface Props {
//   data: StylePriceChangeRatioForm;
//   columnWidth: number;
// }
//
// export class PriceChangeRatioForm extends React.Component<Props> {
//   render() {
//
//     const mockData = [
//       {
//         priceChange: "指数名称",
//         historyTradeStatistics: "沪深300",
//       },
//       {
//         priceChange: "指数类别",
//         historyTradeStatistics: "股票指数",
//       },
//       {
//         priceChange: "发布方",
//         historyTradeStatistics: "中证指数有限公司",
//       },
//       {
//         priceChange: "基准日期",
//         historyTradeStatistics: "2004-12-31",
//       },
//       {
//         priceChange: "基准点数",
//         historyTradeStatistics: "1,000",
//       },
//       {
//         priceChange: "指数名称",
//         historyTradeStatistics: "沪深300",
//       },
//       {
//         priceChange: "指数类别",
//         historyTradeStatistics: "股票指数",
//       },
//       {
//         priceChange: "发布方",
//         historyTradeStatistics: "中证指数有限公司",
//       },
//       {
//         priceChange: "基准日期",
//         historyTradeStatistics: "2004-12-31",
//       },
//       {
//         priceChange: "基准点数",
//         historyTradeStatistics: "1,000",
//       },
//     ];
//
//     const { columnWidth } = this.props;
//
//     const columns = [
//       {
//         title: "涨跌统计",
//         dataIndex: "priceChange",
//         width: columnWidth,
//       },
//       {
//         title: "历史交易数据",
//         dataIndex: "historyTradeStatistics",
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
