# -*- coding: utf-8 -*-
from sqlalchemy.exc import IntegrityError

from exceptions.SQLException import InsertException
from run import db
import traceback


class DaoUtil(object):
    def __init__(self):
        self.session = db.session()
        pass

    def insert(self, object):
        try:
            self.session = db.session()
            self.session.add(object)
            self.session.commit()
            self.session.close()
            # return object.id
        except IntegrityError:
            """产生这个error的可能原因, 已经存在，外健问题"""
            traceback.print_exc()
            raise InsertException
        finally:
            self.session.close()

    def delete(self, object):
        try:
            self.session = db.session()
            self.session.delete(object)
            self.session.commit()
            self.session.close()
        except:
            traceback.print_exc()
        finally:
            self.session.close()
