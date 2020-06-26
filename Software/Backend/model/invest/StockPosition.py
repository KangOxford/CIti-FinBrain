from run import db
from sqlalchemy import VARCHAR, Integer, Float, DATETIME

from dao.stock.StockDao import StockDao


class StockPosition(db.Model):
    """
    持仓情况
    通过里面的request_id和每个配置方案相挂钩
    """
    __tablename__ = "StockPosition"
    id = db.Column(Integer, primary_key=True)
    stock_code = db.Column(VARCHAR(50))
    stock_name = db.Column(VARCHAR(50))
    price = db.Column(Float)
    quantity = db.Column(Integer)
    total_amount = db.Column(Float)
    buy_time = db.Column(DATETIME)
    request_id = db.Column(Integer, db.ForeignKey('InvestRequirement.id'))

    def __init__(self, code, price, quantity, total_amount, buy_time):
        self.stock_code = code
        self.price = price
        self.quantity = quantity
        self.total_amount = total_amount
        self.buy_time = buy_time
        self.stock_name = StockDao().get_stock_name(code)
