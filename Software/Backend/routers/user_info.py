from flask import request
from flask_restplus import Resource, Namespace, fields
from decorator.RoleRequest import login_require

from model.user.User import User

ns = Namespace('user/info', description='关于用户信息')

user_profile = ns.model("用户信息", {
    "username": fields.String(description="用户名"),
    "email": fields.String(description="电子邮箱"),
    "registerDate": fields.DateTime(description="注册时间"),
    "avatarUrl": fields.String(description="头像地址")
})

@ns.route('')
@ns.response(200, 'OK')
@ns.response(404, 'user not found')
@ns.response(403, 'access denied')
@ns.response(500, 'system error')
class User(Resource):

    @ns.doc("获得用户信息")
    @ns.response(200, "获得用户信息", user_profile)
    @login_require()
    def get(self, user: User):

        return {
            'username': user.username,
            'email': user.email,
            'registerDate': str(user.register_time),
            'avatarUrl': ""
        }, 200


    @ns.doc('修改')
    @ns.expect(user_profile)
    @ns.response(200, "修改成功" )
    def put(self, user: User):
        args = request.json()
        # return userBl.check_user(UserModel(username, password)), 200, {}
        return 123