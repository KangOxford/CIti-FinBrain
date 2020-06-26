from run import db
from sqlalchemy import VARCHAR, INTEGER

class ValidationCode(db.Model):
    __tablename__ = "ValidationCode"
    token = db.Column(VARCHAR(200), primary_key=True)
    code = db.Column(INTEGER)

    def __init__(self, token: str, code: int):
        self.token = token
        self.code = code
