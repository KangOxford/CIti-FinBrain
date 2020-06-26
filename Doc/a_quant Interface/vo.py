from dataclasses import dataclass
from datetime import datetime
from typing import Tuple, List


@dataclass
class PerformanceAnalysis:
    pass


@dataclass
class AttributionAnalysis:
    pass


@dataclass
class ScenarioAnalysis:
    pass


@dataclass
class InvestReq:
    """
    收益和风险至少有一个
    投资年限可选
    投资额必填
    """
    revue: float  # 收益
    risk: float  # 风险
    investment_years: int  # 投资年限
    volume: float  # 投资额: 小数点后两位
    id: str = None

@dataclass
class StockStrategy:
    strategy: dict[str, float] #股票代码，投资金额

@dataclass
class StockPosition:
    stock_code: str #股票代码
    stock_name: str #股票名字
    price: float #买入价
    quantity: int #持有量
    total_amount: float #买入总金额
    buy_time: datetime #买入时间

@dataclass
class StockPortfolio:
    portfolio: list[StockPosition]


@dataclass
class StockTransactionRecord:
    stock_code: str #股票代码
    stock_name: str #股票名字
    buy_price: float #买入价
    buy_time: datetime #买入时间
    sell_price: float #卖出价
    sell_quantity: int #卖出量
    expense: float #费用（手续费）
    sell_time: datetime #卖出时间


@dataclass
class StockTransactionsAdvice:
    transactions: List[StockPosition]
    id: str


@dataclass
class TransactionsAdvice:
    s_advice: StockTransactionsAdvice  # 股票交易建议
    # TODO 其他资产配置的交易建议


@dataclass
class StockRevenue:
    accu_revenue: float  # 累计收益:百分率
    max_drawdowm: float  # 最大回撤：百分率
    ror_year: float  # 年化收益:百分率
    start_date: datetime  # 开始时间
    start_volume: float  # 初始资金

    # 以下浮点数取值范围为：0~100
    beta: float  # 贝塔
    growth: float  # 成长性
    leverage_ratio: float  # 杠杆率
    liquidity: float  # 流动性
    momentum: float  # 动量
    reversal: float  # 反转
    market_value: float  # 市值
    price: float  # 价值
    volatility: float  # 波动率
    profitability: float  # 盈利性

    industry: dict[str:float]  # 版块情况，键为版块名（包括现金），值为百分比

    # Brinson 分析
    active_return: float  # 主动收益:浮点，可为负数
    asset_allo: float  # 资产配置
    stock_allo: float  # 选股配置


@dataclass
class StockPriceHistory:
    # 用于画K线图
    date: datetime  # 日期：哪天的价格
    max_price: float  # 最高价
    min_price: float  # 最低价
    opening: float  # 开盘价
    closing: float  # 收盘价
    change: float  # 涨跌额
    chg: float  # 涨跌幅：百分数，大小一般不超过10%
    volume: float  # 成交量


@dataclass
class StockCurInfo:
    # 当日部分信息
    market_cap: float  # 市值
    opening: float  # 开盘价
    volume: float  # 成交量
    turnover: float  # 换手率
    closing: float  # 收盘价（或者精确为当前价）
    pe: float  # 市盈率
    change: Tuple[float, float]  # 涨跌幅,涨跌幅
    day_range: Tuple[float, float]  # 最低价，最高价
    peta: float  # 贝塔
    sharpe: float  # 夏普率
