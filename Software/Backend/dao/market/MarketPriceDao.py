import pandas as pd

'''
市场行情展示
'''


class MarketDao(object):
    '''
    沪深300
    '''

    def get_300_index(self):
        data = pd.read_csv('data/daily_data/hushen_300.csv')
        return self.trans_to_list(data)
        pass

    '''
    国债
    '''

    def get_national_debt(self):
        data = pd.read_csv('data/daily_data/national_debt.csv')
        return self.trans_to_list(data)
        pass

    '''
    企业债
    '''

    def get_enterprise_bond(self):
        data = pd.read_csv('data/daily_data/enterprise_bond.csv')
        return self.trans_to_list(data)
        pass

    '''
    通用方法
    '''

    def trans_to_list(self, df: pd.DataFrame):
        result = []
        for i in range(df.__len__()):
            temp = {'time': df.values[i][0], 'start': df.values[i][1], 'end': df.values[i][2], 'max': df.values[i][3],
                    'min': df.values[i][4], 'volume': df.values[i][5], 'money': df.values[i][6]}
            result.append(temp)
        return result

