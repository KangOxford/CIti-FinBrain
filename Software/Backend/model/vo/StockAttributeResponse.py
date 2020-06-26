from flask_restplus.fields import Raw


class StyleConfigForm(Raw):
    style: str  # 风格
    winRate: float  # 胜率：百分数
    winRateRank: int  # 胜率同策略排名
    yearRevenue: float  # 年化收益率：百分数
    revenueRank: float  # 年化收益率同策略排名


class StyleExplainForm(Raw):
    season: str  # 季度
    rSquare: float  # 调整R方：3位小数
    midNum: float  # 同策略调整R方中位数：3位小数


class PreferAndContr(Raw):
    style: str  # 风格
    largeGrowth: float  # 大盘成长：百分数
    largeValue: float  # 大盘价值：百分数
    middleGrowth: float  # 中盘成长：百分数
    middleValue: float  # 中盘价值：百分数
    smallGrowth: float  # 小盘成长：百分数
    smallValue: float  # 小盘价值：百分数
