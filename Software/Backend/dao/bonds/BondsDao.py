import math

import pandas as pd
from model.Enumeration import Level


class BondsDao(object):

    def __init__(self):
        pass

    def my_filter(self, df):
        # c_col = df.loc[:, 'G']
        std1, mean1 = df.describe().loc[['std', 'mean'], '估价收益久期']
        std2, mean2 = df.describe().loc[['std', 'mean'], '估价收益率']
        result = df[(df['估价收益久期'] < mean1 + 3 * std1) & (df.估价收益久期 > mean1 - 3 * std1)
                    & (df['估价收益率'] < mean2 + 3 * std2) & (df.估价收益率 > mean2 - 3 * std2)]

        return result

    def get_credit_debt(self):
        # 读取
        df = pd.read_csv('data/bond_real_time_data.csv').loc[0: 3560, :]
        df.rename(columns={df.columns[0]: '证券代码'}, inplace=True)
        df_aid = pd.read_csv('data/credit_bonds_quarter_data.csv')[
            ['证券代码', '经营活动产生的现金流量净额/流动负债\n[报告期] 2018中报', '资产负债率\n[报告期] 2018中报\n[单位] %',
             '估价收益率(上清所)\n[日期] 2018-09-14',
             '估价修正久期(上清所)\n[日期] 2018-09-14']]
        df_aid.columns = ['证券代码', '现金流量比', '资产负债率', '估价收益率', '估价收益久期']

        # 换列
        p = pd.merge(df_aid, df[['证券代码', 'AMOUNT', 'MATURITYDATE', 'COUPONRATE', 'DIRTYPRICE']], on='证券代码').dropna(
            how='any')
        p = p[['证券代码', 'AMOUNT', 'MATURITYDATE', 'COUPONRATE', 'DIRTYPRICE', '资产负债率', '现金流量比', '估价收益率', '估价收益久期']]

        result = self.my_filter(p).values
        for rows in result:
            rows[2] = rows[2][: -5]

        return result

    def get_interest_bonds(self):
        # 读取
        df = pd.read_csv('data/bond_real_time_data.csv').loc[3561:, :]
        df.rename(columns={df.columns[0]: '证券代码'}, inplace=True)
        df_aid = pd.read_csv('data/interest_bonds_quarter_data.csv')[
            ['证券代码', '估价收益率(上清所)\n[日期] 2018-09-14',
             '估价修正久期(上清所)\n[日期] 2018-09-14']]
        df_aid.columns = ['证券代码', '估价收益率', '估价收益久期']

        # 换列
        p = pd.merge(df_aid, df[['证券代码', 'MATURITYDATE', 'COUPONRATE', 'DIRTYPRICE']], on='证券代码').dropna(
            how='any')
        p = p[['证券代码', 'MATURITYDATE', 'COUPONRATE', 'DIRTYPRICE', '估价收益率', '估价收益久期']]

        result = self.my_filter(p).values
        for rows in result:
            rows[1] = rows[1][: -5]

        return result

    def get_price_by_code(self, code):
        """
        根据债券代码找到最新收盘价
        返回 收盘价
        """
        code = int(code.split('.')[0])
        df = pd.read_csv('data/bond_real_time_data.csv')
        result = df.loc[df['TRADE_CODE'] == int(code)]
        if len(result) > 0:
            if int(result.index[0]) > 3560:
                return result['CLOSE'].values[0]
            else:
                return result['CLOSE'].values[0]
        return 1.0

    # return 1.0

    '''
    根据代码得到名字
    '''

    def get_name_by_code(self, code):

        df = pd.read_csv('data/bond_name.csv')

        for i in range(df.__len__()):
            if df.values[i][1] == code:
                return df.values[i][2]
        return 'no name'

    def get_start_date(self, invreq_):
        # todo
        pass

    def get_class(self, code):
        """
        根据债券代码找到类别
        """
        code = int(code.split('.')[0])
        df = pd.read_csv('data/bond_real_time_data.csv')
        result = df.loc[df['TRADE_CODE'] == int(code)]
        if len(result) > 0:
            if int(result.index[0]) > 3560:
                return '国债'
            else:
                return '信用债'
        return '国债'

    def get_interest_quarter_data(self, mode: Level, code):
        df = pd.read_csv('data/interest_bonds_quarter_data2.csv')

        if mode == Level.SIMPLE:
            df = df[df.证券代码 == code][['估价全价 2017-10-10',
                                      '估价全价 2017-12-29', '估价全价 2018-03-30',
                                      '估价全价 2018-06-29',
                                      '估价全价 2018-09-14']]

            header = list(df.columns)
            context = list(df.values[0])

            result = []
            for i in range(5):
                result.append({'date': header[i].split(' ')[1], 'predictValue': context[i]})

            return result
        else:
            df = df[df.证券代码 == code][['估价修正久期 2017-10-10', '估价修正久期 2017-12-29',
                                      '估价修正久期 2018-03-30', '估价修正久期 2018-06-29', '估价修正久期 2018-09-14']]

            header = list(df.columns)
            context = list(df.values[0])


            result = []
            for i in range(5):
                if math.isnan(context[i]):
                    context[i] = 0.8396
                result.append({'season': header[i].split(' ')[1], 'fixedDuration': context[i]})

            return result

    def get_credit_quarter_data(self, mode: Level, code):
        df = pd.read_csv('data/credit_bonds_quarter_data2.csv')

        if mode == Level.SIMPLE:
            df = df[df.证券代码 == code][
                ['估价全价 2017-10-10', '估价全价 2017-12-29', '估价全价 2018-03-30', '估价全价 2018-06-29', '估价全价 2018-09-14']]

            header = list(df.columns)
            context = list(df.values[0])

            result = []
            for i in range(5):
                if math.isnan(context[i]):
                    context[i] = 101.4653
                result.append({'date': header[i].split(' ')[1], 'predictValue': context[i]})

            return result
        else:
            df = df[df.证券代码 == code][['现金流量比 2017中报', '现金流量比 2017三季',
                                      '现金流量比 2017年报', '现金流量比 2018一季', '现金流量比 2018中报',
                                      '估价修正久期 2017-10-10', '估价修正久期 2017-12-29',
                                      '估价修正久期 2018-03-30', '估价修正久期 2018-06-29',
                                      '估价修正久期 2018-09-14',
                                      '债项评级 \r2017-10-10\r', '债项评级 \r2017-12-29\r', '债项评级 \r2018-03-30\r',
                                      '债项评级 \r2018-06-29\r', '债项评级 \r2018-09-14\r',
                                      '资产负债率\r 2017中报\r',
                                      '资产负债率 \r2017三季\r', '资产负债率\r 2017年报\r',
                                      '资产负债率\r 2018一季\r', '资产负债率 \r2018中报\r']]

            header1 = list(df.columns)[0:5]
            context1 = list(df.values[0][0:5])
            context2 = list(df.values[0][5:10])
            context3 = list(df.values[0][10:15])
            context4 = list(df.values[0][15:20])

            index = 0
            for i in range(header1.__len__()):
                header1[i] = header1[i].split(' ')[1][0: 4]
                header1[i] = header1[i] + "Q" + str((index+1) % 4 + 1)
                index += 1


            result = []
            for i in range(5):
                if math.isnan(context2[i]):
                    context2[i] = 0.8396

                if context3[i] == '' or (type(context3[i]) == float and math.isnan(context3[i])):
                    context3[i] = 'AAA'

                result.append({'season': header1[i],
                               'fixedDuration': context2[i],
                               'liability': context4[i],
                               'cashFlow': context1[i],
                               'creditRate': context3[i]})

            return result
