import random
from datetime import datetime
from typing import Union

import utils.EmailUtil
import utils.JwtUtil
from config import token_header
from exceptions.EmailNotFoundException import EmailNotFoundException
from exceptions.UsernameNotFoundException import UsernameNotFoundException
from factory import DaoFactory
from model.user.User import User
from model.user.ValidationCode import ValidationCode


class UserBl(object):
    #
    #
    def __init__(self):
        self.user_dao = DaoFactory.userDao
        self.validation_code_dao = DaoFactory.validationCodeDao

    def save_user(self, user: User):
        print(user.__dict__)
        username = user.username
        self.user_dao.insert_user(user)
        token = utils.JwtUtil.create_token(username)
        data = {'token': token_header + token,
                'expireAt': datetime.fromtimestamp(utils.JwtUtil.get_token_exp(token)).strftime('%FT%T')
                }
        return data

    def check_user(self, user: User) -> Union["email", "username", "none"]:
        try:
            self.user_dao.get_user_by_username(user.username)
            return "username"
        except UsernameNotFoundException:
            print('check_user: username not found')
            try:
                self.user_dao.get_user_by_email(user.email)
                return "email"
            except EmailNotFoundException:
                print('check_user: email not found')
                return "none"

    def login_user(self, name_mail: str, password: str):
        user = self.user_dao.get_user_by_username_or_email(name_mail)
        if user is None:
            return {'success': False}
        elif user is not None and password == user.password:
            token = utils.JwtUtil.create_token(user.username)
            data = {'token': token_header + token,
                    'expireAt': datetime.fromtimestamp(utils.JwtUtil.get_token_exp(token)).strftime('%FT%T'),
                    'role': str(user.role.name),
                    'avatarUrl': "",  # TODO
                    'username': str(user.username),
                    'email': str(user.email),
                    'emailValidated': user.email_validated
                    }
            return {'success': True,
                    'data': data
                    }
        else:
            return {'success': False}

    def validate_email(self, user: User):
        token, exp = utils.JwtUtil.create_validation_token(user.username)
        code = random.randint(100000, 999999)
        validation_token = token_header + token
        expire_at = datetime.fromtimestamp(exp)
        utils.EmailUtil.email_message(user.username, user.email, '您本次的验证码为：%d' % code, 'A+Quant邮箱验证')
        self.validation_code_dao.insert_validation_code(ValidationCode(validation_token, code))
        return {'validationToken': validation_token, 'expireAt': expire_at.strftime('%FT%T')}

    def confirm_validation(self, token: str, code: str) -> bool:
        from utils.JwtUtil import get_token_username, verify_bearer_token
        try:
            validation_code = self.validation_code_dao.get_validation_code_by_token(token)
            token = token.split(token_header)[1]
            if not verify_bearer_token(token):
                return False
            if int(code) == validation_code.code:
                username = get_token_username(token)
                self.user_dao.validate_email(username)
                return True
        except Exception:
            return False
        return False


'''
    def get_current_user(self):
        from flask import request
        import config
        from utils import JwtUtil
        token = request.headers.get(config.token_header_key)
        if not token:
            raise Exception

        token = token.split(config.token_header)[1]
        if not JwtUtil.verify_bearer_token(token):
            raise Exception
        else:
            username = JwtUtil.get_token_username(token)
            return self.user_dao.get_user_by_username(username)
'''
