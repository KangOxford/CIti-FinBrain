export interface OverviewData {
  accuRevenue: number;  // 累计收益:百分率
  predRorYear: number; // 预期年化收益:百分率
  todayRevenue: number; // 今日收益：百分率
  startDate: string;  // 开始时间：精确到日期
  startVolume: number;  // 初始资金：保留两位小数
}
