from run import db
from sqlalchemy import Float, DATETIME


class Csi300(db.Model):
    __tablename__ = "Csi300"
    date = db.Column(DATETIME, primary_key=True)
    price = db.Column(Float)

    def __init__(self, date, price):
        self.date = date
        self.price = price
