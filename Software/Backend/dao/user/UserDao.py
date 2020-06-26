# -*- coding: utf-8 -*-
import traceback

from exceptions.UsernameNotFoundException import UsernameNotFoundException
from exceptions.EmailNotFoundException import EmailNotFoundException
from model.user.User import User
from run import db


class UserDao(object):
    def __init__(self):
        pass

    def insert_user(self, user):
        try:
            session = db.session()
            session.add(user)
            session.commit()
        except:
            print("error")
            traceback.print_exc()
        finally:
            session.close()

    def get_user_by_username(self, username) -> User:
        try:
            session = db.session()
            user = session.query(User).filter(User.username == username).first()
            if not user:
                raise UsernameNotFoundException
            return user
        finally:
            session.close()

    def get_user_by_email(self, email) -> User:
        try:
            session = db.session()
            user = session.query(User).filter(User.email == email).first()
            if not user:
                raise EmailNotFoundException
            return user
        finally:
            session.close()

    def get_user_by_username_or_email(self, s: str) -> User:
        try:
            return self.get_user_by_username(s)
        except UsernameNotFoundException:
            try:
                return self.get_user_by_email(s)
            except EmailNotFoundException:
                return None

    def validate_email(self, username):
        try:
            session = db.session()
            user = session.query(User).filter(User.username == username).first()
            if not user:
                raise UsernameNotFoundException
            user.email_validated = True
            session.commit()
        except UsernameNotFoundException:
            traceback.print_exc()
        finally:
            session.close()

    '''
    系统推荐需要用到根据用户标签得到用户名字列表
    '''

    def get_username_by_user_type(self, user_type):
        try:
            session = db.session()
            user = session.query(User).filter(User.user_type == user_type)

            if not user:
                raise UsernameNotFoundException

            result = []
            for a_user in user:
                result.append(a_user.username)

            return result

        except UsernameNotFoundException:
            traceback.print_exc()
        finally:
            session.close()

    '''
    得到用户的内置波动率等属性
    '''

    def get_user_preference(self, username):
        user = self.get_user_by_username(username)
        return user.profit, user.risk

    '''
    修改用户的内置波动率等属性（通过问卷）
    '''

    def modify_user_preference(self, username, profit, risk):
        try:
            session = db.session()
            user = session.query(User).filter(User.username == username).first()
            if not user:
                raise UsernameNotFoundException
            user.risk = risk
            user.profit = profit
            session.commit()
        finally:
            session.close()

    '''
    修改用户的花旗账户用户名和密码
    '''
    def modify_user_citi_account(self, username, citi_name, citi_password):
        try:
            session = db.session()
            user = session.query(User).filter(User.username == username).first()
            if not user:
                raise UsernameNotFoundException
            user.citi_username = citi_name
            user.citi_password = citi_password
            session.commit()
        finally:
            session.close()
