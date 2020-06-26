import { Injectable } from "react.di";
import { StockAnalysisService } from "../StockAnalysisService";
import { AchievmentData, PerformChartList } from "../../models/invreq/Bought/Stock/PerformAnalysis";
import { AttributeData} from "../../models/invreq/Bought/Stock/AttributeAnalysis";
import { MarketState, ScenarioData } from "../../models/invreq/Bought/Stock/ScenarioAnalysis";
import { StockOverviewData } from "../../models/invreq/Bought/Stock/StockOverviewData";

@Injectable
export class StockAnalysisServiceMock extends StockAnalysisService {

  /**
   * 得到股票市场表现的总体信息
   * @param {string} invreq
   * @returns {Promise<StockOverviewData>}
   */
  async getStockOverviewData(invreq: string): Promise<StockOverviewData> {
    return {
      startDate: "2017-08-27",
      currentVolume: 15554.00,
      currentRatio: 40.11,
    };
  }

  /**
   * 得到超额回撤和超额收益数据，用于业绩分析
   * @param {string} invreq
   * @returns {Promise<PerformChartList>}
   */
  async getAchievement(invreq: string): Promise<AchievmentData> {
    return {
      chartData: [
        {
          date: "2016-09-01",
          returnNum: -13.02,
          revenueNum: -1.05,
        }, {
          date: "2016-010-01",
          returnNum: -5.02,
          revenueNum: -3.05,
        },
        {
          date: "2016-11-01",
          returnNum: -15.02,
          revenueNum: 4.05,
        },
        {
          date: "2016-12-01",
          returnNum: -18.02,
          revenueNum: 3.05,
        },
        {
          date: "2017-01-01",
          returnNum: -36.02,
          revenueNum: 5.85,
        }, {
          date: "2017-02-01",
          returnNum: -25.02,
          revenueNum: 9.05,
        }, {
          date: "2017-03-01",
          returnNum: -30.02,
          revenueNum: 5.05,
        }, {
          date: "2017-04-01",
          returnNum: -17.02,
          revenueNum: 3.05,
        }, {
          date: "2017-05-01",
          returnNum: -3.02,
          revenueNum: -1.05,
        }, {
          date: "2017-06-01",
          returnNum: -39.02,
          revenueNum: 2.05,
        }, {
          date: "2017-07-01",
          returnNum: -31.02,
          revenueNum: 0.05,
        }, {
          date: "2017-08-01",
          returnNum: -19.02,
          revenueNum: 7.65,
        }, {
          date: "2017-09-01",
          returnNum: -24.02,
          revenueNum: 1.05,
        }, {
          date: "2017-10-01",
          returnNum: -30.02,
          revenueNum: 5.05,
        },  {
          date: "2017-11-01",
          returnNum: -26.02,
          revenueNum: 2.05,
        },  {
          date: "2017-12-01",
          returnNum: -29.02,
          revenueNum: 10.05,
        }, {
          date: "2018-03-01",
          returnNum: -25.02,
          revenueNum: 7.05,
        }, {
          date: "2018-06-01",
          returnNum: -33.02,
          revenueNum: 4.05,
        },
      ],
      formData: [
        {
          quotaName: "xx股票",
          period: 134, // 周期数：月
          totalRevenue: 34.90, // 超额累计回撤率：百分比
          monthly: 26.43, // 月胜率：百分比
          maxReturn: 45.77, // 超额最大回撤率：百分比
          maxReturnBegin: "2018-07-21", // 超额最大回撤起始日期：date
          maxReturnEnd: "2018-09-14", // 超额最大回撤结束日期：date
          maxReturnSupplement: 153, // 超额最大回撤补期：天
        },
        {
          quotaName: "股票多头指数",
          period: null, // 周期数：月
          totalRevenue: null, // 超额累计回撤率：百分比
          monthly: null, // 月胜率：百分比
          maxReturn: null, // 超额最大回撤率：百分比
          maxReturnBegin: null, // 超额最大回撤起始日期：date
          maxReturnEnd: null, // 超额最大回撤结束日期：date
          maxReturnSupplement: null, // 超额最大回撤补期：天
        },
      ],
    };
  }

  /**
   * 得到归因分析页面的数据
   * @param {string} invreqId
   * @returns {Promise<void>}
   */
  async getReason(invreqId: string): Promise<AttributeData> {
    return {
      styleConfigChart: [
        {
          date: "2016-09-01",
          styleTiming: -1.42,
          styleChoosing: 4.15,
          fundOver: 0.94,
          fundBaseOver: 0.42,
        },
        {
          date: "2016-12-01",
          styleTiming: 5.42,
          styleChoosing: 6.15,
          fundOver: 4.25,
          fundBaseOver: 2.23,
        },
        {
          date: "2017-03-01",
          styleTiming: 3.42,
          styleChoosing: 4.15,
          fundOver: 3.43,
          fundBaseOver: 3.66,
        },
        {
          date: "2017-06-01",
          styleTiming: 6.11,
          styleChoosing: -2.45,
          fundOver: 6.24,
          fundBaseOver: 2.16,
        },
        {
          date: "2017-09-01",
          styleTiming: 2.75,
          styleChoosing: 6.24,
          fundOver: 7.01,
          fundBaseOver: 5.36,
        },
        {
          date: "2017-12-01",
          styleTiming: 0.55,
          styleChoosing: -3.53,
          fundOver: 6.25,
          fundBaseOver: 4.22,
        },
        {
          date: "2016-10-01",
          styleTiming: 6.22,
          styleChoosing: 1.53,
          fundOver: 4.74,
          fundBaseOver: 3.66,
        },
        {
          date: "2016-11-01",
          styleTiming: -1.42,
          styleChoosing: 4.15,
          fundOver: 0.94,
          fundBaseOver: 0.42,
        },
        {
          date: "2017-01-01",
          styleTiming: 5.42,
          styleChoosing: 6.15,
          fundOver: 0.25,
          fundBaseOver: 1.23,
        },
        {
          date: "2017-02-01",
          styleTiming: 3.42,
          styleChoosing: 4.15,
          fundOver: 2.43,
          fundBaseOver: 1.66,
        },
        {
          date: "2017-04-01",
          styleTiming: 6.11,
          styleChoosing: -2.45,
          fundOver: 6.24,
          fundBaseOver: 2.16,
        },
        {
          date: "2017-05-01",
          styleTiming: 2.75,
          styleChoosing: 6.24,
          fundOver: 7.01,
          fundBaseOver: 5.36,
        },
        {
          date: "2017-07-01",
          styleTiming: 0.55,
          styleChoosing: -3.53,
          fundOver: 6.25,
          fundBaseOver: 4.22,
        },
        {
          date: "2017-08-01",
          styleTiming: 6.22,
          styleChoosing: 1.53,
          fundOver: 4.74,
          fundBaseOver: 3.66,
        },
      ],
      styleConfigForm: [
        {
          style: "风格择时贡献", // 风格
          winRate: 63.04, // 胜率：百分数
          yearRevenue: 2.78, // 年化收益率：百分数
        },
        {
          style: "风格选股贡献", // 风格
          winRate: 67.04, // 胜率：百分数
          yearRevenue: 6.13, // 年化收益率：百分数
        },
      ],
      styleExplainForm: [
        {
          season: "2017Q3",
          rSquare: 0.917,
        },
        {
          season: "2017Q2",
          rSquare: 0.911,
        },
        {
          season: "2017Q1",
          rSquare: 0.944,
        },
        {
          season: "2016Q4",
          rSquare: 0.877,
        },
        {
          season: "2016Q3",
          rSquare: 0.741,
        },
        {
          season: "2016Q2",
          rSquare: 0.721,
        },
        {
          season: "2016Q1",
          rSquare: 0.727,
        },
        {
          season: "2015Q4",
          rSquare: 0.851,
        },
        {
          season: "2015Q3",
          rSquare: 0.941,
        },
      ],
      preferAndContributionChart: [
        {
          style: "平均持仓", // 风格
          largeGrowth: 11.45, // 大盘成长：百分数
          largeValue: 4.67, // 大盘价值：百分数
          middleGrowth: 6.26, // 中盘成长：百分数
          middleValue: 9.15, // 中盘价值：百分数
          smallGrowth: 35.14, // 小盘成长：百分数
          smallValue: 36.22, // 小盘价值：百分数
        },
        {
          style: "平均超额收益率", // 风格
          largeGrowth: 5.52, // 大盘成长：百分数
          largeValue: -0.22, // 大盘价值：百分数
          middleGrowth: -1.42, // 中盘成长：百分数
          middleValue: -2.53, // 中盘价值：百分数
          smallGrowth: 1.57, // 小盘成长：百分数
          smallValue: 3.15, // 小盘价值：百分数
        },
      ],
      styleExposeChart: [
        {
          name: "大盘成长",
          season: "2016Q4",
          value: 502,
        },
        {
          name: "大盘成长",
          season: "2017Q1",
          value: 635,
        },
        {
          name: "大盘成长",
          season: "2017Q2",
          value: 809,
        },
        {
          name: "大盘成长",
          season: "2017Q3",
          value: 5268,
        },
        {
          name: "大盘成长",
          season: "2017Q4",
          value: 4400,
        },
        {
          name: "大盘成长",
          season: "2018Q1",
          value: 3634,
        },
        {
          name: "大盘成长",
          season: "2018Q2",
          value: 947,
        },
        {
          name: "大盘成长",
          season: "2018Q3",
          value: 106,
        },
        {
          name: "大盘价值",
          season: "2016Q4",
          value: 230,
        },
        {
          name: "大盘价值",
          season: "2017Q1",
          value: 400,
        },
        {
          name: "大盘价值",
          season: "2017Q2",
          value: 609,
        },
        {
          name: "大盘价值",
          season: "2017Q3",
          value: 4700,
        },
        {
          name: "大盘价值",
          season: "2017Q4",
          value: 3800,
        },
        {
          name: "大盘价值",
          season: "2018Q1",
          value: 3200,
        },
        {
          name: "大盘价值",
          season: "2018Q2",
          value: 879,
        },
        {
          name: "大盘价值",
          season: "2018Q3",
          value: 78,
        },
      ],
      // preferAndContributionChart: [
      //   {
      //     name: "大盘成长",
      //     s2016Q4: 18.9,
      //     s2017Q1: 28.8,
      //     s2017Q2: 39.3,
      //     s2017Q3: 81.4,
      //     s2017Q4: 47,
      //     s2018Q1: 20.3,
      //     s2018Q2: 24,
      //     s2018Q3: 35.6,
      //   },
      //   {
      //     name: "大盘价值",
      //     s2016Q4: -18.9,
      //     s2017Q1: -28.8,
      //     s2017Q2: -39.3,
      //     s2017Q3: -81.4,
      //     s2017Q4: -47,
      //     s2018Q1: -20.3,
      //     s2018Q2: -24,
      //     s2018Q3: -35.6,
      //   },
      //   {
      //     name: "中盘成长",
      //     s2016Q4: 12.4,
      //     s2017Q1: 23.2,
      //     s2017Q2: 34.5,
      //     s2017Q3: 99.7,
      //     s2017Q4: 52.6,
      //     s2018Q1: 35.5,
      //     s2018Q2: 37.4,
      //     s2018Q3: 42.4,
      //   },
      //   {
      //     name: "中盘价值",
      //     s2016Q4: -12.4,
      //     s2017Q1: -23.2,
      //     s2017Q2: -34.5,
      //     s2017Q3: -99.7,
      //     s2017Q4: -52.6,
      //     s2018Q1: -35.5,
      //     s2018Q2: -37.4,
      //     s2018Q3: -42.4,
      //   },
      // ],
    };
  }

  /**
   * 得到场景分析页面的数据
   * @param {string} invreqId
   * @returns {Promise<ScenarioData>}
   */
  async getScene(invreqId: string): Promise<ScenarioData> {
    return {
      marketRouteForm: [
        {
          index: "周期数", // 指标
          obviousUp: "143", // 市场显著上升
          waveryUp: "203", // 市场震荡上升
          obviousDown: "105", // 市场显著下降
          waveryDown: "130", // 市场震荡下降
        },
        {
          index: "周收益率区间范围", // 指标
          obviousUp: "-4.25%~5.36%", // 市场显著上升
          waveryUp: "-2.55%~2.36%", // 市场震荡上升
          obviousDown: "-11.35%~7.33%", // 市场显著下降
          waveryDown: "-3.60%~3.53%", // 市场震荡下降
        },
        {
          index: "场景收益占比", // 指标
          obviousUp: "117.37%", // 市场显著上升
          waveryUp: "87.00%", // 市场震荡上升
          obviousDown: "-101.02%", // 市场显著下降
          waveryDown: "-3.24%", // 市场震荡下降
        },
      ],
      marketRouteChart: [
        {
          date: "2016-06-01",
          myfund: 1017,
          marketState: MarketState.OBVIOUS_UP,
        },
        {
          date: "2016-06-02",
          myfund: 1790,
          marketState: MarketState.OBVIOUS_UP,
        },
        {
          date: "2016-06-03",
          myfund: 2422,
          marketState: MarketState.OBVIOUS_UP,
        },
        {
          date: "2016-06-04",
          myfund: 4522,
          marketState: MarketState.OBVIOUS_UP,
        },
        {
          date: "2016-06-05",
          myfund: 4367,
          marketState: MarketState.WAVERY_UP,
        }, {
          date: "2016-06-06",
          myfund: 4222,
          marketState: MarketState.OBVIOUS_DOWN,
        },
        {
          date: "2016-06-07",
          myfund: 4222,
          marketState: MarketState.OBVIOUS_DOWN,
        },
        {
          date: "2016-06-08",
          myfund: 4333,
          marketState: MarketState.WAVERY_DOWN,
        },
        {
          date: "2016-06-09",
          myfund: 1017,
          marketState: MarketState.OBVIOUS_UP,
        },
        {
          date: "2016-06-10",
          myfund: 1790,
          marketState: MarketState.OBVIOUS_UP,
        },
        {
          date: "2016-06-11",
          myfund: 2422,
          marketState: MarketState.OBVIOUS_UP,
        },
        {
          date: "2016-06-12",
          myfund: 4522,
          marketState: MarketState.OBVIOUS_UP,
        },
        {
          date: "2016-06-13",
          myfund: 4367,
          marketState: MarketState.WAVERY_UP,
        }, {
          date: "2016-06-14",
          myfund: 4222,
          marketState: MarketState.OBVIOUS_DOWN,
        },
        {
          date: "2016-06-15",
          myfund: 4222,
          marketState: MarketState.OBVIOUS_DOWN,
        },
        {
          date: "2016-06-16",
          myfund: 4333,
          marketState: MarketState.WAVERY_DOWN,
        },
        {
          date: "2016-06-17",
          myfund: 4367,
          marketState: MarketState.WAVERY_UP,
        }, {
          date: "2016-06-18",
          myfund: 4222,
          marketState: MarketState.OBVIOUS_DOWN,
        },
        {
          date: "2016-06-19",
          myfund: 4222,
          marketState: MarketState.OBVIOUS_DOWN,
        },
        {
          date: "2016-06-20",
          myfund: 4333,
          marketState: MarketState.WAVERY_DOWN,
        },
      ],
      sensibilityChart: [
        {
          fluctuation: -3.00,
          lineRevenue: -1.00,
          curveRevenue: -0.95,
        },
        {
          fluctuation: -2.50,
          lineRevenue: -0.50,
          curveRevenue: -0.82,
        },
        {
          fluctuation: -2.00,
          lineRevenue: 0.00,
          curveRevenue: -1.11,
        },
        {
          fluctuation: -1.50,
          lineRevenue: 0.50,
          curveRevenue: -0.13,
        },
        {
          fluctuation: -1.00,
          lineRevenue: 1.00,
          curveRevenue: 0.46,
        },
        {
          fluctuation: -0.50,
          lineRevenue: 1.50,
          curveRevenue: 0.95,
        },
      ],
    };
  }
}
