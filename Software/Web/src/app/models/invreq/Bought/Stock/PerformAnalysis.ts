
interface DailyPerform {
  date: string; // 日期 yy-mm-dd
  returnNum: number; // 超额动态回撤:百分数
  revenueNum: number; // 超额收益率:百分数
}

// 超额动态回撤和超额收益率图的数据
export type PerformChartList = DailyPerform[];

interface QuotaInfo {
  quotaName: string; // 名称
  period: number; // 周期数：月
  totalRevenue: number; // 超额累计回撤率：百分比
  monthly: number; // 月胜率：百分比
  maxReturn: number; // 超额最大回撤率：百分比
  maxReturnBegin: string; // 超额最大回撤起始日期：date
  maxReturnEnd: string; // 超额最大回撤结束日期：date
  maxReturnSupplement: number; // 超额最大回撤补期：天
}

// 超额动态回撤和超额收益率表的数据
export type PerformFormList = QuotaInfo[];

export interface AchievmentData {
  chartData: PerformChartList;
  formData: PerformFormList;
}
