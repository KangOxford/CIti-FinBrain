from run import db
from sqlalchemy import Float, DATETIME


class StockTotalHistory(db.Model):
    __tablename__ = "StockTotalHistory"
    date = db.Column(DATETIME, primary_key=True)
    ssr_50 = db.Column(Float)
    csi_300 = db.Column(Float)
    chinese_index = db.Column(Float)

