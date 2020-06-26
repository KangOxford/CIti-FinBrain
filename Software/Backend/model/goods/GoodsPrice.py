from run import db
from sqlalchemy import Float, Integer, String


class GoodsPrice(db.Model):
    __tablename__ = 'GoodsPrice'
    id = db.Column(Integer, primary_key=True)
    date = db.Column(String, default="")
    price = db.Column(Float, default=0)
    name = db.Column(String, default="")

    def __init__(self, date, price, name):
        self.date = date
        self.price = price
        self.name = name
