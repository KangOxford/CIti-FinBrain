from run import db
from sqlalchemy import VARCHAR, DATETIME, Integer, Float

from model.Enumeration import Mode, SellMethod
from dao.stock.StockDao import StockDao
from dao.goods.GoodsDao import GoodsDao
from dao.bonds.BondsDao import BondsDao


class TransactionRecord(db.Model):
    """
    交易记录
    通过里面的request_id和每个配置方案相挂钩
    """
    __tablename__ = "TransactionRecord"
    id = db.Column(Integer, primary_key=True)
    quota_id = db.Column(VARCHAR(50))
    quota_name = db.Column(VARCHAR(50))
    time = db.Column(DATETIME)
    type = db.Column(db.Enum(Mode), default='STOCK')
    buy_or_sale = db.Column(db.Enum(SellMethod), default='BUY')
    quantity = db.Column(Integer)
    price = db.Column(Float)
    expense = db.Column(Float)  # 手续费
    matching = db.Column(Float, default=0)  # 此产品占此类型的占比
    lastMatching = db.Column(Float, default=0)  # 上一次交易时候此产品占此类型的占比
    request_id = db.Column(Integer, db.ForeignKey('InvestRequirement.id'))

    def __init__(self, code, price, quantity, time, expense, type, request_id):
        self.quota_id = code
        self.expense = expense
        self.price = price
        if quantity > 0:  # 买入
            self.quantity = quantity
            self.buy_or_sale = SellMethod.BUY
        elif quantity < 0:  # 卖出
            self.quantity = -quantity
            self.buy_or_sale = SellMethod.SELL

        self.time = time
        self.type = type
        if type == Mode.STOCK:
            self.quota_name = StockDao().get_stock_name(code)
        elif type == Mode.BOND:
            self.quota_name = BondsDao().get_name_by_code(code)
        else:
            self.quota_name = GoodsDao().get_goods_name(code)
        self.request_id = request_id
        self.matching = 0
        self.lastMatching = 0
