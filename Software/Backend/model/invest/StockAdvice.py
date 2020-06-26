from run import db
from datetime import datetime
from sqlalchemy import VARCHAR, Float, DATETIME, Integer

from dao.stock.StockDao import StockDao


class StockAdvice(db.Model):
    """
    股票交易建议
    通过里面的request_id和每个配置方案相挂钩
    """
    __tablename__ = 'StockAdvice'
    stock_code = db.Column(VARCHAR(100))
    stock_name = db.Column(VARCHAR(100))
    price = db.Column(Float)
    quantity = db.Column(Integer)

    time = db.Column(DATETIME, default=datetime.today())

    request_id = db.Column(Integer, db.ForeignKey('InvestRequirement.id'))
    id = db.Column(Integer, primary_key=True)

    def __init__(self, code, quantity, request_id):
        self.stock_code = code
        self.quantity = quantity
        self.price = StockDao().get_stock_price(code)
        self.stock_name = StockDao().get_stock_name(code)
        self.request_id = request_id
