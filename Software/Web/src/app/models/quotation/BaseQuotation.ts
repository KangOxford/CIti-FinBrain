// 市场行情股票图
export interface BaseQuotation {
  time: string; // 日期 例如："2015-11-19",
  start: number; // 开盘价 例如：8.18,
  max: number; // 最高价 例如：8.33,
  min: number; // 最低价 例如：7.98,
  end: number; // 收盘价 例如：8.32,
  volume: number; // 成交量 例如：1810,
  money: number; // 钱数 例如：14723.56,
}
