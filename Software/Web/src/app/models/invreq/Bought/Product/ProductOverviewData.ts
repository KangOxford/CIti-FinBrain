export interface ProductOverview {
  startDate: string; // 初始时间，格式yy-mm-dd
  currentVolume: number; // 当前金额
  currentRatio: number; // 当前占比：百分数
  profit: number; // 收益：百分数
  quotaId: string; // 标的id
  name: string; // 标的名称
  price: number; // 单价
  quantity: number; // 数量
}

export interface ProductOverviewData {
  futuresOverview: ProductOverview; // 原油期货
  spotOverview: ProductOverview;  // 原油现货
}
