export interface BondOverviewData {
  startDate: string; // 初始日期 格式yy-mm-dd
  currentVolume: number; // 当前金额
  currentRatio: number;  // 当前债券占整个配置的百分比:百分数
  profit: number; // 收益 ？数据格式
  duration: number; // 当前久期：整数
  quotationId: string; // 债券标的ID （用于展示当前持仓？）
  name: string; // 名称
  quantity: number; // 数量
  price: number; // 单价

}

export interface BondOverviewDatas {
  creditOverview: BondOverviewData; // 信用债
  rateOverview: BondOverviewData; // 利率债
}
