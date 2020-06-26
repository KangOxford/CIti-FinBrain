from run import db
from sqlalchemy import Float, DATETIME, Integer

from datetime import datetime


class Profit(db.Model):
    __tablename__ = 'Profit'
    id = db.Column(Integer, primary_key=True)
    date = db.Column(DATETIME, default=datetime.today())
    profit_rate = db.Column(Float, default=0)
    invreq_id = db.Column(Integer, db.ForeignKey('InvestRequirement.id'))

    def __init__(self, profit_rate, invrq_id):
        self.profit_rate = profit_rate
        self.invreq_id = invrq_id
