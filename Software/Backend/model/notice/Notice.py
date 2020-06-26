from run import db
from datetime import datetime
from sqlalchemy import VARCHAR, DATETIME, Integer


class Notice(db.Model):
    __tablename__ = 'Notice'

    type = db.Column(VARCHAR(20), default='Others')
    time = db.Column(DATETIME, default=datetime.today())

    id = db.Column(Integer, primary_key=True)
    content = db.Column(VARCHAR(100), default="")
    username = db.Column(VARCHAR(100), db.ForeignKey('User.username'))

    def __init__(self, content, username, type):
        self.time = datetime.today()
        self.content = content
        self.username = username
        self.type = type