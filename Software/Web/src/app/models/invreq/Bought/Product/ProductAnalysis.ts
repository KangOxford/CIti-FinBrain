// 接口A：动态回撤和绝对收益图
import en from "../../../../../assets/i18n/en";

interface DailyProfit {
  date: string; // 日期：格式yy-mm-dd
  bonusRatio: ReturnList;
  totalIncomeRatio: number; // 组合收益
  totalIncome: number; // 总收益
}

export interface ProductDailyProfit extends DailyProfit {
  futuresProfit: number;
  spotProfit: number;
}

interface BonusReturnRatio {
  name: string; // 商品名
  ratio: number; // 总收益
}
export type ReturnList = BonusReturnRatio[];
export type AbsoluteReturn = DailyProfit[];
export interface ProfitAndDrawDown {
  absoluteReturn: AbsoluteReturn;
  maxDrawdown: number; // 最大回撤：百分数
  startDate: string; // 最大回撤起始日期
  endDate: string; // 最大回撤终止日期
  days: number; // 最大回撤回补期:整数
}

// 接口B：场景分析数据
export interface SceneData {
  weekNum: number; // 周数
  type: string; // 类型
  sharpeRatio: number; // 夏普比率
  calmarRatio: number; // Calmar比率
  maxWeekIncomeRatio: number; // 周收益率最大
  minWeekIncomeRatio: number; // 周收益率最小
  fluctuationRatio: number; // 波动率
  maxDrawdown: number;  // 最大回撤：百分数
}
export interface TotalIncomeRatio {
  date: string; // 日期：格式yy-mm-dd
  type: string; // 类型
  totalIncomeRatio: number; // 组合收益率
}
export type TotalIncomeRatioList = TotalIncomeRatio[];
export type SceneDatas = SceneData[];
export interface SceneAnalysisResponse {
  typeData: SceneDatas;
  totalIncomeRatioList: TotalIncomeRatioList;
}

// 接口C：与市场基准比较
interface ComparisionTable {
  date: string; // 日期：格式yy-mm-dd
  marketRatio1: number; // 南方原油市场基准
  marketRatio2: number; // 南华商品指数市场基准
  totalIncomeRatio: number; // 组合收益率
}
export type TableList = ComparisionTable[];
export interface ComparisionTableList {
  comparisionWithMarketBenchmark: TableList;
}

// 接口D：因子敏感性分析
interface SensitivityPoint {
  weekIncomeRatio: number; // 组合收益率：曲线拟合
  weekFluctuationRatio: number; // 波动率
}
export type SensitivityCurveList = SensitivityPoint[];
export interface SensitivityList {
  factorSensitivity: SensitivityCurveList;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

// 接口E：残差项分析
interface ResidualTable {
  date: string; // 日期：格式yy-mm-dd
  residual: number; // 残差
}
export type ResidualTableList = ResidualTable[];
export interface ResidualAnalysisResponse {
  residualList: ResidualTableList; // 残差项列表
  kurt: number; // 峰度
  skew: number; // 偏度
}

// 接口F：大事记表项
interface MemorabiliaTable {
  scene: string; // 情景名称
  startDate: string;
  endDate: string;
  returnRatio: number; // 区间收益率
  maxDrawdown: number; // 区间最大回撤
  fluctuation: number; // 区间波动率
  nanhuaMarketRatio: number; // 南华市场基准
}
export type MemorabiliaList = MemorabiliaTable[];
export interface MemorabiliaResponse {
  memorabilia: MemorabiliaList;
}
