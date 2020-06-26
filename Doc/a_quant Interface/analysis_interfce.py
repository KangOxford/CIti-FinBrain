from typing import Dict, Union

from vo import *

# 这是数据分析的接口，后端会调用这部分接口进行逻辑分析，当然也可能需要把几个方法传过来的数据合并到一起传给前端

def get_stock_invest(revue: float, risk: float, investment_years: int, volume: float) -> StockStrategy
    """
    根据用户需求得到投资方案
    :param invreq: 投资需求
    :return: 包含这组交易后的预期收益和交易建议的字典
    """
    return StockStrategy()

def estimate_to_post(old_stock_portfolio: StockPortfolio, new_stock_portfolio: StockPortfolio) -> bool
    """
    比对两个方案差异是否大小决定是否发消息给用户
    :param old_stock_portfolio: 旧的持仓方案
    :param new_stock_portfolio: 新的持仓方案
    """
    return False;