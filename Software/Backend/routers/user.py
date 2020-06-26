import random
from datetime import datetime

from flask_restplus import Resource, fields, Namespace

from decorator.RoleRequest import login_require
from factory.BlFactory import userBl, globalAllocationBl
from model.invest.InvReqAccountMatchining import InvestRequirementMatchining
from model.invest.InvestRequirement import InvestRequirement
from model.notice.Notice import Notice
from model.user.Role import Role
from model.user.User import User
from utils.CitiApiUtil import getRealAccessToken

from factory.DaoFactory import userDao, noticeDao, investDao

ns = Namespace('user', description='关于用户')

# 登录相关参数和响应
login_arg_parser = ns.parser()
login_arg_parser.add_argument('name_mail', type=str, help='用户名或者邮箱。遍历的时候都查一下。', location='args')
login_arg_parser.add_argument('password', type=str, help='密码', location='args')

login_response = ns.model("Login Response", {
    'token': fields.String(description="Token"),
    'expireAt': fields.DateTime(description="Token将在啥时候过期"),
    'role': fields.String(enum=Role.get_enum_labels(), description="角色"),
    'avatarUrl': fields.String(description="头像URL"),
    'username': fields.String(description="用户名"),
    'email': fields.String(description="Email"),
    'emailValidated': fields.Boolean(description="此用户电邮是否已经验证")
})

register_response = ns.model("Register Response", {
    'token': fields.String(description="Token"),
    'expireAt': fields.DateTime(description="Token将在啥时候过期")
})

# 确认验证所需参数
validation_parameters = ns.model("EmailValidation", {
    'validationToken': fields.String(required=True, description='申请验证的时候返回的token'),
    'validationCode': fields.String(required=True, description='申请验证的时候发到邮箱的code'),
})


@ns.route('')
class UserApi(Resource):

    @ns.doc('登录')
    @ns.expect(login_arg_parser)
    @ns.response(200, "登录成功", login_response)
    @ns.response(401, "用户密码无效")
    def get(self):
        args = login_arg_parser.parse_args()
        name_mail = args['name_mail']
        password = args['password']
        print(name_mail, password)
        res = userBl.login_user(name_mail, password)
        if res['success'] is False:
            return {}, 401
        return res['data'], 200

    @ns.doc('注册')
    @ns.expect(ns.model("RegisterParameters", {
        'username': fields.String(required=True, description='用户名'),
        'password': fields.String(required=True, description='密码'),
        'email': fields.String(required=True, description="Email"),
    }))
    @ns.response(201, "注册成功", register_response)
    @ns.response(409, '用户名已经存在', ns.model("Register Conflict", {
        'field': fields.String(enum=["username", "email"])
    }))
    def post(self):
        username = ns.payload['username']
        password = ns.payload['password']
        email = ns.payload['email']
        # TODO 密码加密
        new_user = User(username, password, email, datetime.utcnow())
        check_result = userBl.check_user(new_user)

        if not check_result == "none":
            return {"field": check_result}, 409
        res = userBl.save_user(new_user)
        noticeDao.insert(Notice(' ', username, 'PreferenceEvaluation'))

        # 系统推荐
        allocation = globalAllocationBl.get_allocation(random.random() * 0.04, random.random() * 0.2,
                                                       random.random() * 30000, 3, False)

        # 年预期风险
        predict_risk = round(allocation[0], 2)
        predict_revenue = round(allocation[1], 2)
        account = InvestRequirement(0.04, 0.2, 20000, 3, username, predict_revenue, predict_risk)

        investDao.insert(account)

        invest_id = investDao.get_latest_invest_id()
        investDao.insert(InvestRequirementMatchining(invest_id))
        # investDao.insert(InvestRequirementMatchining(invest_id))

        advices = allocation[2]
        for advice in advices:
            advice.request_id = invest_id
            investDao.insert(advice)
        return res, 201


@ns.route('/validation/email')
@ns.doc("验证电子邮箱")
class UserValidation(Resource):

    # 实现说明：
    # token和code是配对的，希望能够做到用一种算法能够做到以下：
    # 1. token和code一一对应，给定token和code能够验证是否匹配，但是不能互相计算出来
    # 2. 可以从token计算出token的生效日期，这样在验证的时候能够计算出这个token是否还有效
    # 这样就不需要额外开一张表了

    @ns.doc("发送验证邮件或者进行验证。")
    @ns.response(200, "邮件已经发送", ns.model("EmailValidationRequest", {
        'validationToken': fields.String(description="用于验证用的Token。提交验证码时需要提交本token。"),
        'expireAt': fields.DateTime(description="Token失效日期")
    }))
    @ns.response(401, "没有登录")
    @ns.response(403, "需要用户权限")
    @ns.response(409, "已经验证。")
    @login_require(Role.USER)
    def get(self, user: User):
        if user.email_validated:
            return {}, 409
        return userBl.validate_email(user), 200

    @ns.doc("确认验证代码")
    @ns.expect(validation_parameters)
    @ns.response(204, "确认成功")
    @ns.response(400, "验证失败")
    @ns.response(401, "没有登录")
    @ns.response(403, "需要用户权限")
    @login_require(Role.USER)
    def post(self, user: User):
        token = ns.payload['validationToken']
        code = ns.payload['validationCode']
        if userBl.confirm_validation(token, code):
            return {}, 204
        return {}, 400


@ns.route('/bindingParameters')
@ns.doc("获得绑定花旗账户用的数据")
class BindingParameters(Resource):
    @ns.doc("获得绑定花旗账户用的数据")
    @ns.response(200, "数据", ns.model("参数", {
        "modulus": fields.String(),
        "exponent": fields.String(),
        "eventId": fields.String()
    }))
    @login_require()
    def get(self, user: User):
        import config
        return {
            "modulus": config.modulus,
            "exponent": config.exponent,
            "eventId": config.eventId
        }
        pass


@ns.route("/citiAccount")
@ns.doc("获得和设置账号绑定的花旗银行账户")
class CitiAccount(Resource):
    @ns.doc("获得与此账号绑定的花旗银行账户")
    @ns.response(200, "花旗银行账户用户名", ns.model("绑定的花旗银行账户的用户名", {
        "username": fields.String(description="花旗银行账户用户名"),
    }))
    @login_require()
    def get(self, user: User):
        return {
                   'username': user.citi_username
               }, 200

    @ns.doc("绑定花旗银行账户")
    @ns.expect(ns.model("用户名和密码", {
        'username': fields.String(description="用户名"),
        "password": fields.String(description="密码"),
    }))
    @ns.response(201, "绑定成功")
    @ns.response(400, "绑定失败")
    @login_require()
    def post(self, user: User):
        username = ns.payload["username"]
        password = ns.payload["password"]
        try:
            getRealAccessToken(username, password)
            userDao.modify_user_citi_account(user.username, username, password)
            return {}, 201
        except:
            return {}, 400
