// 市道切分表
interface MarketRouteFormItem {
  index: string; // 指标
  obviousUp: string; // 市场显著上升 ps 因为不同指标数据格式不同，有整数，百分数，范围，所以后端都转为string传给前端吧……
  waveryUp: string; // 市场震荡上升
  obviousDown: string; // 市场显著下降
  waveryDown: string; // 市场震荡下降
}

export type MarketRouteFormList = MarketRouteFormItem[];

// 市道切分图
interface MarketRouteChartItem {
  date: string; // 日期
  myfund: number; // 单位净值
  marketState: MarketState;
}

export enum MarketState {
  OBVIOUS_UP = "OBVIOUS_UP", // 显著上升
  WAVERY_UP = "WAVERY_UP", // 震荡上升
  OBVIOUS_DOWN = "OBVIOUS_DOWN", // 显著下降
  WAVERY_DOWN = "WAVERY_DOWN", // 震荡下降
}

export type MarketRouteChartList = MarketRouteChartItem[];

// 因子敏感性分析图
interface SensibilityChartItem {
  fluctuation: number; // 波动率因子（标准化）：2位小数
  lineRevenue: number; // 线性拟合收益率
  curveRevenue: number; // 曲线拟合收益率
}

export type SensibilityChartList = SensibilityChartItem[];

// 场景分析数据
export interface ScenarioData {
  marketRouteChart: MarketRouteChartList;
  marketRouteForm: MarketRouteFormList;
  sensibilityChart: SensibilityChartList;
}
