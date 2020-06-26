from model.vo.StockPortfolio import StockPortfolio
from model.vo.StockStrategy import StockStrategy
from model.vo.StockTransactionsAdvice import StockTransactionsAdvice


class AssetAllocation(object):
    def __init__(self, username, request_id, strategy: StockStrategy, portfolio: StockPortfolio,
                 advice: StockTransactionsAdvice):
        self.username = username
        self.request_id = request_id
        self.strategy = strategy
        self.portfolio = portfolio
        self.advice = advice
