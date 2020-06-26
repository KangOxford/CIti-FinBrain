export interface InvestmentPreference {
  profit: number; // 收益率，百分比
  fluctuation: number; // 波动率，百分比
}

export const defaultInvestmentPreference = {
  profit: 0,
  fluctuation: 0,
};
