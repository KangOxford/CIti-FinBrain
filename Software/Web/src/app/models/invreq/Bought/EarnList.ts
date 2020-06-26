interface Earning {
  date: string; // 日期
  straEarning: number; // 策略收益：百分数
  baseEarning: number; // 基准收益：百分数
}

export type EarningList = Earning[];
