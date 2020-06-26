from run import db
from sqlalchemy import Float, Integer, VARCHAR, DATETIME, BOOLEAN

from model.Enumeration import State

from datetime import datetime


class InvestRequirement(db.Model):
    """
    用户的需求，每次用户需求都有一个id
    第一次交易的时候要改is_bought参数
    每次交易的时候要改累计收益和今日收益
    """

    __tablename__ = 'InvestRequirement'
    id = db.Column(Integer, primary_key=True)
    username = db.Column(VARCHAR(20), db.ForeignKey('User.username'))
    is_bought = db.Column(db.Enum(State), default='CONSIDERATION')  # 生成、买入、赎回
    amount = db.Column(Float)  # 金额（初始资金）
    profit = db.Column(Float)  # 预期收益
    risk = db.Column(Float)  # 预期风险
    year = db.Column(Integer)  # 预期年限
    accu_revenue = db.Column(Float, default=0.0)  # 累计收益
    pred_revenue_year = db.Column(Float)  # 计算预期年化收益
    pred_risk_year = db.Column(Float)  # 计算预期年化风险
    today_revenue = db.Column(Float, default=0.0)  # 今日收益
    start_date = db.Column(DATETIME, default=datetime.today())  # 开始时间

    # 7天收益率和7天波动率
    seven_revenue = db.Column(Float, default=0.0)
    seven_risk = db.Column(Float, default=0.0)

    # 调整方案册策略
    plan_tran_time = db.Column(Integer, default=0)  # 计划交易时间
    plan_remind_time = db.Column(Integer, default=1)  # 在计划时间前多少小时通知有交易
    min_confirmed_price = db.Column(Float, default=3000)  # 需要手动确认的最小金额，单位为元
    confirm_time = db.Column(Integer, default=1)  # 有效的确认时间
    defaultConfirm = db.Column(BOOLEAN, default=True)  # 默认操作是否为确认交易

    def __init__(self, profit, risk, amount, year, username, pred_revenue_year, pred_risk_year):
        self.profit = profit
        self.risk = risk
        self.amount = amount
        self.year = year
        self.username = username
        self.pred_revenue_year = pred_revenue_year
        self.pred_risk_year = pred_risk_year
        self.is_bought = State.CONSIDERATION
        # self.balance = amount
        pass
