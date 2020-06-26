from keras.layers import Dense, LSTM
from keras.models import Sequential
from sklearn.preprocessing import MinMaxScaler

import numpy as np
import numpy.random as npr
import pandas as pd
from cvxopt import solvers, matrix
from datetime import date, timedelta
from factory.DaoFactory import GoodsDao

import warnings

warnings.filterwarnings('ignore')

npr.seed(0)
# param
look_back = 10
show_training_detail = True

class GoodsBl(object):

    @staticmethod
    def train_model(trainX, trainY):
        model = Sequential()
        model.add(LSTM(4, input_shape=(1, look_back)))
        model.add(Dense(1))
        model.compile(loss='mean_squared_error', optimizer='adam')
        model.fit(trainX, trainY, nb_epoch=10, batch_size=20, verbose=show_training_detail)
        return model

    # convert an array of values into a dataset matrix
    @staticmethod
    def create_dataset(dataset, look_back=1):
        dataX, dataY = [], []
        for i in range(len(dataset) - look_back - 1):
            a = dataset[i:(i + look_back), 0]
            dataX.append(a)
            dataY.append(dataset[i + look_back, 0])
        return np.array(dataX), np.array(dataY)

    def solve_case(self, y):

        dataset = y.astype('float32').reshape((-1, 1))
        scaler = MinMaxScaler(feature_range=(0, 1))
        dataset = scaler.fit_transform(dataset)

        train_size = len(dataset)
        train = dataset[0:train_size, :]

        trainX, trainY = self.create_dataset(train, look_back)
        trainX = trainX.reshape(trainX.shape[0], 1, trainX.shape[1])

        model = self.train_model(trainX, trainY)
        predictX = np.array([dataset[(-look_back):, 0]]).reshape(1, 1, look_back)
        res = model.predict(predictX)
        res = scaler.inverse_transform(res)
        del model, scaler
        return res[0, 0]

    def predict_one_day(self, days):
        res = self.solve_case(days)
        return res

    def get_goods_invest(self, total_investment: float, anticipated_risk: float, anticipated_return: float):
        # 原油期货价格
        price_x = GoodsDao().get_future_price_of_crude_oil()
        # 原油现货价格
        price_y = GoodsDao().get_spot_price_of_crude_oil()
        # price_y = price_y * 6.8674
        # t :相关系数 使用dcc-midas模型求得  ####暂时还有些问题####
        t = 0.13385321

        # 数据处理
        futures = pd.read_excel("bl/allocation/goods/futures.xlsx")
        goods = pd.read_excel("bl/allocation/goods/goods_WTI.xlsx")
        # futures = pd.read_excel("futures.xlsx")
        # goods = pd.read_excel("goods_WTI.xlsx")

        futures_close = list(futures['close'])
        goods_close = list(goods['close'])[::-1]

        futures_return = []
        for i in range(1, len(futures_close)):
            futures_return.append((futures_close[i] - futures_close[i - 1]) / futures_close[i - 1])
        goods_return = []
        for i in range(1, len(goods_close)):
            goods_return.append((goods_close[i] - goods_close[i - 1]) / goods_close[i - 1])

        ex = self.predict_one_day(np.array(futures_return))
        ey = self.predict_one_day(np.array(goods_return))
        dx = np.var(futures_return)
        dy = np.var(goods_return)
        # dx :期货的方差  dy :现货的方差  ex :期货的预测收益率  ey :现货的预测收益率

        # 优化
        P = matrix([[2 * dx, 2 * t * (dx * dy) ** 0.5], [2 * t * (dx * dy) ** 0.5, 2 * dy]])
        q = matrix([0., 0.])
        G = matrix([[(-1) * ex, -1., 0.], [(-1) * ey, 0., -1.]], (3, 2))
        h = matrix([(-1) * anticipated_return, 0., 0.], (3, 1))
        A = matrix([price_x * 1., price_y * 1.], (1, 2))
        b = matrix(total_investment * 1.)
        try:
            print("start optimizing...")
            sv = solvers.qp(P, q, G, h, A, b)
        except:
            print("Sorry, the anticipated return rate anticipated_return={} can't be met!".format(anticipated_return))
            return []

        w = list(sv['x'])
        min_risk = w[0] ** 2 * dx + w[1] ** 2 * dy + 2 * w[0] * w[1] * t * (dx * dy) ** 0.5
        if min_risk > anticipated_risk:
            print("Attention: the anticipated return rate could be met but with higher risks!")
            # print("Investment to each market: {}".format(list(w)))  # 单位量的资产
            # print("Minimum risk: {}".format(min_risk))
        else:
            print("This strategy is perfect!")
            # print("Investment to each market: {}".format(list(w)))  # 单位量的资产
            # print("Minimum risk: {}".format(min_risk))

        result = list(w)
        return result

    @staticmethod
    def last_day(d: date) -> date:
        if d.isoweekday() == 1:
            return d - timedelta(days=3)
        return d - timedelta(days=1)

    def get_future_data(self, invreq_id):
        from bl.goods.GoodsDaoMock import GoodsDaoMock

        future_name = '期货'
        goods_dao = GoodsDaoMock()
        w, anticipated_risk = goods_dao.get_goods_w(invreq_id)
        futures_buy_price, start = goods_dao.get_buy_price(invreq_id)
        price_x = futures_buy_price[future_name]
        day = date.today()
        p_now, amount_now = goods_dao.get_future_price_and_amount(day)
        p_max = 0.0
        p_ten = []
        amount_ten = []
        for i in range(10):
            day = self.last_day(day)
            p, amount = goods_dao.get_future_price_and_amount(day)
            p_max = max(p_max, p)
            p_ten.insert(0, p)
            amount_ten.insert(0, amount)

        return w[0] * price_x, price_x, anticipated_risk, p_max, p_now, amount_now, p_ten, amount_ten

    # 这是一个需要每天定点跑一次的函数
    def adjustment(self, invreq_id):
        investment, p_initial, anticipated_risk, p_max, p_now, amount_now, p_ten, amount_ten = self.get_future_data(invreq_id)
        n = investment / p_initial
        if (p_now - p_initial) * n > 20.0 * n + investment * 0.0006:
            if p_now <= (1 - 0.05) * p_max or p_now <= sum(p_ten) / 10.0 or (
                    p_ten[9] != 0 and (p_now - p_ten[9]) / p_ten[9] > 0.1 and amount_now < sum(amount_ten) / 10.0):
                # TODO 卖出所持有的所有期货和现货
                pass
        elif (p_now - p_initial) * n < 20.0 * n + investment * 0.0006:
            if (p_initial - p_now) / p_initial >= anticipated_risk or p_now <= sum(p_ten) / 10.0 or (
                    p_ten[9] != 0 and (p_now - p_ten[9]) / p_ten[9] < -0.05 and amount_now < sum(amount_ten) / 10.0):
                # TODO 卖出所持有的所有期货和现货
                pass

        # 卖出之后，我们不在重新配置，而是持有现金，等待下一次大类资产调整时再次配置。
