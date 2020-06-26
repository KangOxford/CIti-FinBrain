import { Inject, Injectable } from "react.di";
import { HttpService } from "./HttpService";
import {ProductOverviewData} from "../models/invreq/Bought/Product/ProductOverviewData";
import {
  ComparisionTableList, MemorabiliaResponse,
  ProfitAndDrawDown, ResidualAnalysisResponse, ResidualTableList,
  SceneAnalysisResponse, SensitivityList,
} from "../models/invreq/Bought/Product/ProductAnalysis";

@Injectable
export class ProductAnalysisService {

  constructor(@Inject private httpService: HttpService) { }

  /**
   * 得到商品市场的总览数据
   * @param {string} invreqId 配置id
   * @returns {Promise<ProductOverviewData>}
   */
  async getProductOverviewData(invreqId: string): Promise<ProductOverviewData> {
    const res = await this.httpService.fetch({
      path: `invreq/${invreqId}/goods`,
    });

    return res.response;
  }

  /**
   * 得到动态回撤和绝对收益图
   * @param {string} invreqId
   * @returns {Promise<ProfitAndDrawDown>}
   */
  async getProfitAndDrawdown(invreqId: string): Promise<ProfitAndDrawDown> {
    const res = await this.httpService.fetch({
      path: `invreq/${invreqId}/goods/dynamic_drawdown_and_absolute_return`,
    });

    return res.response;
  }

  /**
   * 得到场景分析数据
   * @param {string} invreqId
   * @returns {Promise<SceneAnalysisResponse>}
   */
  async getSceneData(invreqId: string): Promise<SceneAnalysisResponse> {
    const res = await this.httpService.fetch({
      path: `invreq/${invreqId}/goods/scene_analysis`,
    });

    return res.response;
  }

  /**
   * 得到每日与市场基准的比较
   * @param {string} invreqId
   * @returns {Promise<ComparisionTableList>}
   */
  async getComparision(invreqId: string): Promise<ComparisionTableList> {
    const res = await this.httpService.fetch({
      path: `invreq/${invreqId}/goods/comparision_with_market_benchmark`,
    });

    return res.response;
  }

  /**
   * 得到因子敏感性分析数据
   * @param {string} invreqId
   * @returns {Promise<SensitivityList>}
   */
  async getSensitivity(invreqId: string): Promise<SensitivityList> {
    const res = await this.httpService.fetch({
      path: `invreq/${invreqId}/goods/factor_sensitivity_analysis`,
    });

    return res.response;
  }

  /**
   * 得到残差项分析数据
   * @param {string} invreqId
   * @returns {Promise<ResidualAnalysisResponse>}
   */
  async getResidual(invreqId: string): Promise<ResidualAnalysisResponse> {
    const res = await this.httpService.fetch({
      path: `invreq/${invreqId}/goods/residual_analysis`,
    });

    return res.response;
  }

  /**
   * 得到大事记数据
   * @param {string} invreqId
   * @returns {Promise<MemorabiliaResponse>}
   */
  async getMemorabilia(invreqId: string): Promise<MemorabiliaResponse> {
    const res = await this.httpService.fetch({
      path: `invreq/${invreqId}/goods/memorabilia`,
    });

    return res.response;
  }
}
