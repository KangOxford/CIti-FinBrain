from flask_restplus import Resource, Namespace, fields

from decorator.RoleRequest import login_require
from factory.BlFactory import stockBl
from factory.DaoFactory import investDao
from model.user.User import User
from model.vo.StockAttributeResponse import StyleConfigForm, StyleExplainForm, PreferAndContr
from model.vo.StockPerformResponse import ChartData, FormData
from model.vo.StockScenarioResponse import MarketRouteChart, MarketRouteForm, SensibilityChartItem

ns = Namespace('invreq/<invreq_id>/stock', description='关于股票数据')

# 登录相关参数和响应
stock_arg_parser = ns.parser()
stock_arg_parser.add_argument('invreq_id', type=str, help='账户Id。', location='path')

stock_overview_response = ns.model("Stock Overview Response", {
    'startDate': fields.String(description="初始时间"),
    'currentVolume': fields.Float(description="当前金额"),
    'currentRatio': fields.Float(description="股票当前占比"),
})

stock_perform_response = ns.model("Stock Achievement Response", {
    'chartData': fields.List(cls_or_instance=ChartData),
    'formData': fields.List(cls_or_instance=FormData)
})

stock_attribute_response = ns.model("Stock Attribute Response", {
    'styleConfigForm': fields.List(cls_or_instance=StyleConfigForm),
    'styleExplainForm': fields.List(cls_or_instance=StyleExplainForm),
    'preferAndContrList': fields.List(cls_or_instance=PreferAndContr),
})

stock_scenario_response = ns.model("Stock Scenario Response", {
    'marketRouteChart': fields.List(cls_or_instance=MarketRouteChart),
    'marketRouteForm': fields.List(cls_or_instance=MarketRouteForm),
    'sensibilityChart': fields.List(cls_or_instance=SensibilityChartItem)
})


@ns.route('')
class StockOverviewApi(Resource):
    @ns.doc('股票业绩分析')
    @ns.expect(stock_arg_parser)
    @ns.response(200, "获取成功", stock_overview_response)
    @ns.response(500, "服务器错误")
    def get(self, invreq_id: str):
        matching = investDao.get_invest_requirement_matchining(invreq_id)
        date = str(investDao.get_one_invest(invreq_id).start_date).split(' ')[0]
        # radio = round(matching.stock / (matching.stock + matching.bonds + matching.goods + 0.000001), 2)
        # print(radio)
        return {'startDate': date,
                'currentVolume': matching.stock,
                'currentRatio': round(matching.stock / (matching.goods + matching.bonds + matching.stock + 0.000000001),
                                      4) * 100}, 200
        pass


@ns.route('/perform')
@ns.param("invreq_id", "资产账户ID")
class StockPerformApi(Resource):

    @ns.doc('股票业绩分析')
    @ns.response(200, "获取成功", stock_perform_response)
    @ns.response(500, "服务器错误")
    @login_require()
    def get(self, user: User, invreq_id: str):
        # args = stock_arg_parser.parse_args()
        # invreq_id = args['invreq_id']
        print('perform')
        try:
            return stockBl.get_achievement(invreq_id), 200
        except:
            return {}, 500


@ns.route('/attribute')
@ns.param("invreq_id", "资产账户ID")
class StockAttributeApi(Resource):

    @ns.doc('归因分析')
    # @ns.expect(stock_arg_parser)
    @ns.response(200, "获取成功", stock_attribute_response)
    @ns.response(500, "服务器错误")
    @login_require()
    def get(self, user: User, invreq_id: str):
        # args = stock_arg_parser.parse_args()
        # invreq_id = args['invreq_id']
        # try:
        #     return stockBl.get_reason(invreq_id), 200
        # except:
        #     return {}, 500
        return stockBl.get_reason(invreq_id), 200


@ns.route('/scenario')
@ns.param("invreq_id", "资产账户ID")
class StockScenarioeApi(Resource):

    @ns.doc('场景分析')
    # @ns.expect(stock_arg_parser)
    @ns.response(200, "获取成功", stock_scenario_response)
    @ns.response(401, "用户密码无效")
    @login_require()
    def get(self, user: User, invreq_id: str):
        # args = stock_arg_parser.parse_args()
        # invreq_id = args['invreq_id']
        # try:
        #     return stockBl.get_scene(invreq_id), 200
        # except:
        #     return {}, 500
        return stockBl.get_scene(invreq_id), 200
