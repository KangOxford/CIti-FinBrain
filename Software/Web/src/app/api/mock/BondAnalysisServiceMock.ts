import { Inject, Injectable } from "react.di";
import {CreditBondData, PredictValueList, RateBondData} from "../../models/invreq/Bought/Bond/BondAnalysis";
import {BondAnalysisService} from "../BondAnalysisService";
import {BondOverviewData, BondOverviewDatas} from "../../models/invreq/Bought/Bond/BondOverviewData";
import { waitForMs } from "../../../utils/Wait";

@Injectable
export class BondAnalysisServiceMock extends BondAnalysisService {

  /**
   * 得到信用债的深度分析数据
   * @param {string} invreqId 投资配置ID
   * @returns {Promise<CreditBondData>}
   */
  async getCredictBond(invreqId: string): Promise<CreditBondData> {
    await waitForMs(1000);

    return {
      predictValue: [
        {
          date: "2017-01-01",
          predictValue: 3452.14,
        },
        {
          date: "2017-02-01",
          predictValue: 3711.22,
        },
        {
          date: "2017-03-01",
          predictValue: 3111.14,
        },
        {
          date: "2017-04-01",
          predictValue: 2215.14,
        },
        {
          date: "2017-05-01",
          predictValue: 2672.14,
        },
      ],
      riskIndicator: [
        {
          season: "2017Q1",
          fixedDuration: 145,
          liability: 18.10,
          cashFlow: 89.11,
          creditRate: "A",
        },
        {
          season: "2017Q2",
          fixedDuration: 188,
          liability: 39.22,
          cashFlow: 74.22,
          creditRate: "A",
        },
        {
          season: "2017Q3",
          fixedDuration: 156,
          liability: 34.22,
          cashFlow: 80.33,
          creditRate: "A",
        },
        {
          season: "2017Q4",
          fixedDuration: 122,
          liability: 48.10,
          cashFlow: 89.11,
          creditRate: "A",
        },
        {
          season: "2018Q1",
          fixedDuration: 80,
          liability: 49.22,
          cashFlow: 74.22,
          creditRate: "A",
        },
        {
          season: "2018Q2",
          fixedDuration: 55,
          liability: 54.22,
          cashFlow: 80.33,
          creditRate: "A",
        },
      ],
    };
  }

  /**
   * 得到利率债的深度分析数据
   * @param {string} invreqId 投资配置ID
   * @returns {Promise<CreditBondData>}
   */
  async getRatetBondData(invreqId: string): Promise<RateBondData> {
    return {
      predictValue: [
        {
          date: "2017-01-01",
          predictValue: 3452.14,
        },
        {
          date: "2017-02-01",
          predictValue: 3711.22,
        },
        {
          date: "2017-03-01",
          predictValue: 3111.14,
        },
        {
          date: "2017-04-01",
          predictValue: 2215.14,
        },
        {
          date: "2017-05-01",
          predictValue: 2672.14,
        },
      ],
      duration: [
        {
          season: "2017Q1",
          fixedDuration: 145,
        },
        {
          season: "2017Q2",
          fixedDuration: 188,
        },
        {
          season: "2017Q3",
          fixedDuration: 156,
        },
      ],
    };
  }

  /**
   * 得到债券的总览信息
   * @param {string} invreqId 需求id
   * @returns {Promise<BondOverviewData>}
   */
  async getBondOverviewData(invreqId: string): Promise<BondOverviewDatas> {
    return{
      creditOverview: {
        startDate: "2018-09-10",
        currentVolume: 4938.00,
        currentRatio: 12.70,
        profit: 1.22,
        duration: 2.53,
        quotationId: "019037.SH",
        name: "10国债37",
        price: 24.69,
        quantity: 200,
      },
      rateOverview: {
        startDate: "2018-09-10",
        currentVolume: 6727.00,
        currentRatio: 17.3,
        profit: 0.91,
        duration: 1.89,
        quotationId: "122268.SH",
        name: "12国航02",
        price: 67.27,
        quantity: 100,
      },
    };
  }
}
