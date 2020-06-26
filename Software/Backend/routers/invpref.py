from flask_restplus import Resource, fields, Namespace

from decorator.RoleRequest import login_require
from model.user.User import User

from factory.DaoFactory import userDao

ns = Namespace('user/invpref', description='资产投资偏好管理')

questionnaire_answers = ns.model("问卷答案", {
    "answers": fields.List(fields.Integer, description="问卷答案数组。按问卷问题顺序。数组每一项为答案，以0-5表示ABCDEF。具体算法问李康。",
                           example=[0, 1, 2, 3, 4, 5, 6, 7, 8])
})

investment_preference = ns.model("用户投资偏好", {
    "profit": fields.Float(description="收益率"),
    "fluctuation": fields.Float(description="波动率"),
})


@ns.route('')
@ns.doc("填写问卷，获得建议投资偏好（问卷）")
class InvPrefEvaluation(Resource):
    @ns.doc("获得投资建议偏好")
    @ns.expect(questionnaire_answers)
    @ns.response(200, "获得投资偏好", investment_preference)
    @login_require()
    def post(self, user: User):
        # b_answers = request.json()
        # choices = b_answers['answers']
        choices = ns.payload['answers']

        filter_result = {}
        length = len(choices)
        for choice in choices:
            filter_result[choice] = filter_result.get(choice, 0) + 1

        rate_of_return = filter_result.get(0, 0) * 0.04 + filter_result.get(1, 0) * 0.05 + filter_result.get(
            2, 0) * 0.06 + filter_result.get(3, 0) * 0.08 + filter_result.get(4, 0) * 0.12
        volatility = filter_result.get(0, 0) * 0.005 + filter_result.get(1, 0) * 0.01 + filter_result.get(
            2, 0) * 0.035 + filter_result.get(3, 0) * 0.12 + filter_result.get(4, 0) * 0.30

        result = {'profit': round(rate_of_return / length * 100, 2), 'fluctuation': round(volatility / length * 100, 2)}
        return result, 200


@ns.route('/<username>')
@ns.doc("用户投资偏好管理")
class UserInvPrefManagement(Resource):
    @ns.doc("获得用户投资偏好")
    @ns.response(200, "用户的投资偏好", investment_preference)
    @login_require()
    def get(self, user: User, username: str):
        # 注意，这个方法不是获得user的投资偏好，而是username所指代用户的投资偏好
        result = userDao.get_user_preference(username)
        return {'profit': result[0], 'fluctuation': result[1]}, 200
        pass

    @ns.doc("修改用户投资偏好")
    @ns.expect(investment_preference)
    @ns.response(201, "修改成功")
    @login_require()
    def put(self, user: User, username: str):
        # user和username的关系同上
        profit = ns.payload['profit']
        fluctuation = ns.payload['fluctuation']
        userDao.modify_user_preference(username, float(profit), float(fluctuation))
        # args = request.json()  # 包含和investment_preference这个model相同的数据
        return 'success', 201