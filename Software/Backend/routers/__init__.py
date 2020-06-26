from flask import Blueprint
from flask_restplus import Api
import config

authorizations = {
    'apikey': {
        'type': 'apiKey',
        'in': 'header',
        'name': config.token_header_key
    }
}

api_blueprint = Blueprint("open_api", __name__, url_prefix="/api")
api = Api(api_blueprint,
          version='1.0',
          title='A+Quant',
          description='大类资产配置系统api',
          authorizations=authorizations
          )

# schema_activity = api.model('SchemaActivity', {
#     'url': fields.String(required=True, description='活动网址'),
#     'title': fields.String(required=True, description='活动标题')
# })
