export interface ReallocationDetail {
  tranDate: string; // 交易日期
  tranNum: number; // 当日交易数量
  perOfStock: number; // 股票投资比例:百分数
  changeOfStock: number; // 相较于上一次交易日期，股票投资比例的变化：百分数
  perOfBond: number; // 债券投资比例:百分数
  changeOfBond: number; // 相较于上一次交易日期，债券投资比例的变化：百分数
  perOfProduct: number; // 商品市场投资比例:百分数
  changeOfProduct: number; // 相较于上一次交易日期，商品市场投资比例的变化：百分数
}

export type ReallocationLog = ReallocationDetail[];
