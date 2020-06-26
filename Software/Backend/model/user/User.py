from datetime import datetime

from run import db
from sqlalchemy import VARCHAR, FLOAT, BOOLEAN, DATETIME, INTEGER
from model.user.Role import Role


class User(db.Model):
    __tablename__ = "User"
    username = db.Column(VARCHAR(20), primary_key=True)
    password = db.Column(VARCHAR(20))
    email = db.Column(VARCHAR(20))
    email_validated = db.Column(BOOLEAN)
    register_time = db.Column(DATETIME)
    role = db.Column(db.Enum(Role))
    amount = db.Column(FLOAT, default=0.0)  # 金额（初始资金）
    profit = db.Column(FLOAT, default=0.0)  # 收益
    risk = db.Column(FLOAT, default=0.0)  # 风险
    year = db.Column(INTEGER, default=0)  # 年限
    citi_username = db.Column(VARCHAR(50))  # 花旗用户名
    citi_password = db.Column(VARCHAR(1000))  # 花旗密码
    user_type = db.Column(INTEGER, default=1)  # 用户的标签，默认是1，在系统推荐时要用

    def __init__(self, username: str, password: str, email: str, register_time: datetime, role=Role.USER):
        self.username = username
        self.password = password
        self.email = email
        self.register_time = register_time
        self.role = role
        self.email_validated = False
        self.amount = 0
        self.profit = 0
        self.risk = 0
        self.year = 0

