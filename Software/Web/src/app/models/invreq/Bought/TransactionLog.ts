// 所有交易记录
export type TransactionLog = DailyTransaction[];

// 指定日期的交易记录
export type TransactionDetailList = TransactionDetail[];

// 计划交易
export interface PlanTransaction {
  tranVolume: number; // 计划交易额
  tranDate: string; // 交易时间 primary key
  tranList: TransactionDetailList; // 具体交易列表
}

export interface DailyTransaction {
  time: string; // 此交易发生的日期
  children: TransactionDetailList;
}

export type DailyTransactionRespense = DailyTransaction[];

interface TransactionDetail {
  time: string; // 此交易发生的时间：时：分：秒
  type: TranType; // 交易种类
  quotaId: string; // 标的代码
  quotaName: string; // 标的名称
  buyOrSale: Action; // 买入/卖出
  quantity: number; // 成交量
  price: number; // 成交价
  totalPrice: number; // 总交易额
  matching: number; // 此产品占此次交易的配比
  lastMatching: number; // 上一次配比
}

export enum Action {
  SALE = "SALE",
  BUY = "BUY",
}

export enum TranType {
  STOCK = "STOCK",
  BOND = "BOND",
  GOODS = "GOODS",
}
