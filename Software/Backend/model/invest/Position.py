from run import db
from sqlalchemy import VARCHAR, Integer, Float, DATETIME

from model.Enumeration import Mode


class Position(db.Model):
    """
    持仓情况
    通过里面的request_id和每个配置方案相挂钩
    """
    __tablename__ = "Position"
    # 数组里面的子项，一个账户里有多个
    id = db.Column(Integer, primary_key=True)  # 没用的主键
    code = db.Column(VARCHAR(50))  # 股票ID
    name = db.Column(VARCHAR(50))
    price = db.Column(Float)  # 买入价
    quantity = db.Column(Integer)  # 买入数量

    buy_time = db.Column(DATETIME)  # 买入时间
    type = db.Column(db.Enum(Mode), default='STOCK')
    request_id = db.Column(Integer, db.ForeignKey('InvestRequirement.id'))

    def __init__(self, code, price, quantity, buy_time, name):
        self.code = code
        self.price = price
        self.quantity = quantity
        self.buy_time = buy_time
        self.name = name
