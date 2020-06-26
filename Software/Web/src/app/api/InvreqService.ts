import { Inject, Injectable } from "react.di";
import { HttpService } from "./HttpService";
import { InvReq, InvReqList } from "../models/invreq/InvReq";
import { InvReqInit } from "../models/invreq/InvReqInit";
import { HttpMethod } from "./utils";
import { OverviewData } from "../models/invreq/Bought/OverviewData";
import { MatchingList, OverviewMatching } from "../models/invreq/Bought/MatchingList";
import {
  DailyTransaction, DailyTransactionRespense,
  PlanTransaction,
  TransactionDetailList,
  TransactionLog,
} from "../models/invreq/Bought/TransactionLog";
import { ReallocationDetail, ReallocationLog } from "../models/invreq/Bought/ReallocationLog";
import { BoughtTranSetting } from "../models/invreq/Bought/BoughtTranSetting";
import { EarningList } from "../models/invreq/Bought/EarnList";
import {StockOverviewData} from "../models/invreq/Bought/Stock/StockOverviewData";
import {DailyPositionList} from "../models/invreq/Bought/DailyPosition";
import { getTodayDate } from "../../utils/Date";
import { waitForMs } from "../../utils/Wait";

@Injectable
export class InvreqService {

  constructor(@Inject private httpService: HttpService) { }

  /**
   * 得到用户所有的资产账户
   * @returns {Promise<InvReqList>} 资产账户列表
   */
  async getAllInvreqAccounts(): Promise<InvReqList> {
    const res = await this.httpService.fetch({
      path: "invreq",
    });

    return res.response;
  }

  /**
   * 得到某个资产账户
   * @param {string} invreqId 资产账户ID
   * @returns {Promise<InvReq>} 资产账户
   */
  async getInvreqAccount(invreqId: string): Promise<InvReq> {
    const res = await this.httpService.fetch({
      path: `invreq/${invreqId}`,
    });

    return res.response;
  }

  /**
   * 提交初始化需求
   * @param {InvReqInit} params 初始化需求表格
   * @returns {Promise<void>}
   */
  async createInvreq(params: InvReqInit): Promise<{ invreqId: string }> {
    const res = await this.httpService.fetch({
      path: "invreq",
      body: params,
      method: HttpMethod.POST,
    });

    return res.response;
  }

  /**
   * 得到用户总览信息数据
   * @param {string} invreqId 投资需求id
   * @returns {Promise<OverviewData>} 账户信息总览
   */
  async getOverview(invreqId: string): Promise<OverviewData> {
    const data = await this.httpService.fetch({
      path: `invreq/${invreqId}/overview`,

    });

    return data.response;
  }
  /**
   * 得到投资需求中股票、债券、商品市场的配比详情
   * @param {string} invreqId 投资需求id
   * @returns {Promise<OverviewMatching>} 股票、债券、商品市场的配比详情
   */
  async getMatching(invreqId: string): Promise<OverviewMatching> {

    const data = await this.httpService.fetch({
      path: `invreq/${invreqId}/matchings`,
    });

    return data.response;
  }

  /**
   * 得到投资需求中股票、债券、商品市场的配比详情
   * @param {string} invreqId 投资需求id
   * @returns {Promise<OverviewMatching>} 股票、债券、商品市场的配比详情
   */
  async getDetailMatching(invreqId: string): Promise<MatchingList> {

    const data = await this.httpService.fetch({
      path: `invreq/${invreqId}/matchings/detail`,
    });

    return data.response;
  }

  /**
   * 得到投资需求的交易记录
   * @param {string} invreqId 投资需求id
   * @returns {Promise<TransactionLog>} 交易记录列表
   */
  async getTransactionLog(invreqId: string): Promise<TransactionLog> {

    const data = await this.httpService.fetch({
      path: `invreq/${invreqId}/transactions`,
    });

    console.log(data.response);
    return data.response;
  }

  /**
   * 根据资产配置id及交易ID得到交易记录（用于调仓界面查看详细交易记录）
   * @param {string} invreqId 投资需求id
   * @param {string} date 交易日期，格式2018-9-7
   * @returns {Promise<TransactionDetailList>} 当天的交易列表
   */
  async getDailyTransaction(invreqId: string, date: string = getTodayDate()): Promise<DailyTransactionRespense> {

    const res = await this.httpService.fetch({
      path: `invreq/${invreqId}/dailyTransactions`,
      queryParams: { date },
    });

    return res.response;
  }

  /**
   * 根据投资需求id得到所有调仓的记录
   * @param {string} invreqId 投资需求id
   * @returns {Promise<ReallocationLog>} 每次调仓的配资比例列表
   */
  async getReallocationLog(invreqId: string): Promise<ReallocationLog> {

    const res = await this.httpService.fetch({
      path: `invreq/${invreqId}/position/reallocation`,

    });
    console.log(res.response);
    return res.response;
  }

  /**
   * 根据日期得到调仓记录
   * @param {string} invreqId 投资需求id
   * @param {string} date 交易日期，格式2018-9-7
   * @returns {Promise<ReallocationDetail>}
   */
  async getReallocation(invreqId: string, date: string = getTodayDate()): Promise<ReallocationDetail> {

    const res = await this.httpService.fetch({
      path: `invreq/${invreqId}/position/reallocation/${date}`,

    });

    return res.response;
  }

  /**
   * 得到当前投资需求的交易设置
   * @param {string} invreqId 投资需求id
   * @returns {Promise<BoughtTranSetting>} 交易设置数据
   */
  async getBoughtTranSetting(invreqId: string): Promise<BoughtTranSetting> {

    const res = await this.httpService.fetch({
      path: `invreq/${invreqId}/settings`,

    });
    console.log(res.response);
    return res.response;
  }

  /**
   * 提交一次更改后的交易设置信息
   * @param {string} invreqId 投资需求id
   * @param {BoughtTranSetting} setting 交易设置
   * @returns {Promise<void>}
   */
  async setBoughtTranSetting(invreqId: string, setting: BoughtTranSetting): Promise<void> {
    await this.httpService.fetch({
      path: `invreq/${invreqId}/settings`,
      method: HttpMethod.PUT,
      body: setting,
    });
  }

  /**
   * 赎回（取消）此资产账户
   * @param {string} invreqId 投资需求id
   * @returns {Promise<void>}
   */
  async redeemAccount(invreqId: string): Promise<void> {
    await this.httpService.fetch({
      path: `invreq/${invreqId}`,
      method: HttpMethod.DELETE,
    });
  }

  /**
   * 得到收益列表
   * @param {string} invreqId 投资需求id
   * @returns {Promise<EarningList>}
   */
  async getEarningList(invreqId: string): Promise<EarningList> {
    const res = await this.httpService.fetch({
      path: `invreq/${invreqId}/earnings`,
    });

    console.log("earning!" + res.response);
    return res.response;
  }

  /**
   * 得到计划交易的信息
   * 需要前端连续的向后端请求，若为null则为无计划交易
   * @param {string} invreqId 投资需求id
   * @returns {Promise<PlanTransaction>} 交易信息
   */
  async getPlanTransaction(invreqId: string): Promise<PlanTransaction> {
    const res = await this.httpService.fetch({
      path: `invreq/${invreqId}/plannedTransactions`,

    });

    return res.response;

  }

  /**
   * 确认进行计划交易
   * @param {string} invreqId invreq ID
   * @returns {Promise<void>}
   */
  async confirmPlanTran(invreqId: string): Promise<void> {
    const res = await this.httpService.fetch({
      path: `invreq/${invreqId}/plannedTransactions`,
      method: HttpMethod.POST,
    });
  }

  /**
   * 取消计划交易
   * @param {string} invreqId 需求ID
   * @param {string} tranId 交易ID
   * @returns {Promise<void>}
   */
  async cancelPlanTran(invreqId: string): Promise<void> {

    const res = await this.httpService.fetch({
      path: `invreq/${invreqId}/plannedTransactions`,
      method: HttpMethod.DELETE,
    });

    // if (Math.random() <= 0.5) {
    //   throw {
    //     statusCode: 400,
    //   } as NetworkError;
    // }
  }

  /**
   * 得到每日持仓
   * @param {string} invreqId
   * @returns {Promise<DailyPositionList>}
   */
  async getDailyPositionList(invreqId: string): Promise<DailyPositionList> {
    const res = await this.httpService.fetch({
      path: `invreq/${invreqId}/position/dailyPosition`,

    });

    return res.response;
  }
}
