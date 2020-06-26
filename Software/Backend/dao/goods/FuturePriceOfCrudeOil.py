# -*- coding: utf-8 -*-
"""
Created on Fri Sep  7 16:54:46 2018

@author: xiaoyang
"""

import requests
from bs4 import BeautifulSoup
import pandas as pd
from ast import literal_eval


class PriceOfCrudeOil(object):
    # 得到原油现货价格
    def get_latest_data(self):
        df = self.get_latest_month_data()
        str = ''
        # return 1.0
        return float(str.join(df.iloc[0][0]))
        # return str(df.iloc[0][0])
        pass

    # 原油现货价格
    # 爬取数据存在df里，价格单位为美元
    def get_latest_month_data(self):
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36'}
        r = requests.get('https://cn.investing.com/currencies/wti-usd-historical-data', headers=headers)
        soup = BeautifulSoup(r.text, 'lxml')

        find1 = soup.find_all('table', {'class': 'genTbl closedTbl historicalTbl', 'id': 'curr_table'})
        find2 = find1[0].find_all('tr')
        df = pd.DataFrame(columns=['收盘', '开盘', '高', '低', '涨跌'])
        for i in find2[1:]:
            datatext = i.find_all('td')
            temp = []
            for j in datatext[1:]:
                temp.append(j.string)
            df.loc[datatext[0].string] = temp
        return df
        pass

    # 得到原油期货价格
    def get_SC0(self):
        r = requests.get(
            'http://stock2.finance.sina.com.cn/futures/api/json.php/IndexService.getInnerFuturesDailyKLine?symbol=SC0')
        a = literal_eval(r.text)
        return pd.DataFrame(a, columns=['时间', '开盘价', '最高价', '最低价', '收盘价', '成交量'])

    # 得到原油期货的最新价格
    def get_SC0_data(self):
        df = self.get_SC0()
        return float(df[['时间', '收盘价']].values[-1][1])
