import {ProductOverviewData} from "../../models/invreq/Bought/Product/ProductOverviewData";
import {ProductAnalysisService} from "../ProductAnalysisService";
import {
  ComparisionTableList, MemorabiliaResponse,
  ProfitAndDrawDown, ResidualAnalysisResponse,
  SceneAnalysisResponse, SensitivityList,
} from "../../models/invreq/Bought/Product/ProductAnalysis";

export class ProductAnalysisServiceMock extends ProductAnalysisService {

  /**
   * 得到商品市场的总览数据
   * @param {string} invreqId 配置id
   * @returns {Promise<ProductOverviewData>}
   */
  async getProductOverviewData(invreqId: string): Promise<ProductOverviewData> {
    return {
      futuresOverview: {
        startDate: "2018-09-10",
        currentVolume: 4239.00,
        currentRatio: 10.90,
        profit: 1.72,
        quotaId: "SC1909",
        name: "原油期货",
        price: 21.20,
        quantity: 200,
      },
      spotOverview: {
        startDate: "2018-06-05",
        currentVolume: 9113.00,
        currentRatio: 23.44,
        profit: 0.56,
        quotaId: "CL002",
        name: "原油现货",
        price: 33.63,
        quantity: 300,
      },
    };
  }

  /**
   * 得到动态回撤和绝对收益图
   * @param {string} invreqId
   * @returns {Promise<ProfitAndDrawDown>}
   */
  async getProfitAndDrawdown(invreqId: string): Promise<ProfitAndDrawDown> {
    return {
      absoluteReturn: [
        {
          date: "2018-06-01",
          bonusRatio: [
            {
              name: "期货",
              ratio: 5.22,
            },
            {
              name: "现货",
              ratio: 10.45,
            },
          ],
          totalIncomeRatio: 19.22,
          totalIncome: 15.11,
        },
        {
          date: "2018-06-02",
          bonusRatio: [
            {
              name: "期货",
              ratio: 9.11,
            },
            {
              name: "现货",
              ratio: 17.22,
            },
          ],
          totalIncomeRatio: 20.22,
          totalIncome: 10.11,
        },
        {
          date: "2018-06-03",
          bonusRatio: [
            {
              name: "期货",
              ratio: 20.22,
            },
            {
              name: "现货",
              ratio: 14.45,
            },
          ],
          totalIncomeRatio: 12.22,
          totalIncome: 5.11,
        },
      ],
      maxDrawdown: 60.11,
      startDate: "2018-06-01",
      endDate: "2018-07-11",
      days: 45,
    };
  }

  /**
   * 得到场景分析数据
   * @param {string} invreqId
   * @returns {Promise<SceneAnalysisResponse>}
   */
  async getSceneData(invreqId: string): Promise<SceneAnalysisResponse> {
    return {
      typeData: [
          {
            type: "趋势强波动高",
            weekNum: 24,
            sharpeRatio: 53.11,
            calmarRatio: 34.01,
            maxWeekIncomeRatio: 33.99,
            minWeekIncomeRatio: 25.34,
            fluctuationRatio: 7.13,
            maxDrawdown: 0.11,
          },
          {
            type: "趋势弱波动高",
            weekNum: 21,
            sharpeRatio: 46.44,
            calmarRatio: 31.11,
            maxWeekIncomeRatio: 57.22,
            minWeekIncomeRatio: 76.83,
            fluctuationRatio: 7.13,
            maxDrawdown: 0.62,
          },
          {
            type: "趋势强波动低",
            weekNum: 9,
            sharpeRatio: 7.22,
            calmarRatio: 56.1,
            maxWeekIncomeRatio: 4.72,
            minWeekIncomeRatio: 6.25,
            fluctuationRatio: 8.33,
            maxDrawdown: 0.35,
          },
          {
            type: "趋势弱波动低",
            weekNum: 6,
            sharpeRatio: 53.11,
            calmarRatio: 34.01,
            maxWeekIncomeRatio: 33.99,
            minWeekIncomeRatio: 25.34,
            fluctuationRatio: 7.13,
            maxDrawdown: 0.11,
          },
        ],
        totalIncomeRatioList: [
          {
            date: "2018-06-01",
            totalIncomeRatio: 12.09,
            type: "趋势强波动高",
          },
          {
            date: "2018-06-02",
            totalIncomeRatio: 13.44,
            type: "趋势强波动高",
          },
          {
            date: "2018-06-03",
            totalIncomeRatio: 21.43,
            type: "趋势强波动高",
          },
          {
            date: "2018-06-04",
            totalIncomeRatio: 29.26,
            type: "趋势强波动低",
          },
          {
            date: "2018-06-05",
            totalIncomeRatio: 30.12,
            type: "趋势强波动低",
          },
          {
            date: "2018-06-06",
            totalIncomeRatio: 49.11,
            type: "趋势强波动高",
          },
          {
            date: "2018-06-07",
            totalIncomeRatio: 57.14,
            type: "趋势弱波动高",
          },
          {
            date: "2018-06-08",
            totalIncomeRatio: 61.66,
            type: "趋势弱波动高",
          },
          {
            date: "2018-06-09",
            totalIncomeRatio: 69.00,
            type: "趋势强波动高",
          },
          {
            date: "2018-06-10",
            totalIncomeRatio: 70.11,
            type: "趋势弱波动低",
          },
          {
            date: "2018-06-11",
            totalIncomeRatio: 12.09,
            type: "趋势强波动高",
          },
          {
            date: "2018-06-12",
            totalIncomeRatio: 13.44,
            type: "趋势强波动高",
          },
          {
            date: "2018-06-13",
            totalIncomeRatio: 21.43,
            type: "趋势强波动高",
          },
          {
            date: "2018-06-14",
            totalIncomeRatio: 29.26,
            type: "趋势强波动低",
          },
          {
            date: "2018-06-15",
            totalIncomeRatio: 30.12,
            type: "趋势强波动低",
          },
          {
            date: "2018-06-16",
            totalIncomeRatio: 49.11,
            type: "趋势强波动高",
          },
          {
            date: "2018-06-17",
            totalIncomeRatio: 57.14,
            type: "趋势弱波动高",
          },
          {
            date: "2018-06-18",
            totalIncomeRatio: 61.66,
            type: "趋势弱波动高",
          },
          {
            date: "2018-06-19",
            totalIncomeRatio: 69.00,
            type: "趋势强波动高",
          },
          {
            date: "2018-06-20",
            totalIncomeRatio: 70.11,
            type: "趋势弱波动低",
          },
        ],
    };
  }

  /**
   * 得到每日与市场基准的比较
   * @param {string} invreqId
   * @returns {Promise<ComparisionTableList>}
   */
  async getComparision(invreqId: string): Promise<ComparisionTableList> {
    return {
      comparisionWithMarketBenchmark: [
        {
          date: "2018-06-01",
          marketRatio1: 34.11,
          marketRatio2: 23.11,
          totalIncomeRatio: 35.66,
        },
        {
          date: "2018-06-02",
          marketRatio1: 33.14,
          marketRatio2: 26.11,
          totalIncomeRatio: 34.11,
        },
        {
          date: "2018-06-03",
          marketRatio1: 35.01,
          marketRatio2: 24.11,
          totalIncomeRatio: 33.66,
        },
      ],
    };
  }

  /**
   * 得到因子敏感性分析数据
   * @param {string} invreqId
   * @returns {Promise<SensitivityList>}
   */
  async getSensitivity(invreqId: string): Promise<SensitivityList> {
    return {
      factorSensitivity: [
          {
            weekIncomeRatio: 23.11,
            weekFluctuationRatio: 24.11,
          },
          {
            weekIncomeRatio: 24.56,
            weekFluctuationRatio: 10.34,
          },
          {
            weekIncomeRatio: 32.14,
            weekFluctuationRatio: 16.12,
          },
        ],
        x1: 3.99,
        y1: 6.11,
        x2: 5.88,
        y2: 7.22,
    };
  }

  /**
   * 得到残差项分析数据
   * @param {string} invreqId
   * @returns {Promise<ResidualAnalysisResponse>}
   */
  async getResidual(invreqId: string): Promise<ResidualAnalysisResponse> {
    return {
      residualList: [
          {
            date: "2018-06-01",
            residual: 2.13,
          },
          {
            date: "2018-06-02",
            residual: 3.11,
          },
          {
            date: "2018-06-03",
            residual: 1.90,
          },
          {
            date: "2018-06-04",
            residual: 2.42,
          },
        ],
        kurt: 6.66,
        skew: 1.09,
    };
  }

  /**
   * 得到大事记数据
   * @param {string} invreqId
   * @returns {Promise<MemorabiliaResponse>}
   */
  async getMemorabilia(invreqId: string): Promise<MemorabiliaResponse> {
    return {
      memorabilia: [
        {
          scene: "情景1",
          startDate: "2018-06-21",
          endDate: "2018-07-01",
          returnRatio: 53.11,
          maxDrawdown: 78.33,
          fluctuation: 2.11,
          nanhuaMarketRatio: 53.11,
        },
      ],
    };
  }
}
