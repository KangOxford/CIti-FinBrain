from run import db
from sqlalchemy import INTEGER, DATETIME


class ReallowcationRecord(db.Model):
    # 持仓记录 在每次触发交易的时候都要进行记录
    __tablename__ = "ReallowcationRecord"
    stock_before = db.Column(INTEGER)  # 股票 交易前总金额
    bonds_before = db.Column(INTEGER)  # 基金 交易前总金额
    goods_before = db.Column(INTEGER)  # 商品 交易前总总金额
    stock_after = db.Column(INTEGER)  # 股票 交易后总金额
    bonds_after = db.Column(INTEGER)  # 基金 交易后总金额
    goods_after = db.Column(INTEGER)  # 商品 交易后总总金额
    invreq_id = db.Column(INTEGER, db.ForeignKey('InvestRequirement.id'))
    id = db.Column(INTEGER, primary_key=True)
    time = db.Column(DATETIME)

    def __init__(self):
        pass
