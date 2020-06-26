import numpy as np
import numpy.random as npr
import pandas as pd
from cvxopt import solvers, matrix

from bl.allocation.stock.StockBl import StockBl
from bl.allocation.goods.GoodsBl import GoodsBl
from bl.bonds.BondsBl import BondsBl
from factory.DaoFactory import goodsDao
from model.Enumeration import Mode
from model.invest.Advice import Advice

npr.seed(0)


class GlobalAllocationBl(object):
    def get_allocation(self, profit: float, risk: float, amount: float, year: int, stock_market_fail: bool):
        # configuration
        csv_list = ["bl/allocation/hushen300.csv", "bl/allocation/yuanyou.csv",
                    "bl/allocation/guozhai.csv",
                    "bl/allocation/xinyongzhai.csv"]  # the relative datapath of the csv files
        a = np.array([0., 0., 0., 0.])  # the current investment
        w_sum = amount  # total value of investment
        anticipated_risk = risk
        mu = profit  # anticipated return rate

        # start
        num = len(csv_list)
        a_sum = a.sum()
        data = []
        for i in range(num):
            data.append(list(np.array(pd.read_csv(csv_list[i], index_col=0)).reshape(-1)))
        data = np.array(data)
        T = data.shape[1]
        r = data.mean(axis=1)
        if stock_market_fail:  # 如果股票市场崩盘，置股票的预期收益为-无穷，将钱临时分到债券和商品市场
            r[0] = -99
        d = data - np.dot(r.reshape(-1, 1), np.ones((1, T)))
        sigma = np.dot(d, d.T) / (T - 1)

        # set up the qp solver by generating the matrices
        P = 2 * matrix(sigma, tc='d')
        q = matrix(np.dot(sigma, a.reshape(-1, 1)).reshape((-1)) * 2, tc='d')
        G = matrix(np.vstack((-np.eye((num)), -r.reshape((1, -1)))), tc='d')
        h = matrix(
            np.vstack((np.zeros((num, 1)), np.array([np.dot(a, r) - (w_sum + a_sum) * mu]).reshape(-1, 1))).reshape(
                (-1)),
            tc='d')
        A = matrix(np.ones((1, num)), tc='d')
        b = matrix(w_sum, tc='d')

        result = []
        min_risk = anticipated_risk + 0.01
        exp_r = risk + 0.01
        try:
            # print("start optimizing...")
            sv = solvers.qp(P, q, G, h, A, b)
            if sv['status'] == 'unknown':
                min_risk = anticipated_risk + 0.01
                exp_r = risk + 0.01
                stock_strategy = StockBl().get_stock_invest(amount).strategy
                # 股票市场部分
                for (k, v) in stock_strategy.items():
                    # k是股票代码，v是数量
                    advice = Advice(k, v, 0, Mode.STOCK)
                    result.append(advice)
                pass
                print("Attention: the anticipated return rate could be met but with higher risks!")
            else:
                # compute the output result
                w = np.array(sv['x']).reshape(-1)
                w = w / w.sum() * w_sum
                w_perc = w / w_sum
                temp = (w + a) / (w_sum + a_sum)
                min_risk = (np.dot(np.dot(temp.reshape((1, -1)), sigma), temp.reshape((-1, 1))))[0, 0]
                exp_r = np.dot(temp, r)

                result = []
                if min_risk > anticipated_risk:
                    stock_strategy = StockBl().get_stock_invest(amount).strategy
                    # 股票市场部分
                    for (k, v) in stock_strategy.items():
                        # k是股票代码，v是数量
                        advice = Advice(k, v, 0, Mode.STOCK)
                        result.append(advice)
                    pass
                    print("Attention: the anticipated return rate could be met but with higher risks!")
                else:
                    # 股票市场部分
                    if w[0] > 1:
                        stock_strategy = StockBl().get_stock_invest(w[0]).strategy
                        for (k, v) in stock_strategy.items():
                            # k是股票代码，v是数量
                            advice = Advice(k, v, 0, Mode.STOCK)
                            result.append(advice)
                        print('stock')

                    # 商品市场部分
                    # if w[1] > 1:
                    #     goods_strategy = GoodsBl().get_goods_invest(w[1], min_risk, r[1])
                    #     print(len(goods_strategy))
                    #     if len(goods_strategy) == 2:
                    #         # 原油期货
                    #         advice = Advice(goodsDao.get_future_code_of_crude_oil(), round(goods_strategy[0], 2), 0, Mode.GOODS)
                    #         result.append(advice)
                    #         # 原油现货
                    #         advice = Advice(goodsDao.get_spot_code_of_crude_oil(), round(goods_strategy[1], 2), 0, Mode.GOODS)
                    #         result.append(advice)
                    #     print('goods')

                    # 债券市场部分
                    if w[2] + w[3] + w[1] > 1:
                        bonds_strategy1 = BondsBl().ged_interestbonds(w[3] + w[1] * 0.5, r[3], min_risk, year)
                        bonds_strategy2 = BondsBl().get_creditbonds(w[2] + w[1] * 0.5, r[2], min_risk, year)
                        bonds_strategy = pd.concat([bonds_strategy1[1], bonds_strategy2[1]], axis=1)
                        advice = Advice(bonds_strategy.values[1][0], bonds_strategy.values[2][0], 0, Mode.BOND)
                        result.append(advice)
                        advice = Advice(bonds_strategy.values[1][1], bonds_strategy.values[2][1], 0, Mode.BOND)
                        result.append(advice)
        except:
            print("Sorry, the anticipated return rate \mu={} can't be met!".format(mu))
            stock_strategy = StockBl().get_stock_invest(amount).strategy
            # 股票市场部分
            for (k, v) in stock_strategy.items():
                # k是股票代码，v是数量
                advice = Advice(k, v, 0, Mode.STOCK)
                result.append(advice)
            pass

        # print(stock_strategy)
        # print(goods_strategy)
        # print("Investment to each market: {}".format(list(w)))
        # print("Investment proportion: {}".format(list(w_perc)))
        # print("Average return rate for each market: {}".format(list(r)))
        # print("Minimum risk: {}".format(min_risk))
        # print("Expected return rate: {}".format(exp_r))
        # print(w[0])
        # print(w[1])
        # print(w[2])
        # print(w[3])
        # print(min_risk)
        # print(r[1])

        # 返回值：预期年化风险,预期年化收益,股票策略,商品策略,债券策略
        return [min_risk, exp_r, result]
