import datetime


class StockRevenue(object):
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
