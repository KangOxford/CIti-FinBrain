export interface DetailQuotation {
  quotaId: string; // 标的合约代码
  quotaName: string; // 标的名称
  currentVolume: number; // 现价
  rising: number; // 涨幅：百分比
  upAndDown: number; // 涨跌
  todayPrice: number; // 今日开幅
  yesterdayPrice: number; // 昨日收幅
  highest: number; // 今日最高
  lowest: number; // 今日最低
  totalVolume: number; // 总成交额
  totalQuantity: number; // 总成交量
  totalMarketValue: number; // 总市值
  circulatedMarketValue: number; // 流通市值
}
