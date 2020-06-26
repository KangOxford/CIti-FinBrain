import { Injectable } from "react.di";
import { InvreqService } from "../InvreqService";
import { OverviewData } from "../../models/invreq/Bought/OverviewData";
import {MatchingList, OverviewMatching} from "../../models/invreq/Bought/MatchingList";
import {
  Action, DailyTransaction, DailyTransactionRespense,
  PlanTransaction,
  TransactionDetailList,
  TransactionLog,
  TranType,
} from "../../models/invreq/Bought/TransactionLog";
import { ReallocationDetail, ReallocationLog } from "../../models/invreq/Bought/ReallocationLog";
import { BoughtTranSetting } from "../../models/invreq/Bought/BoughtTranSetting";
import { NetworkError } from "../NetworkResponse";
import moment from "moment";
import { InvReq, InvReqList } from "../../models/invreq/InvReq";
import { EarningList } from "../../models/invreq/Bought/EarnList";
import { StockOverviewData } from "../../models/invreq/Bought/Stock/StockOverviewData";
import { DailyPositionList } from "../../models/invreq/Bought/DailyPosition";
import { InvReqInit } from "../../models/invreq/InvReqInit";
import { waitForMs } from "../../../utils/Wait";

const dummyInvreq = [
  {
    invreqId: "001",
    bought: true,
    recommended: false,
  },
  {
    invreqId: "002",
    bought: false,
    recommended: false,
  },
  {
    invreqId: "003",
    bought: false,
    recommended: true,
  },
];

@Injectable
export class InvreqServiceMock extends InvreqService {

  /**
   * 得到用户所有的资产账户
   * @returns {Promise<InvReqList>} 资产账户列表
   */
  async getAllInvreqAccounts(): Promise<InvReqList> {
    return dummyInvreq;
  }

  async getInvreqAccount(invreqId: string): Promise<InvReq> {
    return dummyInvreq.find((x) => x.invreqId === invreqId) || {
      invreqId,
      bought: Math.random() < 0.5,
      recommended: Math.random() < 0.5,
    };
  }

  /**
   * 提交初始化需求
   * @param {InvReqInit} params 初始化需求表格
   * @returns {Promise<void>}
   */
  async createInvreq(params: InvReqInit): Promise<{ invreqId: string }> {
    return { invreqId: "002" };
  }

  /**
   * 得到用户总览信息数据
   * @param {string} invreqId 投资需求id
   * @returns {Promise<OverviewData>} 账户信息总览
   */
  async getOverview(invreqId: string): Promise<OverviewData> {
    return{
      accuRevenue: 5.32,  // 累计收益:百分率
      predRorYear: 2.01, // 预期年化收益:百分率
      todayRevenue: 2.79, // 今日收益：百分率
      startDate: "2018-08-27",  // 开始时间：精确到日期
      startVolume: 38800.00,  // 初始资金：保留两位小数
    };
  }

  /**
   * 得到投资需求中股票、债券、商品市场的配比详情
   * @param {string} invreqId 投资需求id
   * @returns {Promise<MatchingList>} 股票、债券、商品市场的配比详情
   */
  async getMatching(invreqId: string): Promise<OverviewMatching> {
    return {
      stockMatching: 75.25,
      bondMatching: 10.04,
      productionMatching: 14.71,
    };
  }

  /**
   * 得到投资需求中股票、债券、商品市场的配比详情
   * @param {string} invreqId 投资需求id
   * @returns {Promise<OverviewMatching>} 股票、债券、商品市场的配比详情
   */
  async getDetailMatching(invreqId: string): Promise<MatchingList> {
    return [
      {
        quotaName: "新力金融",
        quotaId: "600318.XSHG",
        totalValue: 4416.00,
        percentage: 11.36,
        type: TranType.STOCK,
      },
      {
        quotaName: "招商蛇口",
        quotaId: "001979.XSHE",
        totalValue: 3540.00,
        percentage: 9.10,
        type: TranType.STOCK,
      },
      {
        quotaName: "保利地产",
        quotaId: "600048.XSHG",
        totalValue: 4868.00,
        percentage: 12.52,
        type: TranType.STOCK,
      },
      {
        quotaName: "立昂技术",
        quotaId: "300603.XSHE",
        totalValue: 2730.00,
        percentage: 7.02,
        type: TranType.STOCK,
      },
      {
        quotaName: "10国债37",
        quotaId: "019037.SH",
        totalValue: 4938.00,
        percentage: 12.70,
        type: TranType.BOND,
      },
      {
        quotaName: "12国航02",
        quotaId: "122268.SH",
        totalValue: 6727.00,
        percentage: 17.3,
        type: TranType.BOND,
      },
      {
        quotaName: "原油期货",
        quotaId: "SC1909",
        totalValue: 4239.00,
        percentage: 10.90,
        type: TranType.GOODS,
      },
      {
        quotaName: "原油现货",
        quotaId: "CL002",
        totalValue: 9113.00,
        percentage: 23.44,
        type: TranType.GOODS,
      },
    ];
  }

  /**
   * 得到投资需求的交易记录
   * @param {string} invreqId 投资需求id
   * @returns {Promise<TransactionLog>} 交易记录列表
   */
  async getTransactionLog(invreqId: string): Promise<TransactionLog> {
    return [
      {
        time: "2018-08-27",
        children: [
          {
            time: "12:00:00",
            type: TranType.STOCK,
            quotaName: "新力金融",
            quotaId: "XM-21344",
            buyOrSale: Action.BUY,
            quantity: 400,
            price: 11.04,
            totalPrice: 4416.00,
            matching: 0.00,
            lastMatching: 12.01,
          },
          {
            time: "12:00:00",
            type: TranType.STOCK,
            quotaName: "立昂技术",
            quotaId: "300603.XSHE",
            buyOrSale: Action.BUY,
            quantity: 100,
            price: 27.3,
            totalPrice: 2730.00,
            matching: 0.00,
            lastMatching: 8.01,
          },
          {
            time: "12:00:00",
            type: TranType.STOCK,
            quotaName: "招商蛇口",
            quotaId: "001979.XSHE",
            buyOrSale: Action.BUY,
            quantity: 200,
            price: 17.7,
            totalPrice: 3540.00,
            matching: 0.00,
            lastMatching: 10.41,
          },
          {
            time: "12:00:00",
            type: TranType.STOCK,
            quotaName: "汇源通信",
            quotaId: "000586.XSHE",
            buyOrSale: Action.BUY,
            quantity: 200,
            price: 9.22,
            totalPrice: 1844.00,
            matching: 0.00,
            lastMatching: 7.41,
          },
        ],
      },
      {
        time: "2018-09-10",
        children: [{
            time: "12:00:00",
            type: TranType.STOCK,
            quotaName: "新力金融",
            quotaId: "XM-21344",
            buyOrSale: Action.BUY,
            quantity: 400,
            price: 11.04,
            totalPrice: 4416.00,
            matching: 12.01,
            lastMatching: 12.01,
          },
          {
            time: "12:00:00",
            type: TranType.STOCK,
            quotaName: "立昂技术",
            quotaId: "300603.XSHE",
            buyOrSale: Action.BUY,
            quantity: 100,
            price: 27.3,
            totalPrice: 2730.00,
            matching: 8.01,
            lastMatching: 8.01,
          },
          {
            time: "12:00:00",
            type: TranType.STOCK,
            quotaName: "招商蛇口",
            quotaId: "001979.XSHE",
            buyOrSale: Action.BUY,
            quantity: 200,
            price: 17.7,
            totalPrice: 3540.00,
            matching: 10.41,
            lastMatching: 10.41,
          },
          {
            time: "12:00:00",
            type: TranType.STOCK,
            quotaName: "保利地产",
            quotaId: "000586.XSHE",
            buyOrSale: Action.BUY,
            quantity: 400,
            price: 12.17,
            totalPrice: 4868.00,
            matching: 7.41,
            lastMatching: 7.41,
          },
          {
            time: "12:00:00",
            type: TranType.BOND,
            quotaName: "10国债37",
            quotaId: "019037.SH",
            buyOrSale: Action.BUY,
            quantity: 400,
            price: 12.17,
            totalPrice: 4938.00,
            matching: 13.61,
            lastMatching: 0.00,
          },
          {
            time: "12:00:00",
            type: TranType.BOND,
            quotaName: "12国航02",
            quotaId: "122268.SH",
            buyOrSale: Action.BUY,
            quantity: 200,
            price: 33.63,
            totalPrice: 6727.00,
            matching: 12.70,
            lastMatching: 0.00,
          },
          {
            time: "12:00:00",
            type: TranType.GOODS,
            quotaName: "原油期货",
            quotaId: "SC1909",
            buyOrSale: Action.BUY,
            quantity: 200,
            price: 21.20,
            totalPrice: 4239.00,
            matching: 10.90,
            lastMatching: 0.00,
          },
          {
            time: "12:00:00",
            type: TranType.GOODS,
            quotaName: "原油现货",
            quotaId: "CL002",
            buyOrSale: Action.BUY,
            quantity: 300,
            price: 33.63,
            totalPrice: 9133.00,
            matching: 23.44,
            lastMatching: 0.00,
          },
        ],
      },
    ];
  }

  /**
   * 根据资产配置id及日期得到当天的交易记录（用于调仓界面查看详细交易记录）
   * @param {string} invreqId 投资需求id
   * @param {string} date 日期:yy-mm-dd
   * @returns {Promise<TransactionDetailList>} 当天的交易列表
   */
  async getDailyTransaction(invreqId: string, date: string): Promise<DailyTransactionRespense> {
    return [{
        time: "2018-09-10",
        children: [
        {
            time: "12:00:00",
            type: TranType.STOCK,
            quotaName: "新力金融",
            quotaId: "XM-21344",
            buyOrSale: Action.BUY,
            quantity: 400,
            price: 11.04,
            totalPrice: 4416.00,
            matching: 12.01,
            lastMatching: 12.01,
          },
          {
            time: "12:00:00",
            type: TranType.STOCK,
            quotaName: "立昂技术",
            quotaId: "300603.XSHE",
            buyOrSale: Action.BUY,
            quantity: 100,
            price: 27.3,
            totalPrice: 2730.00,
            matching: 8.01,
            lastMatching: 8.01,
          },
          {
            time: "12:00:00",
            type: TranType.STOCK,
            quotaName: "招商蛇口",
            quotaId: "001979.XSHE",
            buyOrSale: Action.BUY,
            quantity: 200,
            price: 17.7,
            totalPrice: 3540.00,
            matching: 10.41,
            lastMatching: 10.41,
          },
          {
            time: "12:00:00",
            type: TranType.STOCK,
            quotaName: "保利地产",
            quotaId: "000586.XSHE",
            buyOrSale: Action.BUY,
            quantity: 400,
            price: 12.17,
            totalPrice: 4868.00,
            matching: 7.41,
            lastMatching: 7.41,
          },
          {
            time: "12:00:00",
            type: TranType.BOND,
            quotaName: "10国债37",
            quotaId: "019037.SH",
            buyOrSale: Action.BUY,
            quantity: 400,
            price: 12.17,
            totalPrice: 4938.00,
            matching: 13.61,
            lastMatching: 0.00,
          },
          {
            time: "12:00:00",
            type: TranType.BOND,
            quotaName: "12国航02",
            quotaId: "122268.SH",
            buyOrSale: Action.BUY,
            quantity: 200,
            price: 33.63,
            totalPrice: 6727.00,
            matching: 12.70,
            lastMatching: 0.00,
          },
          {
            time: "12:00:00",
            type: TranType.GOODS,
            quotaName: "原油期货",
            quotaId: "SC1909",
            buyOrSale: Action.BUY,
            quantity: 200,
            price: 33.63,
            totalPrice: 4239.00,
            matching: 10.90,
            lastMatching: 0.00,
          },
          {
            time: "12:00:00",
            type: TranType.GOODS,
            quotaName: "原油现货",
            quotaId: "CL002",
            buyOrSale: Action.BUY,
            quantity: 200,
            price: 33.63,
            totalPrice: 9133.00,
            matching: 23.44,
            lastMatching: 0.00,
          },
        ],
      }];
  }

  /**
   * 根据投资需求id得到所有调仓的记录
   * @param {string} invreqId 投资需求id
   * @returns {Promise<ReallocationLog>} 每次调仓的配资比例列表
   */
  async getReallocationLog(invreqId: string): Promise<ReallocationLog> {
    return [
      {
        tranDate: "08-27",
        tranNum: 2,
        perOfStock: 42.40,
        changeOfStock: 0.00,
        perOfBond: 34.79,
        changeOfBond: 0.00,
        perOfProduct: 22.81,
        changeOfProduct: 0.00,
      },
      {
        tranDate: "09-04",
        tranNum: 2,
        perOfStock: 39.67,
        changeOfStock: -2.73,
        perOfBond: 32.09,
        changeOfBond: -2.70,
        perOfProduct: 28.24,
        changeOfProduct: 5.43,
      },
      {
        tranDate: "09-15",
        tranNum: 2,
        perOfStock: 40.11,
        changeOfStock: 0.44,
        perOfBond: 33.88,
        changeOfBond: 1.79,
        perOfProduct: 26.01,
        changeOfProduct: 2.23,
      },
    ];
  }

  /**
   * 根据id得到调仓记录
   * @param {string} invreqId 投资需求id
   * @param {string} date 日期
   * @returns {Promise<ReallocationDetail>}
   */
  async getReallocation(invreqId: string, date: string): Promise<ReallocationDetail> {
    return {
      tranDate: "2018-06-5",
      tranNum: 2,
      perOfStock: 90.00,
      changeOfStock: 4.02,
      perOfBond: 5.00,
      changeOfBond: -3.21,
      perOfProduct: 5.00,
      changeOfProduct: -1.02,
    };
  }

  /**
   * 得到当前投资需求的交易设置
   * @param {string} invreqId 投资需求id
   * @returns {Promise<BoughtTranSetting>} 交易设置数据
   */
  async getBoughtTranSetting(invreqId: string): Promise<BoughtTranSetting> {
    return {
      planTranTime: 0,
      planRemindTime: 1,
      minConfirmedPrice: 3000,
      confirmTime: 1,
      defaultConfirm: true,
    };
  }

  /**
   * 提交一次更改后的交易设置信息
   * @param {string} invreqId 投资需求id
   * @param {BoughtTranSetting} setting 交易设置
   * @returns {Promise<void>}
   */
  async setBoughtTranSetting(invreqId: string, setting: BoughtTranSetting): Promise<void> {
    if (Math.random() <= 0.5) {
      throw {
        statusCode: 400,
      } as NetworkError;
    }
  }

  /**
   * 赎回（取消）此资产账户
   * @param {string} invreq 投资需求id
   * @returns {Promise<void>}
   */
  async redeemAccount(invreq: string): Promise<void> {
    if (Math.random() <= 0.5) {
      throw {
        statusCode: 400,
      } as NetworkError;
    }
  }

  /**
   * 得到收益列表
   * @param {string} invreq 投资需求id
   * @returns {Promise<EarningList>}
   */
  async getEarningList(invreq: string): Promise<EarningList> {
    return[
      {
        date: "2018-08-27",
        baseEarning: 0.00,
        straEarning: 0.09,
      },
      {
        date: "2018-08-29",
        baseEarning: 0.06,
        straEarning: 0.55,
      },
      {
        date: "2018-08-31",
        baseEarning: 0.10,
        straEarning: 1.25,
      },
      {
        date: "2018-09-02",
        baseEarning: 0.25,
        straEarning: 1.45,
      },
      {
        date: "2018-09-4",
        baseEarning: 0.29,
        straEarning: 1.44,
      },
      {
        date: "2018-09-06",
        baseEarning: 0.41,
        straEarning: 1.67,
      },
      {
        date: "2018-09-08",
        baseEarning: 0.51,
        straEarning: 1.98,
      },
      {
        date: "2018-09-10",
        baseEarning: 0.55,
        straEarning: 2.01,
      },
      {
        date: "2018-09-12",
        baseEarning: 0.69,
        straEarning: 2.33,
      },
      {
        date: "2018-09-14",
        baseEarning: 0.71,
        straEarning: 2.44,
      },
      {
        date: "2018-09-16",
        baseEarning: 0.79,
        straEarning: 2.79,
      },
    ];
  }

  /**
   * 得到计划交易的信息
   * 需要前端连续的向后端请求，若为null则为无计划交易
   * @param {string} invreqId 投资需求id
   * @returns {Promise<TransactionDetailList>} 交易信息
   */
  async getPlanTransaction(invreqId: string): Promise<PlanTransaction> {
    return {
      tranVolume: 5949.00,
      tranDate: "2018-09-21",
      tranList: [
        {
          time: "12:00:00",
          type: TranType.BOND,
          quotaName: "一汽夏利",
          quotaId: "000927.XSHE",
          buyOrSale: Action.BUY,
          quantity: 200,
          price: 3.15,
          totalPrice: 630.00,
          matching: 19.34,
          lastMatching: 19.01,
        },
        {
          time: "16:00:00",
          type: TranType.STOCK,
          quotaName: "天茂集团",
          quotaId: "000627.XSHE",
          buyOrSale: Action.BUY,
          quantity: 300,
          price: 6.31,
          totalPrice: 1893.00,
          matching: 21.34,
          lastMatching: 19.73,
        },
        {
          time: "18:00:00",
          type: TranType.STOCK,
          quotaName: "万马科技",
          quotaId: "300698.XSHE",
          buyOrSale: Action.BUY,
          quantity: 100,
          price: 16.88,
          totalPrice: 1688.00,
          matching: 28.30,
          lastMatching: 0,
        },
        {
          time: "19:00:00",
          type: TranType.STOCK,
          quotaName: "国投资本",
          quotaId: "600061.XSHG",
          buyOrSale: Action.BUY,
          quantity: 200,
          price: 8.69,
          totalPrice: 1738.00,
          matching: 4.39,
          lastMatching: 0.00,
        },
      ],
    };
  }

  /**
   * 确认进行计划交易
   * @param {string} invreqId
   * @returns {Promise<void>}
   */
  async confirmPlanTran(invreqId: string): Promise<void> {
    await waitForMs(10000);

  }

  /**
   * 取消计划交易
   * @param invreqId
   * @returns {Promise<void>}
   */
  async cancelPlanTran(invreqId: string): Promise<void> {

  }

  /**
   * 得到每日
   * @param {string} invreqId
   * @returns {Promise<DailyPositionList>}
   */
  async getDailyPositionList(invreqId: string): Promise<DailyPositionList> {
    return [
      {
        date: "2018-08-27",
        children: [
          {
            quotaName: "新力金融",
            quotaId: "XM-21344",
            quantity: 400,
            currentValue: 11.04,
            totalValue: 4416.00,
            profitAndLoss: 0.00,
            serviceCharge: 5.4,
          },
          {
            quotaName: "立昂技术",
            quotaId: "300603.XSHE",
            quantity: 100,
            currentValue: 27.3,
            totalValue: 2730.00,
            profitAndLoss: 0.00,
            serviceCharge: 5.4,
          },
          {
            quotaName: "招商蛇口",
            quotaId: "001979.XSHE",
            quantity: 200,
            currentValue: 17.7,
            totalValue: 3540.00,
            profitAndLoss: 0.00,
            serviceCharge: 5.4,
          },
          {
            quotaName: "汇源通信",
            quotaId: "000586.XSHE",
            quantity: 200,
            currentValue: 9.22,
            totalValue: 1844.00,
            profitAndLoss: 0.00,
            serviceCharge: 5.4,
          },
        ]}, {
        date: "2018-09-05",
        children: [
          {
            quotaName: "新力金融",
            quotaId: "XM-21344",
            quantity: 400,
            currentValue: 11.54,
            totalValue: 4616.00,
            profitAndLoss: 200.00,
            serviceCharge: 5.4,
          },
          {
            quotaName: "立昂技术",
            quotaId: "300603.XSHE",
            quantity: 100,
            currentValue: 26.78,
            totalValue: 2678.00,
            profitAndLoss: -52.00,
            serviceCharge: 5.4,
          },
          {
            quotaName: "招商蛇口",
            quotaId: "001979.XSHE",
            quantity: 200,
            currentValue: 17.8,
            totalValue: 3560.00,
            profitAndLoss: 20.00,
            serviceCharge: 5.4,
          },
          {
            quotaName: "汇源通信",
            quotaId: "000586.XSHE",
            quantity: 200,
            currentValue: 9.42,
            totalValue: 1884.00,
            profitAndLoss: 40.00,
            serviceCharge: 5.4,
          },
        ],
      },
      {
        date: "2018-09-10",
        children: [
          {
            quotaName: "新力金融",
            quotaId: "XM-21344",
            quantity: 400,
            currentValue: 11.04,
            totalValue: 4416.00,
            profitAndLoss: 0.00,
            serviceCharge: 8.5,
          },
          {
            quotaName: "立昂技术",
            quotaId: "300603.XSHE",
            quantity: 100,
            currentValue: 27.3,
            totalValue: 2730.00,
            profitAndLoss: 0.00,
            serviceCharge: 8.5,
          },
          {
            quotaName: "招商蛇口",
            quotaId: "001979.XSHE",
            quantity: 200,
            currentValue: 17.7,
            totalValue: 3540.00,
            profitAndLoss: 0.00,
            serviceCharge: 8.5,
          },
          {
            quotaName: "保利地产",
            quotaId: "000586.XSHE",
            quantity: 400,
            currentValue: 12.17,
            totalValue: 4868.00,
            profitAndLoss: 0.00,
            serviceCharge: 8.5,
          },
          {
            quotaName: "10国债37",
            quotaId: "019037.SH",
            quantity: 400,
            currentValue: 12.17,
            totalValue: 4938.00,
            profitAndLoss: 0.00,
            serviceCharge: 8.5,
          },
          {
            quotaName: "12国航02",
            quotaId: "122268.SH",
            quantity: 200,
            currentValue: 33.63,
            totalValue: 6727.00,
            profitAndLoss: 0.00,
            serviceCharge: 8.5,
          },
          {
            quotaName: "原油期货",
            quotaId: "SC1909",
            quantity: 200,
            currentValue: 33.63,
            totalValue: 4239.00,
            profitAndLoss: 0.00,
            serviceCharge: 8.5,
          },
          {
            quotaName: "原油现货",
            quotaId: "CL002",
            quantity: 200,
            currentValue: 33.63,
            totalValue: 9133.00,
            profitAndLoss: 0.00,
            serviceCharge: 8.5,
          },
        ],
      },
    ];
  }
}
