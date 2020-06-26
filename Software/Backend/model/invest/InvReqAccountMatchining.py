from run import db
from sqlalchemy import INTEGER


class InvestRequirementMatchining(db.Model):
    __tablename__ = 'InvestRequirementMatchining'
    stock = db.Column(INTEGER, default=0)  # 股票市场总金额
    bonds = db.Column(INTEGER, default=0)  # 基金市场总金额
    goods = db.Column(INTEGER, default=0)  # 商品市场总金额
    invreq_id = db.Column(INTEGER, primary_key=True)

    def __init__(self, reqest_id):
        self.invreq_id = reqest_id