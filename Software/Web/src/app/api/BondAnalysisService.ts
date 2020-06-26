import { Inject, Injectable } from "react.di";
import {HttpService} from "./HttpService";
import {CreditBondData, RateBondData} from "../models/invreq/Bought/Bond/BondAnalysis";
import {BondOverviewData, BondOverviewDatas} from "../models/invreq/Bought/Bond/BondOverviewData";

@Injectable
export class BondAnalysisService {

  constructor(@Inject private httpService: HttpService) { }

  /**
   * 得到信用债的深度分析数据
   * @param {string} invreqId 投资配置ID
   * @returns {Promise<CreditBondData>}
   */
  async getCredictBond(invreqId: string): Promise<CreditBondData> {
    const data = await this.httpService.fetch({
      path: `invreq/${invreqId}/bond/credit`,
    });

    console.log(data.response);
    return data.response;
  }

  /**
   * 得到利率债的深度分析数据
   * @param {string} invreqId 投资配置ID
   * @returns {Promise<CreditBondData>}
   */
  async getRatetBondData(invreqId: string): Promise<RateBondData> {
    const data = await this.httpService.fetch({
      path: `invreq/${invreqId}/bond/rate`,
    });

    return data.response;
  }

  /**
   * 得到债券的总览信息
   * @param {string} invreqId 需求id
   * @returns {Promise<BondOverviewData>}
   */
  async getBondOverviewData(invreqId: string): Promise<BondOverviewDatas> {
    const data = await this.httpService.fetch({
      path: `invreq/${invreqId}/bond`,
    });

    return data.response;
  }

}
