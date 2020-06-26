from datetime import datetime

from flask import request
from flask_restplus import Resource, fields, Namespace

from dao.RestDao import RestDao
from decorator.RoleRequest import login_require
from factory.BlFactory import userBl
from model.Enumeration import Mode
from model.user.Role import Role
from model.user.User import User

# 通知可行的运作方式：
# 在后端，每个通知存有这个通知所属用户的id（或者username）
# 每增加一个通知，就增加一项，并设置其用户id
# 查询通知的时候，根据用户名查询此用户的所有通知
# 删除通知的时候，直接删除此行就性

ns = Namespace("notification", description="通知管理")

base_notification = ns.model("所有通知的基类", {
    "id": fields.String(description="通知的ID"),
    "type": fields.String(description="通知的类型。会不断添加。", enum=[
        "PreferenceEvaluation"
        "Others",
    ]),  # 具体含义看下面
    "dateTime": fields.DateTime(description="产生此通知的时间，精确到秒"),
})

# 以下为具体类型的定义，每个具体通知类型都继承（inherit）了base_notification

# 要求用户进行投资偏好测试，在注册之后产生一个这个通知
preference_evaluation_notification = ns.inherit("进行投资偏好测试的通知", base_notification, {
    # 此通知类型的type为PreferenceEvaluation
    "type": fields.String(description="定为PreferenceEvaluation", enum=["PreferenceEvaluation"])
})

# 其他类型的通知
other_notification = ns.inherit("其他类型的通知", base_notification, {
    # 此通知类型的type为Others
    "type": fields.String(description="定为Others", enum=["Others"]),
    "content": fields.String(description="通知内容"),
})

# 以后增加其他类型的通知的时候在这里添加类型定义，并通过type进行区分。

delete_parser = ns.parser()
delete_parser.add_argument('id', type=str, help='需要删除的通知的ID', location='arg')


@ns.route('')
class NotificationManagement(Resource):
    @ns.doc("获得本用户全部通知")
    @ns.response(200, "返回全部通知", [base_notification])
    @login_require()
    def get(self, user: User):
        # print(user)
        noticeArr = RestDao().getAllNotice(user.username)
        ret = []
        for r in noticeArr:
            if r.content == "":
                ret.append({"id": r.id, "type": r.type, "dateTime": str(r.time)})
            else:
                ret.append({"id": r.id, "type": r.type, "dateTime": str(r.time), "content": r.content})
        return ret, 200
        pass

    @ns.doc("删除一个通知")
    @ns.expect(delete_parser)
    @ns.response(200, "删除一个通知")
    @login_require()
    def delete(self, user: User):
        notification_id = request.args['id']
        RestDao().deleteNoticeByID(notification_id)
        return 200
        pass
