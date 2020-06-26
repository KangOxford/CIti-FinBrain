from flask_restplus import Resource, fields, Namespace

from decorator.RoleRequest import login_require
from model.user.User import User

from model.Enumeration import Mode, Level
from factory.DaoFactory import investDao, bondsDao

ns = Namespace('invreq/<invreq_id>/bond', description="债券深度分析")

bond_overview_data = ns.model("债券总体数据", {
    'startDate': fields.String(description="初始日期，格式yy-mm-dd"),
    'currentVolume': fields.Float(description="当前金额"),
    'currentRatio': fields.Float(description="当前债券占整个配置的百分比:百分数"),
    'profit': fields.Float(description="收益 ？金额or百分数"),  # Y
    'duration': fields.Float(description="久期"),  # N
    'name': fields.String(description="债券标的名字"),  # Y
    'quotationId': fields.String(description="债券标的ID"),  # Y
    'quantity': fields.String(description="数量"),  # Y
    'price': fields.String(description="单价"),  # Y
})


@ns.route('')
@ns.param("invreq_id", "资产账户ID")
class GetBondOverviewData(Resource):
    @ns.doc("得到账户债券总览信息数据")
    @ns.response(200, "账户债券信息总览", ns.model("两种债券的数据", {
        "creditOverview": fields.Nested(bond_overview_data, description="信用债"),
        "rateOverview": fields.Nested(bond_overview_data, description="利率债"),
    }))
    @login_require()
    def get(self, user: User, invreq_id: str):
        rate_bonds = bondsDao.get_interest_bonds()
        rate_bonds_names = [rows[0] for rows in rate_bonds]
        credit_bonds = bondsDao.get_credit_debt()
        credit_bonds_names = [rows[0] for rows in credit_bonds]

        all_position = investDao.get_position(invreq_id)
        invest = investDao.get_one_invest(invreq_id)
        start_date = str(invest.start_date).split(' ')[0]
        amount = invest.amount

        bonds_position = []

        for one in all_position:
            if one.type == Mode.BOND:
                bonds_position.append(one)

        if len(bonds_position) == 0:
            return None, 200
        else:
            model = []
            for i in range(2):
                quantity = bonds_position[i].quantity
                price = bonds_position[i].price
                name = bonds_position[i].name
                code = bonds_position[i].code
                total_price = bondsDao.get_price_by_code(code) * quantity
                profit = total_price - price * quantity

                model.append({'startDate': start_date,
                              'currentVolume': total_price,
                              'currentRatio': round(price * quantity / amount * 100, 0),
                              'profit': profit,
                              # 'duration': 0,  # todo
                              'name': name,
                              'quotationId': code,
                              'quantity': quantity,
                              'price': price})
            if bondsDao.get_class(bonds_position[0].code) == '国债':
                index_rate = rate_bonds_names.index(model[0].get('quotationId', ''))
                model[0]['duration'] = rate_bonds[index_rate][5]

                index_credit = credit_bonds_names.index(model[1].get('quotationId', ''))
                model[1]['duration'] = credit_bonds[index_credit][8]

                return {"creditOverview": model[1],
                        "rateOverview": model[0]}, 200
            else:
                index_rate = rate_bonds_names.index(model[1].get('quotationId', ''))
                model[1]['duration'] = rate_bonds[index_rate][5]

                index_credit = credit_bonds_names.index(model[0].get('quotationId', ''))
                model[0]['duration'] = credit_bonds[index_credit][8]

                return {"creditOverview": model[0],
                        "rateOverview": model[1]}, 200


predict_value = ns.model("估价数据", {
    'date': fields.String(description="初始日期，格式yy-mm-dd"),
    'predictValue': fields.Float(description="估价"),
})

risk_indicator = ns.model("信用债风险指标数据", {
    'season': fields.String(description=" 季度 格式：2017Q1"),
    'fixedDuration': fields.Float(description="修正久期"),
    'liability': fields.Float(description="资产负债率：百分数?"),
    'cashFlow': fields.Float(description="现金流量比率：百分数?"),
    'creditRate': fields.String(description="信用评级 格式：A+？ 你们定"),
})

duration = ns.model("利率债 久期列表展示", {
    'season': fields.String(description=" 季度 格式：2017Q1"),
    'fixedDuration': fields.Float(description="修正久期"),
})


@ns.route('/credit')
@ns.param("invreq_id", "资产账户ID")
class CreditBondData(Resource):
    @ns.doc("得到信用债的深度分析数据")
    @ns.response(200, "信用债深度分析数据", ns.model("信用债深度分析数据", {
        "predictValue": fields.List(fields.Nested(predict_value), description="信用债估价图"),
        "riskIndicator": fields.List(fields.Nested(risk_indicator), description="信用债风险指标表"),
    }))
    @login_require()
    def get(self, user: User, invreq_id: str):
        all_position = investDao.get_position(invreq_id)
        bonds_position = []

        for one in all_position:
            if one.type == Mode.BOND:
                bonds_position.append(one)

        classify = []
        if len(bonds_position) == 0:
            return None, 200
        else:
            for i in range(2):
                bonds_code = bonds_position[i].code
                classname = bondsDao.get_class(bonds_code)
                classify.append({'code': bonds_code, 'classname': classname})

            target_code = ''
            for d in classify:
                if d['classname'] == '信用债':
                    target_code = d['code']

            predict_value_result = bondsDao.get_credit_quarter_data(Level.SIMPLE, target_code)

            risk_indicator_result = bondsDao.get_credit_quarter_data(Level.HARD, target_code)

            return {'predictValue': predict_value_result,
                    'riskIndicator': risk_indicator_result}, 200


@ns.route('/rate')
@ns.param("invreq_id", "资产账户ID")
class RateBondData(Resource):
    @ns.doc("得到利率债的深度分析数据")
    @ns.response(200, "利率债深度分析数据", ns.model("利率债深度分析数据", {
        "predictValue": fields.List(fields.Nested(predict_value), description="利率债估价图"),
        "duration": fields.List(fields.Nested(duration), description="久期图"),
    }))
    @login_require()
    def get(self, user: User, invreq_id: str):
        all_position = investDao.get_position(invreq_id)
        bonds_position = []

        for one in all_position:
            if one.type == Mode.BOND:
                bonds_position.append(one)

        classify = []
        if len(bonds_position) == 0:
            return None, 200
        else:
            for i in range(2):
                bonds_code = bonds_position[i].code
                classname = bondsDao.get_class(bonds_code)
                classify.append({'code': bonds_code, 'classname': classname})

            target_code = ''
            for d in classify:
                if d['classname'] == '国债':
                    target_code = d['code']

            predict_value_result = bondsDao.get_interest_quarter_data(Level.SIMPLE, target_code)
            duration_result = bondsDao.get_interest_quarter_data(Level.HARD, target_code)

            return {'predictValue': predict_value_result,
                    'duration': duration_result}, 200
