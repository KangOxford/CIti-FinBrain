from typing import Dict, Union

from vo import *

# 这边是前端和后端交互的接口

def get_stock_market_overview() -> Dict[str, Union[PerformanceAnalysis, AttributionAnalysis, ScenarioAnalysis]]:
    """
    展示股票市场的概况
    :return: 包含业绩分析，归因分析和场景分析的字典
    """
    return {
        "performance": PerformanceAnalysis(),
        "attribution": AttributionAnalysis(),
        "scenario": ScenarioAnalysis()
    }


def save_invest_req(user_id: str, invreq: InvestReq) -> Dict[str, Union[float, TransactionsAdvice]]:
    """
    用户增加或更新投资需求，系统立即给出一组交易建议
    :param user_id: 用户id
    :param invreq: 投资需求
    :return: 包含这组交易后的预期收益和交易建议的字典
    """
    return {
        "expect": float(),
        "advice": TransactionsAdvice()
    }


def get_stock_invest_revenue(invreq_id: str) -> StockRevenue:
    """
    根据用户的一个投资需求的id，获得该投资需求下，A+Quant所做股票市场投资的收益表现
    :param invreq_id: 投资需求id
    :return: 股票市场投资的收益表现
    """
    return StockRevenue()


def get_stock_invest_advice(invreq_id: str) -> Dict[str, Union[float, TransactionsAdvice]]:
    """
    根据用户的一个投资需求的id，获得该投资需求下，A+Quant所做股票市场投资的一组股票交易建议
    :param invreq_id: 投资需求id
    :return: 包含这组交易后的预期收益和股票交易建议的字典
    """
    return {
        "expect": float(),
        "advice": StockTransactionsAdvice()
    }


def get_stock_quotation(stockcode: str) -> Dict[str, Union[StockPriceHistory, StockCurInfo]]:
    """
    根据一支股票的代码，获得该股票的行情
    :param stockcode: 股票代码
    :return: 包含股票历史价格列表和股票当前部分信息的字典
    """
    return {
        "history": StockPriceHistory(),
        "current": StockCurInfo()
    }

def get_transcation_advice(invreq_id: str) -> Dict[str, Union[float, TransactionsAdvice]]:
    """
    根据用户的一个投资需求的id，获得该投资需求下，A+Quant所做股票市场投资的一组股票交易变动建议
    :param invreq_id: 投资需求id
    :return: 包含这组交易后的预期收益和股票交易建议的字典
    """
    return {
        "expect": float(),
        "advice": TransactionsAdvice()
    }

def confirm_transcation_advice(invreq_id: str, is_change: bool) -> bool:
    """
    根据用户的选择进行交易或放弃
    :param invreq_id: 投资需求id
    :is_change: 是否进行交易
    :return: 是否交易成功
    """
    return False

def trade_stock(invreq_id: str) -> bool:
    """
    根据用户的一个投资需求，进行该投资需求下，A+Quant所做股票市场投资的一组股票交易建议
    帮助用户进行交易，需要对交易记录进行记录
    :param invreq_id: 投资需求id
    :return: 是否交易成功
    """
    return False