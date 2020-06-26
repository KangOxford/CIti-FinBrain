import { action, computed, observable } from "mobx";
import { BaseFormData } from "../../../components/Form/BaseFormData";
import { InvReqInit } from "../../../models/invreq/InvReqInit";
import { defaultInvestmentPreference, InvestmentPreference } from "../../../models/user/InvestmentPreference";

export class InvreqInitFormData extends BaseFormData {
  @observable profit: string;
  @observable fluctuation: string;
  @observable amount: string = "0";
  @observable year: number = 1;

  get data(): InvReqInit {
    return {
      profit: parseFloat(this.profit),
      fluctuation: parseFloat(this.fluctuation),
      amount: parseFloat(this.amount),
      year: this.year,
    };
  }

  constructor(props: InvestmentPreference = defaultInvestmentPreference) {
    super();
    if (props) {
      this.profit = props.profit + "";
      this.fluctuation = props.fluctuation + "";
    }

  }

  @computed get profitValid() {
    return this.validateNumber(this.profit, 0, 10);
  }

  @computed get fluctuationValid() {
    return this.validateNumber(this.fluctuation, 3, 100);
  }

  @computed get amountValid() {
    return this.validateNumber(this.amount, 0.01);
  }

  @computed get valid() {
    return this.profitValid && this.fluctuationValid && this.amountValid;
  }
}
