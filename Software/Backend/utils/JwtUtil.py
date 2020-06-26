import jwt
import time

import config


def create_token(username):
    payload = {
        "iat": int(time.time()),
        "exp": int(time.time()) + config.token_expire_seconds,
        "username": username,
        "scopes": ['open']
    }
    token = str(jwt.encode(payload, config.secret, algorithm='HS256'), encoding="utf-8")
    return token


def create_validation_token(username):
    payload = {
        "iat": int(time.time()),
        "exp": int(time.time()) + config.validation_token_expire_seconds,
        "username": username,
        "scopes": ['open']
    }
    token = str(jwt.encode(payload, config.secret, algorithm='HS256'), encoding="utf-8")
    return token, payload['exp']


def verify_bearer_token(token):
    print(token)
    payload = jwt.decode(token, config.secret, algorithms=['HS256'])
    if payload and payload["exp"] > int(time.time()):
        return True
    return False


def get_token_username(token):
    payload = jwt.decode(token, config.secret, algorithms=['HS256'])
    return payload["username"]


def get_token_exp(token):
    payload = jwt.decode(token, config.secret, algorithms=['HS256'])
    return payload["exp"]
