import datetime


class StockPriceHistory(object):
    # 用于画K线图
    date: datetime  # 日期：哪天的价格
    max_price: float  # 最高价
    min_price: float  # 最低价
    opening: float  # 开盘价
    closing: float  # 收盘价
    change: float  # 涨跌额
    chg: float  # 涨跌幅：百分数，大小一般不超过10%
    volume: float  # 成交量
