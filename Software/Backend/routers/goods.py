from flask_restplus import Resource, fields, Namespace
import traceback

from factory.BlFactory import goodsBl
from decorator.RoleRequest import login_require
from model.user.Role import Role
from model.user.User import User

ns = Namespace('invreq/<invreq_id>/goods', description='关于商品市场数据')

goods_arg_parser = ns.parser()
goods_arg_parser.add_argument('invreq_id', type=str, help='账户Id。', location='path')

each_goods_overview = ns.model('某个商品市场总体情况', {
    'startDate': fields.String(description="初始时间，格式yy-mm-dd"),
    'currentVolume': fields.Float(description="当前金额"),
    'currentRatio': fields.Float(description="当前占比：百分数"),
    'profit': fields.Float(description="收益：百分数"),
    'quotaId': fields.String(description="标的id"),
    "name": fields.String(description="标的名称"),
    "price": fields.Float(description="价格"),
    "quantity": fields.Float(description="数量"),
})
goods_overview = ns.model('全部商品市场总体情况', {
    'futuresOverview': fields.Nested(each_goods_overview, description="原油期货"),
    'spotOverview': fields.Nested(each_goods_overview, description="原油现货")
})


@ns.route('')
class GoodsOverviewApi(Resource):
    @ns.doc('商品市场总体情况')
    @ns.expect(goods_arg_parser)
    @ns.response(200, '获取成功', goods_overview)
    @ns.response(500, "服务器错误")
    @ns.response(401, "没有登录")
    @ns.response(403, "需要用户权限")
    @login_require(Role.USER)
    def get(self, invreq_id: str, user: User):
        try:
            return {'futuresOverview': [],
                    'spotOverview': []}, 200
        except:
            traceback.print_exc()
            return {}, 500


bonus_return_ratio = ns.model('每日商品收益率', {
    'name': fields.String(description='商品名'),
    'ratio': fields.Float(description='商品收益率')
})

daily_return_ratio_table = ns.model('每天的商品收益率，组合收益率，组合总收益', {
    'date': fields.String(description='日期，日期格式Year-Month-Day，例如2018-09-03。（只有周一到周五， 周末闭市）'),
    'bonusRatio': fields.List(fields.Nested(bonus_return_ratio), description='所有商品的在日期date的收益率列表'),
    'totalIncomeRatio': fields.Float(description='商品组合在日期date的收益率'),
    'totalIncome': fields.Float(description='商品组合在日期date的总收益')
})

dynamic_drawdown_and_absolute_return_response = ns.model('动态回撤和绝对收益图数据', {
    'absoluteReturn': fields.List(fields.Nested(daily_return_ratio_table), description='收益列表'),
    'maxDrawdown': fields.Float(description='最大回撤，百分数，有正有负，95%输出95'),
    'startDate': fields.String(description='最大回撤起始日期，日期格式Year-Month-Day，例如2018-09-03'),
    'endDate': fields.String(description='最大回撤终止日期，日期格式Year-Month-Day，例如2018-09-03'),
    'days': fields.Integer(description='最大回撤回补期')
})


@ns.route('/dynamic_drawdown_and_absolute_return')
class GoodsResidualAnalysisApi(Resource):

    @ns.doc('动态回撤和绝对收益图')
    @ns.expect(goods_arg_parser)
    @ns.response(200, '获取成功', dynamic_drawdown_and_absolute_return_response)
    @ns.response(500, "服务器错误")
    @ns.response(401, "没有登录")
    @ns.response(403, "需要用户权限")
    @login_require(Role.USER)
    def get(self, invreq_id: str, user: User):
        # args = goods_arg_parser.parse_args()
        # invreq_id = args['invreq_id']
        try:
            return goodsBl.get_dynamic_drawdown_and_absolute_return(invreq_id), 200
        except:
            traceback.print_exc()
            return {}, 500


total_income_ratio = ns.model('每日的组合收益率', {
    'date': fields.String(description='日期，日期格式Year-Month-Day，例如2018-09-03。（只有周一到周五， 周末闭市）'),
    'type': fields.String(description='类型，如：趋势强波动高'),
    'totalIncomeRatio': fields.Float(description='组合收益率')
})

type_data_table = ns.model('场景分析分类数据表项', {
    'type': fields.String(description='类型，如：趋势强波动高'),
    'weekNum': fields.Integer(description='此类型周期数'),
    'maxWeekIncomeRatio': fields.Float(description='周收益率最大值，百分数，95%输出95'),
    'minWeekIncomeRatio': fields.Float(description='周收益率最小值，百分数，95%输出95'),
    'fluctuationRatio': fields.Float(description='波动率，百分数，95%输出95'),
    'maxDrawdown': fields.Float(description='最大回撤率，百分数，95%输出95'),
    'sharpeRatio': fields.Float(description='夏普比率'),
    'calmarRatio': fields.Float(description='Calmar比率')
})

scene_analysis_response = ns.model('场景分析数据', {
    'totalIncomeRatioList': fields.List(fields.Nested(total_income_ratio), description='组合收益率列表'),
    'typeData': fields.List(fields.Nested(type_data_table), description='一共四个类型')
})


@ns.route('/scene_analysis')
class GoodsSceneAnalysisApi(Resource):

    @ns.doc('场景分析（夏普比率，Calmar比率）')
    @ns.expect(goods_arg_parser)
    @ns.response(200, '获取成功', scene_analysis_response)
    @ns.response(500, "服务器错误")
    @ns.response(401, "没有登录")
    @ns.response(403, "需要用户权限")
    @login_require(Role.USER)
    def get(self, invreq_id: str, user: User):
        # args = goods_arg_parser.parse_args()
        # invreq_id = args['invreq_id']
        try:
            return goodsBl.get_scene_analysis(invreq_id), 200
        except:
            traceback.print_exc()
            return {}, 500


comparision_table = ns.model('每日与市场基准的比较', {
    'date': fields.String(description='日期，日期格式Year-Month-Day，例如2018-09-03。（只有周一到周五， 周末闭市）'),
    'marketRatio1': fields.Float(description='南方原油市场基准'),
    'marketRatio2': fields.Float(description='南华商品指数市场基准'),
    'totalIncomeRatio': fields.Float(description='组合收益率'),
})

comparision_with_market_benchmark_response = ns.model('与市场基准比较的数据', {
    'comparisionWithMarketBenchmark': fields.List(fields.Nested(comparision_table), description='与市场基准比较的数据列表')
})


@ns.route('/comparision_with_market_benchmark')
class GoodsComparisionWithMarketBenchmarkApi(Resource):

    @ns.doc('与市场基准比较')
    @ns.expect(goods_arg_parser)
    @ns.response(200, '获取成功', comparision_with_market_benchmark_response)
    @ns.response(500, "服务器错误")
    @ns.response(401, "没有登录")
    @ns.response(403, "需要用户权限")
    @login_require(Role.USER)
    def get(self, invreq_id: str, user: User):
        # args = goods_arg_parser.parse_args()
        # invreq_id = args['invreq_id']
        try:
            return goodsBl.get_comparision_with_market_benchmark(invreq_id), 200
        except:
            traceback.print_exc()
            return {}, 500


factor_sensitivity_point = ns.model('以组合收益率作为纵坐标，以波动率作为横坐标', {
    'weekIncomeRatio': fields.Float(description='周收益率'),
    'weekFluctuationRatio': fields.Float(description='周波动率'),
})

factor_sensitivity_analysis_response = ns.model('因子敏感性分析数据', {
    'factorSensitivity': fields.List(fields.Nested(factor_sensitivity_point), description='因子敏感性分析点的列表'),
    'x1': fields.Float(description='x1'),
    'y1': fields.Float(description='y1'),
    'x2': fields.Float(description='x2'),
    'y2': fields.Float(description='y2'),
})


@ns.route('/factor_sensitivity_analysis')
class GoodsFactorSensitivityAnalysisApi(Resource):

    @ns.doc('因子敏感性分析\n以组合收益率作为纵坐标\n以波动率作为横坐标\n通过线性拟合与曲线拟合，形成折线图')
    @ns.expect(goods_arg_parser)
    @ns.response(200, '获取成功', factor_sensitivity_analysis_response)
    @ns.response(500, "服务器错误")
    @ns.response(401, "没有登录")
    @ns.response(403, "需要用户权限")
    @login_require(Role.USER)
    def get(self, invreq_id: str, user: User):
        # args = goods_arg_parser.parse_args()
        # invreq_id = args['invreq_id']
        try:
            return goodsBl.get_factor_sensitivity_analysis(invreq_id), 200
        except:
            traceback.print_exc()
            return {}, 500


residual_table = ns.model('每日残差', {
    'date': fields.String(description='日期，日期格式Year-Month-Day，例如2018-09-03。（只有周一到周五， 周末闭市）'),
    'residual': fields.Float(description='残差')
})

residual_analysis_response = ns.model('残差分析数据', {
    'residualList': fields.List(fields.Nested(residual_table), description='残差列表'),
    'kurt': fields.Float('峰度'),
    'skew': fields.Float('偏度')
})


@ns.route('/residual_analysis')
class GoodsResidualAnalysisApi(Resource):

    @ns.doc('残差项分析（残差收益率时序图和残差收益分布图）')
    @ns.expect(goods_arg_parser)
    @ns.response(200, '获取成功', residual_analysis_response)
    @ns.response(500, "服务器错误")
    @ns.response(401, "没有登录")
    @ns.response(403, "需要用户权限")
    @login_require(Role.USER)
    def get(self, invreq_id: str, user: User):
        # args = goods_arg_parser.parse_args()
        # invreq_id = args['invreq_id']
        try:
            return goodsBl.get_residual_analysis(invreq_id), 200
        except:
            traceback.print_exc()
            return {}, 500


memorabilia_table = ns.model('大事记表项', {
    'scene': fields.String(description='情景名称'),
    'startDate': fields.String(description="历史情景开始时间，日期格式Year-Month-Day，例如2018-09-03"),
    'endDate': fields.String(description="历史情景结束时间, 日期格式Year-Month-Day，例如2018-09-03"),
    'returnRatio': fields.Float(description='区间收益率'),
    'maxDrawdown': fields.Float(description='区间最大回撤'),
    'fluctuation': fields.Float(description='区间波动率'),
    'nanhuaMarketRatio': fields.Float(description='南华市场基准')
})

memorabilia_response = ns.model('大事记数据', {
    'memorabilia': fields.List(fields.Nested(memorabilia_table), description='历史大事记列表')
})


@ns.route('/memorabilia')
class GoodsMemorabiliaApi(Resource):

    @ns.doc('期货大事记')
    @ns.expect(goods_arg_parser)
    @ns.response(200, '获取成功', memorabilia_response)
    @ns.response(500, "服务器错误")
    @ns.response(401, "没有登录")
    @ns.response(403, "需要用户权限")
    @login_require(Role.USER)
    def get(self, invreq_id: str, user: User):
        # args = goods_arg_parser.parse_args()
        # invreq_id = args['invreq_id']
        try:
            return goodsBl.get_memorabilia(invreq_id), 200
        except:
            traceback.print_exc()
            return {}, 500
