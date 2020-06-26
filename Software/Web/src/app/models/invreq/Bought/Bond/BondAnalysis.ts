// 估价数据
interface PredictValue {
  date: string; // 日期：每月 格式：yy-mm-dd
  predictValue: number; // 估价:元
}

// 估价表数据
export type PredictValueList = PredictValue[];

// 风险指标数据
interface RiskIndicator {
  season: string; // 季度 格式：2017Q1
  fixedDuration: number; // 估价修正久期：整数
  liability: number; // 资产负债率：小数
  cashFlow: number; // 现金流量比率：小数
  creditRate: string; // 信用评级 格式：A+
}

// 信用债风险指标图表数据
export type CreditRiskIndicatorList = RiskIndicator[];

interface Duration {
  season: string; // 季度 格式：2017Q1
  fixedDuration: number; // 估价修正久期：整数
}

// 利率债久期图表数据
export type RateDurationList = Duration[];

// 信用债数据
export interface CreditBondData  {
  predictValue: PredictValueList; // 信用债估价表
  riskIndicator: CreditRiskIndicatorList; // 信用债风险指标数据
}

// 利率债数据
export interface RateBondData {
  predictValue: PredictValueList; // 利率债估价表
  duration: RateDurationList; // 久期图
}
