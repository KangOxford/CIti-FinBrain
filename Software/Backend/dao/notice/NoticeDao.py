from model.notice.Notice import Notice
from dao.DaoUtil import DaoUtil

from run import db
import traceback


class NoticeDao(DaoUtil):
    def __init__(self):
        pass

    def get_all_notice(self, username):
        try:
            session = db.session()
            notice = session.query(Notice).filter(Notice.username == username)
            return notice
        except:
            print("error")
            traceback.print_exc()
        finally:
            session.close()
        pass

    def delete_notice_by_ID(self, id):
        try:
            session = db.session()
            notice = session.query(Notice).filter(Notice.id == id)[0]
            session.delete(notice)
            session.commit()
        except:
            print("delete error")
            traceback.print_exc()
        finally:
            session.close()
        pass
