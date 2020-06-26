class StockCurInfo(object):
    # 当日部分信息
    market_cap: float  # 市值
    opening: float  # 开盘价
    volume: float  # 成交量
    turnover: float  # 换手率
    closing: float  # 收盘价（或者精确为当前价）
    pe: float  # 市盈率
    change: tuple[float, float]  # 涨跌幅,涨跌幅
    day_range: tuple[float, float]  # 最低价，最高价
    peta: float  # 贝塔
    sharpe: float  # 夏普率