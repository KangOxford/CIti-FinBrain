# -*- coding: utf-8 -*-
import traceback
from datetime import date

import pandas as pd
# import rqdatac as rq
from jqdatasdk import *


class StockDao(object):
    def __init__(self):
        # rq.init()
        pass

    '''
    得到某只股票的名字 √
    '''

    def get_stock_name(self, code):
        # print(code)
        df = pd.read_csv('data/stock_name.csv')

        for i in range(df.__len__()):
            if code == df.values[i][0]:
                return df.values[i][1]
        # return 'hhh'
        return get_security_info(code).display_name
        # print(code)
        # return rq.instruments(code).symbol

    '''
    得到某只股票的最新价格√
    '''

    def get_stock_price(self, code):
        try:
            auth('18724008366', 'JoinQuantPass!')
            price = get_price(code, start_date='2018-09-02', end_date=date.today().isoformat(), frequency='daily',
                              fields='close', skip_paused=False, fq='pre')
            # print(price)
            return price[:1].values[0][0]
        except:
            return 30.0

        # df = pd.read_csv('data/daily_data/stock_price.csv')
        #
        # for i in range(df.__len__()):
        #     if code == df.values[i][1]:
        #         return df.values[i][2]
        #
        # return 0.0
        # price = rq.get_price(code, '2018-08-23', date.today().isoformat(), fields='close')

        # return price.tail(1)[0]


    '''
    得到某只股票的在时间区间内的价格√
    '''

    def get_stock_period_price(self, code, start_date, end_date):
        auth('18724008366', 'JoinQuantPass!')
        price = get_price(code, start_date=str(start_date), end_date=str(end_date), frequency='daily', fields='close',
                          skip_paused=False, fq='pre')
        return price.index, price['close'].values

    '''
    得到沪深300在某个时间区间内的价格√
    代码是'000300.XSHG'
    '''

    def get_csi_300(self, start_date, end_date):
        # csi = pd.read_csv('data/daily_data/hushen_300.csv')
        #
        # total_date = csi.iloc[:, 0].tolist()
        # single_price = csi.iloc[:, 2].tolist()
        #
        # return StockDao().get_particular_data(total_date, single_price, start_date, end_date)
        auth('18724008366', 'JoinQuantPass!')
        price = get_price('000300.XSHG', start_date=str(start_date), end_date=str(end_date), frequency='daily',
                          fields='close',
                          skip_paused=False, fq='pre')
        result = []
        for i in range(len(price.index)):
            temp = [date(price.index[i].year, price.index[i].month, price.index[i].day), price.values[i][0]]
            result.append(temp)

        return result
        # return StockDao.get_particular_data(price)
        pass

    '''
    得到大盘成长指数在某个时间区间内的价格√
    代码是'399372.XSHE'
    '''

    def get_big_grow(self, start_date, end_date):
        df = pd.read_csv('data/history_index.csv')

        total_date = df.iloc[:, 0].tolist()
        big_grow = df.iloc[:, 1].tolist()

        # return StockDao.get_particular_data(price)
        return StockDao().get_particular_data(total_date, big_grow, start_date, end_date)

        # price = get_price('399372.XSHE', start_date=start_date, end_date=end_date, frequency='daily',
        #                   fields='close', skip_paused=False, fq='pre')
        # return StockDao.get_particular_data(price)
        pass

    '''
    得到大盘价值指数在某个时间区间内的价格√
    代码是'399373.XSHE'
    '''

    def get_big_worth(self, start_date, end_date):
        df = pd.read_csv('data/history_index.csv')

        total_date = df.iloc[:, 0].tolist()
        big_worth = df.iloc[:, 2].tolist()

        # return StockDao.get_particular_data(price)
        return StockDao().get_particular_data(total_date, big_worth, start_date, end_date)
        # price = get_price('399373.XSHE', start_date=start_date, end_date=end_date, frequency='daily',
        #                   fields='close', skip_paused=False, fq='pre')
        # return StockDao.get_particular_data(price)
        pass

    '''
    得到中盘成长指数在某个时间区间内的价格√
    代码是'399374.XSHE'
    '''

    def get_mid_grow(self, start_date, end_date):
        df = pd.read_csv('data/history_index.csv')

        total_date = df.iloc[:, 0].tolist()
        mid_grow = df.iloc[:, 3].tolist()

        # return StockDao.get_particular_data(price)
        return StockDao().get_particular_data(total_date, mid_grow, start_date, end_date)

        # return StockDao.get_particular_data(price)
        # price = get_price('399374.XSHE', start_date=start_date, end_date=end_date, frequency='daily',
        #                   fields='close', skip_paused=False, fq='pre')
        # return StockDao.get_particular_data(price)
        pass

    '''
    得到中盘价值指数在某个时间区间内的价格√
    代码是'399375.XSHE'
    '''

    def get_mid_worth(self, start_date, end_date):
        df = pd.read_csv('data/history_index.csv')

        total_date = df.iloc[:, 0].tolist()
        mid_worth = df.iloc[:, 4].tolist()

        # return StockDao.get_particular_data(price)
        return StockDao().get_particular_data(total_date, mid_worth, start_date, end_date)
        # price = get_price('399375.XSHE', start_date=start_date, end_date=end_date, frequency='daily',
        #                   fields='close', skip_paused=False, fq='pre')
        # return StockDao.get_particular_data(price)
        pass

    '''
    得到小盘成长指数在某个时间区间内的价格√
    代码是'399376.XSHE'
    '''

    def get_small_grow(self, start_date, end_date):
        df = pd.read_csv('data/history_index.csv')

        total_date = df.iloc[:, 0].tolist()
        small_grow = df.iloc[:, 5].tolist()

        # return StockDao.get_particular_data(price)
        return StockDao().get_particular_data(total_date, small_grow, start_date, end_date)
        # price = get_price('399376.XSHE', start_date=start_date, end_date=end_date, frequency='daily',
        #                   fields='close', skip_paused=False, fq='pre')
        # return StockDao.get_particular_data(price)
        pass

    '''
    得到小盘价值指数在某个时间区间内的价格√
    代码是'399377.XSHE'
    '''

    def get_small_worth(self, start_date, end_date):
        df = pd.read_csv('data/history_index.csv')

        total_date = df.iloc[:, 0].tolist()
        small_worth = df.iloc[:, 6].tolist()

        # return StockDao.get_particular_data(price)
        return StockDao().get_particular_data(total_date, small_worth, start_date, end_date)
        # price = get_price('399377.XSHE', start_date=start_date, end_date=end_date, frequency='daily',
        #                   fields='close', skip_paused=False, fq='pre')
        # return StockDao.get_particular_data(price)
        pass

    '''
    得到无风险收益率
    '''

    def get_risk_free_rate(self):
        return 0.037
        pass
        # return rq.get_yield_curve(tenor='2Y').tail(1)['2Y'][0]

    @staticmethod
    def get_particular_data(date_list, price_list, start_date, end_date):

        result = []
        for i in range(len(date_list)):
            today = date(int(date_list[i].split('/')[0]), int(date_list[i].split('/')[1]),
                         int(date_list[i].split('/')[2]))

            if (str(start_date) <= str(today)) and (str(end_date) >= str(today)):
                temp = price_list[i]
                result.append(temp)

        return result

        # for i in range(len(price.index)):
        #     temp = [date(price.index[i].year, price.index[i].month, price.index[i].day), price.values[i][0]]
        #     result.append(temp)

