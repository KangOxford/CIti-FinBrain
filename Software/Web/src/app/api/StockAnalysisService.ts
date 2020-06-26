import { Inject, Injectable } from "react.di";
import {HttpService} from "./HttpService";
import {AchievmentData, PerformChartList, PerformFormList} from "../models/invreq/Bought/Stock/PerformAnalysis";
import {AttributeData} from "../models/invreq/Bought/Stock/AttributeAnalysis";
import {MarketRouteFormList, ScenarioData} from "../models/invreq/Bought/Stock/ScenarioAnalysis";
import { StockOverviewData } from "../models/invreq/Bought/Stock/StockOverviewData";

@Injectable
export class StockAnalysisService {

  constructor(@Inject private httpService: HttpService) { }

  /**
   * 得到股票市场表现的总体信息
   * @param {string} invreqId
   * @returns {Promise<StockOverviewData>}
   */
  async getStockOverviewData(invreqId: string): Promise<StockOverviewData> {
    const res = await this.httpService.fetch({
      path: `invreq/${invreqId}/stock`,

    });

    return res.response;
  }

  /**
   * 得到超额回撤和超额收益数据，用于业绩分析
   * @param {string} invreqId
   * @returns {Promise<PerformChartList>}
   */
  async getAchievement(invreqId: string): Promise<AchievmentData> {
    console.log(invreqId);

    const data = await this.httpService.fetch({
      path: `invreq/${invreqId}/stock/perform`,
    });

    console.log(data.response);
    return data.response;
  }

  /**
   * 得到归因分析页面的数据
   * @param {string} invreqId
   * @returns {Promise<AttributeData>} 归因分析页面数据
   */
  async getReason(invreqId: string): Promise<AttributeData> {
    const data = await this.httpService.fetch({
      path: `invreq/${invreqId}/stock/attribute`,
    });

    return data.response;
  }

  /**
   * 得到场景分析页面的数据
   * @param {string} invreqId
   * @returns {Promise<ScenarioData>}
   */
  async getScene(invreqId: string): Promise<ScenarioData> {
    const data = await this.httpService.fetch({
      path: `invreq/${invreqId}/stock/scenario`,
    });

    console.log(data.response);
    return data.response;
  }
}
