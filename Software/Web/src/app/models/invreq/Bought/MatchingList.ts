import {TranType} from "./TransactionLog";

export interface Matching {
  quotaId: string; // 标的代码
  quotaName: string; // 标的名称
  totalValue: number; // 总价值
  percentage: number; // 占比
  type: TranType;
}

// 股票、债券、商品市场的配比详情
export type MatchingList = Matching[];

export interface OverviewMatching {
  stockMatching: number;
  bondMatching: number;
  productionMatching: number;
}
