// 风格配置能力图
interface StyleConfig {
  date: string; // 日期
  styleTiming: number; // 风格择时贡献：百分数
  styleChoosing: number; // 风格选股贡献：百分数
  fundOver: number; // 基金超额收益：百分数
  fundBaseOver: number; // 风格基准超额收益：百分数
}

export type StyleConfigChart = StyleConfig[];

// 风格配置能力表
interface StyleConfigForm {
  style: string; // 风格
  winRate: number; // 胜率：百分数
  yearRevenue: number; // 年化收益率：百分数
}

export type StyleConfigList = StyleConfigForm[];

// 风格解释度表
interface StyleExplain {
  season: string; // 季度
  rSquare: number; // 调整R方：3位小数
}

export type StyleExplainList = StyleExplain[];

// 风格偏好及贡献表
interface PreferAndContr {
  style: string; // 风格
  largeGrowth: number; // 大盘成长：百分数
  largeValue: number; // 大盘价值：百分数
  middleGrowth: number; // 中盘成长：百分数
  middleValue: number; // 中盘价值：百分数
  smallGrowth: number; // 小盘成长：百分数
  smallValue: number; // 小盘价值：百分数
}

export type PreferAndContrList = PreferAndContr[];

interface StyleExpose {
  season: string; // 季度 例如：'2016Q4'
  name: string; // 例如: 大盘成长 || 大盘价值 || 中盘成长 || 中盘价值 || 小盘成长 || 小盘价值
  value: number; // style对应的值
}

// 风格暴露图
export type StyleExposeChart = StyleExpose[];

interface PreferAndContribution {
  name: string; // 例如: 大盘成长 || 大盘价值 || 中盘成长 || 中盘价值 || 小盘成长 || 小盘价值
  s2016Q4: number; // 2016Q4 对应的值
  s2017Q1: number;
  s2017Q2: number;
  s2017Q3: number;
  s2017Q4: number;
  s2018Q1: number;
  s2018Q2: number;
  s2018Q3: number;
}

// 风格偏好及贡献图
export type PreferAndContributionChart = PreferAndContribution[];

export interface AttributeData {
  styleConfigChart: StyleConfigChart; // 风格配置能力图
  styleConfigForm: StyleConfigList; // 风格配置能力表
  styleExplainForm: StyleExplainList; // 风格解释度表
  preferAndContributionChart: PreferAndContrList; // 风格偏好及贡献表
  styleExposeChart: StyleExposeChart; // 风格暴露图
  // preferAndContributionChart: PreferAndContributionChart; // 风格偏好及贡献图

}
