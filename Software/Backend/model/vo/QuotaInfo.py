class QuotaInfo:
    quotaName: str  # 名称
    period: int  # 周期数：月
    totalRevenue: float  # 超额累计回撤率：百分比
    monthly: float  # 月胜率：百分比
    maxReturn: float  # 超额最大回撤率：百分比
    maxReturnBegin: str  # 超额最大回撤起始日期：date
    maxReturnEnd: str  # 超额最大回撤结束日期：date
    maxReturnSupplement: int  # 超额最大回撤补期：天
