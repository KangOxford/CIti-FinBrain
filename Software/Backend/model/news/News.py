from run import db
from sqlalchemy import Integer, VARCHAR


class News(db.Model):
    __tablename__ = 'News'
    id = db.Column(Integer, primary_key=True)
    time = db.Column(VARCHAR(500), default='')
    title = db.Column(VARCHAR(500), default='')
    content = db.Column(VARCHAR(500), default='')

    def __init__(self, title, content, time):
        self.title = title
        self.content = content
        self.time = time
        pass
