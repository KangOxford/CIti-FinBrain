import traceback

from model.user.ValidationCode import ValidationCode
from run import db

class ValidationCodeDao:
    def __init__(self):
        pass

    def insert_validation_code(self, code):
        try:
            session = db.session()
            session.add(code)
            session.commit()
        except:
            traceback.print_exc()
        finally:
            session.close()

    def get_validation_code_by_token(self, token) -> ValidationCode:
        try:
            session = db.session()
            validation_code = session.query(ValidationCode).filter(ValidationCode.token == token).first()
            if not validation_code:
                raise Exception('The validation token does not exist!')
            return validation_code
        finally:
            session.close()