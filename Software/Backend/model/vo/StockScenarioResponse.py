from flask_restplus.fields import Raw

from publicdata.MarketState import MarketState


class MarketRouteChart(Raw):
    date: str  # 日期
    myfund: str  # 单位净值
    marketState: MarketState


class MarketRouteForm(Raw):
    index: str  # 指标
    obviousUp: str  # 市场显著上升 ps 因为不同指标数据格式不同，有整数，百分数，范围，所以后端都转为string传给前端吧……
    waveryUp: str  # 市场震荡上升
    obviousDown: str  # 市场显著下降
    waveryDown: str  # 市场震荡下降


class SensibilityChartItem(Raw):
    fluctuation: float  # 波动率因子（标准化）：2位小数
    lineRevenue: float  # 线性拟合收益率
    curveRevenue: float  # 曲线拟合收益率
