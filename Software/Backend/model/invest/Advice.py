from run import db
from datetime import datetime
from sqlalchemy import VARCHAR, Float, DATETIME, Integer, BOOLEAN

from dao.goods.GoodsDao import GoodsDao
from dao.bonds.BondsDao import BondsDao
from dao.stock.StockDao import StockDao

from model.Enumeration import Mode


class Advice(db.Model):
    """
    交易建议
    通过里面的request_id和每个配置方案相挂钩
    """

    __tablename__ = 'Advice'
    code = db.Column(VARCHAR(100))
    name = db.Column(VARCHAR(100))
    price = db.Column(Float)  # 买入价
    quantity = db.Column(Integer)
    type = db.Column(db.Enum(Mode), default='STOCK')
    time = db.Column(DATETIME, default=datetime.today())
    is_done = db.Column(BOOLEAN, default=False)

    request_id = db.Column(Integer, db.ForeignKey('InvestRequirement.id'))
    id = db.Column(Integer, primary_key=True)

    def __init__(self, code, quantity, request_id, type):
        self.code = code
        self.quantity = quantity

        if type == Mode.GOODS:
            self.price = GoodsDao().get_price_by_code(code)
            self.name = GoodsDao().get_goods_name(code)
        elif type == Mode.BOND:
            self.price = BondsDao().get_price_by_code(code)
            self.name = BondsDao().get_name_by_code(code)
        else:
            self.price = StockDao().get_stock_price(code)
            self.name = StockDao().get_stock_name(code)

        self.request_id = request_id
        self.type = type
