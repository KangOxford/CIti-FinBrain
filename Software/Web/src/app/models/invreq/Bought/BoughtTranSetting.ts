export interface BoughtTranSetting {
  planTranTime: number; // 计划交易时间：范围为0-23，单位为时，默认为0时
  planRemindTime: number; // 在计划时间前多少小时通知有交易：范围为0-24,单位为小时，默认为1小时
  minConfirmedPrice: number; // 需要手动确认的最小金额:单位为元，默认为3000元
  confirmTime: number; // 有效的确认时间，若在提醒后的这个时间内未确认交易，执行默认操作：范围为0-96，单位为小时，默认为1小时
  defaultConfirm: boolean; // 默认操作是否为确认交易
}

export const defaultBoughtTranSetting: BoughtTranSetting = {
  planTranTime: 0,
  planRemindTime: 1,
  minConfirmedPrice: 3000,
  confirmTime: 1,
  defaultConfirm: true,
};
