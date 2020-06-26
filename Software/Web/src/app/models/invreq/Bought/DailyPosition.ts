// 一条每日持仓记录
interface DailyPositionItem {
  quotaId: string; // 标的代码
  quotaName: string; // 标的名称
  currentValue: number; // 当前价
  quantity: number; // 持有量
  totalValue: number; // 总额
  profitAndLoss: number; // 盈亏（相对于初始金额），盈利为正数，亏损为负数
  serviceCharge: number; // 手续费用
}

type DailyPosition = DailyPositionItem[];

interface List {
  date: string; // 日期
  children: DailyPosition; // 当前日期的持仓列表
}

export type DailyPositionList = List[];
