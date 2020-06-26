from functools import wraps
from flask import json, request, make_response

import config
from factory import DaoFactory
from model.user import Role
import utils.JwtUtil as JwtUtil
from routers import api


def respond_err(error: str, status_code: int):
    response = make_response(json.dumps({"error": error}))
    response.status_code = status_code
    return response


def login_require(*roles: Role):
    '''
    标记在一个REST的方法上（比如User::get），表示这个方法需要验证是否登录（即是headers里是否有有效的Authorization: Bearer {token}）。
    这也会自动给方法加上api.doc注解，以能在访问API文档的时候提供加入token的选项

    如果没有登录，返回401
    如果已经登录，但是登录的用户角色不包含在参数里，返回403
    否则，会给被调用函数传入user参数，即为用户对象

    :param roles: 允许的用户的角色，若不传入默认允许所有已登录用户。
    :return: decorator而已
    '''
    def decorator(func):
        @wraps(func)
        @api.doc(security='apikey')
        def wrapper(*args, **kws):
            token = request.headers.get(config.token_header_key)
            if not token:
                return respond_err("No token", 401)

            token = token.split(config.token_header)[1]
            if not JwtUtil.verify_bearer_token(token):
                return respond_err("Invalid token", 401)
            else:
                username = JwtUtil.get_token_username(token)
                print(username)
                user = DaoFactory.userDao.get_user_by_username(username)

                if len(roles) > 0 and not user.role in roles:
                    return respond_err("Bad role", 403)

                #request.args.add("current_role", user)
                return func(user=user,*args, **kws)
        return wrapper

    return decorator
