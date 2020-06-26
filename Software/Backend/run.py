# -*- coding: utf-8 -*-
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import config



def create_app():
    app = Flask(__name__, static_folder='static')
    app.config['DEBUG'] = True
    app.config['SECRET_KEY'] = 'wfhg9hr-1jfpjf-p3j-=vgf0pvmo3k=2-3rj0-3j=gn[=3-g[mj'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite+pysqlite:///./testdb.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
    CORS(app)

    return app


def create_db(app):
    print("create db")
    db = SQLAlchemy(app)
    return db


def register_api():
    from routers.user import ns as user_ns
    from routers.user_info import ns as user_info_ns
    from routers.invreq import ns as invreq_ns
    from routers.stock import ns as stock_ns
    from routers.goods import ns as goods_ns
    from routers.bond import ns as bond_ns
    from routers.invpref import ns as invpref_ns
    from routers import api
    from routers.notification import ns as notification_ns
    from routers.quotation import ns as quotation_ns
    api.add_namespace(user_ns)
    api.add_namespace(user_info_ns)
    api.add_namespace(invreq_ns)
    api.add_namespace(stock_ns)
    api.add_namespace(bond_ns)
    api.add_namespace(goods_ns)
    api.add_namespace(invpref_ns)
    api.add_namespace(notification_ns)
    api.add_namespace(quotation_ns)


def register(app):
    from routers import api_blueprint
    app.register_blueprint(api_blueprint)


def start_timer():
    from datetime import datetime, timedelta
    from timer import timer_methods, timer_methods_per_day
    from threading import Timer

    print('start timer')

    # now_second = datetime.now().second + datetime.now().microsecond / 10**6
    # for method in timer_methods_per_day:
    #     Timer(60 - now_second, method).start()

    # 每天九点
    refresh_time = datetime.now().replace(hour=9, minute=0, second=0, microsecond=0)
    if refresh_time < datetime.now():
        refresh_time = refresh_time + timedelta(days=1)
    for method in timer_methods:
        Timer((refresh_time - datetime.now()).total_seconds(), method).start()


def step1GetAccessToken():
    import base64
    import requests
    import json

    encode_key = config.client_id + ':' + config.client_key
    authorization = 'Basic ' + str(base64.b64encode(encode_key.encode('utf-8')), 'utf-8')

    payload = {
        'grant_type': 'client_credentials',
        'scope': '/api'
    }
    headers = {
        'accept': "application/json",
        'authorization': authorization,
        'content-type': "application/x-www-form-urlencoded"
    }
    try:
        r = requests.post("https://sandbox.apihub.citi.com/gcb/api/clientCredentials/oauth2/token/hk/gcb", data=payload,
                          headers=headers)
        data = json.loads(r.text)
        config.access_token = data['access_token']
        print('access token: ' + config.access_token)
    except:
        print("citi sandbox failed")
    pass


def step2GetBizToken():
    import uuid
    import requests
    import json

    if config.access_token is None:
        return

    authorization = "Bearer " + config.access_token
    u = str(uuid.uuid1())
    headers = {
        'authorization': authorization,
        'client_id': config.client_id,
        'uuid': u,
        'content-type': "application/json"
    }
    try:
        r = requests.get("https://sandbox.apihub.citi.com/gcb/api/security/e2eKey", headers=headers)
        text = json.loads(r.text)
        config.modulus = text['modulus']
        config.exponent = text['exponent']
        config.bizToken = r.headers['bizToken']
        config.eventId = r.headers['eventId']
        print({
            'modulus': config.modulus,
            'exponent': config.exponent,
            'bizToken': config.bizToken,
            'eventId': config.eventId
        })
    except:
        print("citi sandbox failed")

    pass


app = create_app()
db = create_db(app)
session = db.session

if __name__ == '__main__':
    register_api()
    register(app)
    start_timer()
    step1GetAccessToken()
    step2GetBizToken()
    app.run(
        host = '0.0.0.0',
        port = 5000,  
        debug = True 
    )
