import { InvestmentPreference } from "../user/InvestmentPreference";

export interface InvReqInit extends InvestmentPreference {
  amount: number;
  year: number;
}


