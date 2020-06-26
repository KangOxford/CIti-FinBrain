from flask_restplus import Resource, fields, Namespace
from datetime import date

from bl.allocation.stock.StockBl import StockBl
from decorator.RoleRequest import login_require
from factory.BlFactory import globalAllocationBl
from factory.DaoFactory import investDao, profitDao, userDao, stockDao, goodsDao, bondsDao
from model.Enumeration import State, Mode
from model.user.User import User
from dao.RestDao import RestDao
from model.invest.InvestRequirement import InvestRequirement
from model.invest.InvReqAccountMatchining import InvestRequirementMatchining
from model.notice.Notice import Notice

from utils.EnumTrans import EnumTrans

ns = Namespace('invreq', description='资产账户管理')

invreq_account = ns.model("资产账户", {
    'invreqId': fields.String(description="资产账户ID"),
    'bought': fields.Boolean(description="是否已经买入"),
    'recommended': fields.Boolean(description="是否是系统推荐的账户"),
})

# 初始化资金账户的需求
invreq_init = ns.model("初始化资金账户的需求", {
    'profit': fields.Float(description="收益率"),
    'fluctuation': fields.Float(description="波动率"),
    'amount': fields.Float(description="金额"),
    'year': fields.Float(description="年限"),
})


# √
@ns.route('')
class InvReqAccounts(Resource):
    @ns.doc('得到用户所有的资产账户')
    @ns.response(200, "获得所有资产账户", [invreq_account])
    @login_require()
    def get(self, user: User):
        accounts = RestDao().getAllAccountByUsername(user.username)
        ret = []
        for account in accounts:
            b = True
            if account.is_bought != State.BUY:
                b = False
            dict_temp = {'invreqId': account.id, 'bought': b}
            ret.append(dict_temp)
        ret[0]['recommended'] = True
        return ret, 200

    @ns.doc("提交新需求")
    @ns.expect(invreq_init)
    @ns.response(201, "提交成功", ns.model("提交新需求的返回值", {
        "invreqId": fields.String(description="新需求的ID")
    }))
    @login_require()
    def post(self, user: User):

        profit = float(ns.payload['profit']) / 100
        risk = float(ns.payload['fluctuation']) / 100
        amount = ns.payload['amount']
        year = ns.payload['year']

        allocation = globalAllocationBl.get_allocation(profit, risk, amount, year, False)

        # 年预期风险
        predict_risk = round(allocation[0], 2)
        predict_revenue = round(allocation[1], 2)
        account = InvestRequirement(profit, risk, amount, year, user.username, predict_revenue, predict_risk)

        investDao.insert(account)

        invest_id = investDao.get_latest_invest_id()
        investDao.insert(InvestRequirementMatchining(invest_id))
        # investDao.insert(InvestRequirementMatchining(invest_id))

        advices = allocation[2]
        for advice in advices:
            advice.request_id = invest_id
            investDao.insert(advice)

        investDao.insert(Notice('尊敬的用户：您已创建一个新的资产账户，请尽确认交易', user.username, 'Others'))
        return {'invreqId': invest_id}, 201


# √
@ns.route('/<invreq_id>')
@ns.param("invreq_id", "资产账户ID")
class InvReqAccount(Resource):
    @ns.doc("得到某个资产账户的信息")
    @ns.response(200, "获得资产账户ID的信息", invreq_account)
    @ns.response(403, "登录用户非资产账户拥有者")
    @login_require()
    def get(self, user: User, invreq_id: str):
        account = RestDao().getInvestRequirementByKey(invreq_id)

        if account.is_bought == State.CONSIDERATION:
            ret = {"invreqId": invreq_id, "bought": False}
        else:
            ret = {"invreqId": invreq_id, "bought": True}
        return ret, 200

    @ns.doc("赎回（取消）此资产账户")
    @ns.response(200, "删除成功")
    @login_require()
    def delete(self, user: User, invreq_id: str):
        from utils.CitiApiUtil import createRedeemTransfer
        from model.Enumeration import Mode
        from bl.allocation.stock.StockBl import StockBl

        import config
        account = RestDao().getInvestRequirementByKey(invreq_id)
        position = investDao.get_position(invreq_id)
        expense = 0.0
        total_amount = 0.0
        for p in position:
            if p.type == Mode.STOCK:
                t = p.quantity * stockDao.get_stock_price(p.code)
                e = StockBl().cal_expense(p.code, -p.quantity, p.quantity * stockDao.get_stock_price(p.code))
                total_amount += t
                expense += e
            elif p.type == Mode.BOND:
                t = p.quantity * bondsDao.get_price_by_code(p.code)
                total_amount += t
            elif p.type == Mode.GOODS:
                t = p.quantity * goodsDao.get_price_by_code(p.code)
                total_amount += t
        amount = total_amount - expense
        createRedeemTransfer(amount, config.system_payee_id)
        print('redeem amount: ' + str(amount))
        investDao.delete(account)  # 直接在数据库中删除对应的资产账户
        return 200
        pass


# √
@ns.route('/<invreq_id>/overview')
@ns.param("invreq_id", "资产账户ID")
class InvReqAccountOverview(Resource):
    @ns.doc("得到账户总览信息数据")
    @ns.response(200, "账户信息总览", ns.model("账户信息总览", {
        "accuRevenue": fields.Float(description="累计收益，百分率，95%输出95，下同"),
        "predRorYear": fields.Float(description="预计年化收益，百分率"),
        "todayRevenue": fields.Float(description="今日收益，百分率"),
        "startDate": fields.String(description="开始时间，日期格式Year-Month-Day，例如2018-9-3"),
        "startVolume": fields.Float(description="初始资金")
    }))
    @login_require()
    def get(self, user: User, invreq_id: str):
        account = RestDao().getInvestRequirementByKey(invreq_id)
        dict_return = {"accuRevenue": account.accu_revenue, "predRorYear": account.pred_revenue_year*100,
                       "todayRevenue": account.today_revenue, "startDate": str(account.start_date).split(' ')[0],
                       "startVolume": account.amount}
        return dict_return, 200
        pass


# 配比对象
matching_detail = ns.model("配比信息", {
    "quotaId": fields.String(description="标的代码"),
    "quotaName": fields.String(description="标的名称"),
    "totalValue": fields.Float(description="总价值"),
    "percentage": fields.Float(description="占比，百分率，95%输出95"),
    "type": fields.String(description="交易类型", enum=["STOCK", "BOND", "GOODS"])
})


# √
@ns.route('/<invreq_id>/matchings/detail')
@ns.param("invreq_id", "资产账户ID")
class InvReqAccountMatchining(Resource):
    @ns.doc("得到投资需求中股票、债券、商品市场的配比详情")
    @ns.response(200, "股票、债券、商品市场的配比详情", [matching_detail])
    @login_require()
    def get(self, user: User, invreq_id: str):
        position = investDao.get_position(invreq_id)
        match = RestDao().getInvestRequirementMatchining(invreq_id)
        result = []
        for p in position:
            percentage = 0.0
            if p.type == Mode.STOCK:
                percentage = round(p.price * p.quantity / (match.stock + 0.000000001) * 100, 2)
            elif p.type == Mode.BOND:
                percentage = round(p.price * p.quantity / (match.bonds + 0.000000001) * 100, 2)
            else:
                percentage = round(p.price * p.quantity / (match.goods + 0.000000001) * 100, 2)
            matching_d = {
                "quotaId": p.code,
                "quotaName": p.name,
                "totalValue": p.price * p.quantity,
                "percentage": percentage,
                "type": EnumTrans.trans_mode(p.type),
            }
            result.append(matching_d)

        return result, 200
        pass


matching = ns.model("配比简略信息", {
    "stockMatching": fields.Float(description="股票占比"),
    "bondMatching": fields.Float(description="债券占比"),
    "productionMatching": fields.Float(description="商品占比")
})


@ns.route('/<invreq_id>/matchings')
class InvReqMatchingOverview(Resource):
    @ns.doc("得到需求中股票、债券、商品市场的配比简略信息")
    @ns.response(200, "配比简略信息", matching)
    @login_require()
    def get(self, user: User, invreq_id: str):
        # 这个方法需要调用整体的计算配比的方法，不是直接访问数据库的方法
        match = RestDao().getInvestRequirementMatchining(invreq_id)
        sum = float(match.stock + match.bonds + match.goods) + 0.000001  # 防止除零错误
        dist_return = {"stockMatching": round(100 * match.stock / sum, 2),
                       "bondMatching": round(100 * match.bonds / sum, 2),
                       "productionMatching": round(100 * match.goods / sum, 2)}
        return dist_return, 200


# 交易相关的model

transaction_detail = ns.model("交易详情", {
    "time": fields.DateTime(description="此交易发生的时间，需要精确到秒"),
    "type": fields.String(description="交易种类，分为股票（STOCK），债券（BOND）和商品（PRODUCT）", enum=["STOCK", "BOND", "PRODUCT"]),
    "quotaId": fields.String(descriptiopn="标的代码"),
    "quotaName": fields.String(description="标的名称"),
    "buyOrSale": fields.String(description="买还是卖？", enum=["SALE", "BUY"]),
    "quantity": fields.Float(description="成交量"),
    "price": fields.Float(description="成交价"),
    "totalPrice": fields.Float(description="总交易额"),
    "matching": fields.Float(description="此产品占此次交易的占比，百分比，95%分为95"),
    "lastMatching": fields.Float(description="上一次交易的占比，百分比，95%分为95"),
})

daily_transaction = ns.model("交易记录", {
    "time": fields.Date(description="此交易发生的日期，精确到日"),
    "children": fields.List(fields.Nested(transaction_detail), description="交易详情列表")
})


# √
@ns.route('/<invreq_id>/transactions')
@ns.param("invreq_id", "资产账户ID")
class InvReqTransactionLog(Resource):
    @ns.doc("得到投资需求的交易记录")
    @ns.response(200, "交易记录列表", [daily_transaction])
    @login_require()
    def get(self, user: User, invreq_id: str):
        record_list = RestDao().getAllStockTransactionRecord(invreq_id)

        ret_array = []
        for r in record_list:
            temp_dict = {
                "time": str(r.time).split('.')[0],
                "type": EnumTrans.trans_mode(r.type),
                "quotaId": r.quota_id,
                "quotaName": r.quota_name,
                "buyOrSale": EnumTrans.get_sell_method(r.buy_or_sale),
                "quantity": r.quantity,
                "price": r.price,
                "totalPrice": r.quantity * r.price,
                "matching": r.matching,
                "lastMatching": r.lastMatching,
            }
            # 需要跟前端说明一下，这里有的数据是不能要
            ret_array.append(temp_dict)

        return ret_array, 200
        pass


daily_transaction_parser = ns.parser()
daily_transaction_parser.add_argument("tranId", type=str, location='args')


# √
@ns.route('/<invreq_id>/dailyTransactions')
@ns.param("invreq_id", "资产账户ID")
class InvReqDailyTransaction(Resource):
    @ns.doc("根据资产配置id及交易ID得到交易记录（用于调仓界面查看详细交易记录）")
    @ns.expect(daily_transaction_parser)
    @ns.response(200, "交易列表", [transaction_detail])
    @login_require()
    def get(self, user: User, invreq_id: str):
        args = daily_transaction_parser.parse_args()
        # tran_id = args['tranId']
        record_list = RestDao().getAllStockTransactionRecord(invreq_id)
        # print(len(recordList))
        record_time_list = []
        for r in record_list:
            record_time_list.append(str(r.time).split(" ")[0])
        time_set = list((set(record_time_list)))
        ret_array = []
        for t in time_set:

            record_time_array = []
            for r in record_list:

                if str(r.time).split(" ")[0] == t:
                    temp_dict = {
                        "time": str(r.time).split(' ')[1].split('.')[0],
                        "type": EnumTrans.trans_mode(r.type),
                        "quotaId": r.quota_id,
                        "quotaName": r.quota_name,
                        "buyOrSale": EnumTrans.get_sell_method(r.buy_or_sale),
                        "quantity": r.quantity,
                        "price": r.price,
                        "totalPrice": r.quantity * r.price,
                        "matching": r.matching,
                        "lastMatching": r.lastMatching,
                    }
                    # 需要跟前端说明一下，这里有的数据是不能要的
                    # tranList.append(temp_dict)
                    record_time_array.append(temp_dict)  # 这一步存疑
            record_dist = {"time": str(t), "children": record_time_array}
            ret_array.append(record_dist)
        return ret_array, 200
        pass


reallocation_detail = ns.model("调仓记录", {
    'tranDate': fields.Date(description="交易日期，精确到天"),
    'perOfStock': fields.Float(description="股票投资比例，百分比，95%为95"),
    'changeOfStock': fields.Float(description="相较于上一次交易日期，股票投资比例的变化：百分数"),
    'perOfBond': fields.Float(description="债券投资比例，百分比，95%为95"),
    'changeOfBond': fields.Float(description="相较于上一次交易日期，债券投资比例的变化：百分数"),
    'perOfProduct': fields.Float(description="商品市场投资比例，百分比，95%为95"),
    'changeOfProduct': fields.Float(description="相较于上一次交易日期，商品市场投资比例的变化：百分数"),
})


@ns.route('/<invreq_id>/position/reallocation')
@ns.param("invreq_id", "资产账户ID")
class InvReqReallocationLog(Resource):
    @ns.doc("根据投资需求id得到所有调仓的记录")
    @ns.response(200, "每次调仓的配资比例列表", [reallocation_detail])
    @login_require()
    def get(self, user: User, invreq_id: str):
        records = RestDao().getAllReallowcationRecord(invreq_id)
        ret = []
        for r in records:
            sum_before = float(r.stock_before + r.bonds_before + r.goods_before) + 0.000001  # 防止除零
            sum_after = float(r.stock_after + r.bonds_after + r.goods_after) + 0.000001
            a1 = 100 * float(r.stock_before) / sum_before
            b1 = 100 * float(r.bonds_before) / sum_before
            c1 = 100 * float(r.goods_before) / sum_before
            a2 = 100 * float(r.stock_after) / sum_after
            b2 = 100 * float(r.bonds_after) / sum_after
            c2 = 100 * float(r.goods_after) / sum_after
            ret.append(
                {'tranDate': str(r.time).split(' ')[0], 'perOfStock': round(a2, 2), 'changeOfStock': round(a2 - a1, 2),
                 'perOfBond': round(b2, 2), 'changeOfBond': round(b2 - b1, 2), 'perOfProduct': round(c2, 2),
                 'changeOfProduct': round(c2 - c1, 2)})
        return ret, 200
        pass


@ns.route('/<invreq_id>/position/reallocation/<date>')
@ns.param("invreq_id", "资产账户ID")
@ns.param("date", "日期")
class InvReqReallocationLogSpecific(Resource):
    @ns.doc("根据日期得到一天的调仓记录")
    @ns.response(200, "调仓记录", reallocation_detail)
    @login_require()
    def get(self, user: User, invreq_id: str, date: str):
        record = RestDao().getReallowcationRecordByDate(invreq_id, date)
        return record, 200
        pass


bought_tran_setting = ns.model("已购入账户的交易设置", {
    'planTranTime': fields.Integer(description="计划交易时间，范围为0-23，时间为时，默认为0"),
    'planRemindTime': fields.Integer(description="在计划时间前多少小时通知有交易：范围为0-24,单位为小时，默认为1小时"),
    'minConfirmedPrice': fields.Float(description="需要手动确认的最小金额，单位为元，默认为3000.0元"),
    'confirmTime': fields.Integer(description="有效的确认时间，若在提醒后的这个时间内未确认交易，执行默认操作：范围为0-96，单位为小时，默认为1小时"),
    'defaultConfirm': fields.Boolean(description="默认操作是否为确认交易")
})


# √
@ns.route('/<invreq_id>/settings')
@ns.param("invreq_id", "资产账户ID")
class InvReqBoughtSetting(Resource):
    @ns.doc("得到当前投资需求的交易设置")
    @ns.response(200, "交易设置数据", bought_tran_setting)
    @login_require()
    def get(self, user: User, invreq_id: str):
        account = RestDao().getInvestRequirementByKey(invreq_id);
        distReturn = {'planTranTime': account.plan_tran_time, 'planRemindTime': account.plan_remind_time,
                      'minConfirmedPrice': account.min_confirmed_price, 'confirmTime': account.confirm_time,
                      'defaultConfirm': account.defaultConfirm}
        return distReturn, 200
        pass

    @ns.doc("提交一次更改后的交易设置信息")
    @ns.expect(bought_tran_setting)
    @ns.response(201, "交易设置设置成功")
    @login_require()
    def put(self, user: User, invreq_id: str):
        investDao.set_transaction_option(ns.payload['planTranTime'], ns.payload['planRemindTime'],
                                         ns.payload['minConfirmedPrice'], ns.payload['confirmTime'],
                                         ns.payload['defaultConfirm'], invreq_id)
        return '交易设置设置成功', 201
        pass


plan_transaction = ns.model("计划交易", {
    'tranId': fields.String(description="交易ID"),
    'tranVolume': fields.String(description="计划交易额"),
    "tranDate": fields.Date(description="交易时间，精确到日"),
    'tranList': fields.List(fields.Nested(transaction_detail), description="交易记录")
})

transaction_parser = ns.parser()
transaction_parser.add_argument("tranId", type=str, help="交易ID")


# √
@ns.route("/<invreq_id>/plannedTransactions")
@ns.param("invreq_id", "资产账户ID")
class InvReqPlannedTransactions(Resource):
    @ns.doc("得到计划交易的信息。前端将连续发起此请求，若为None则为无计划交易。")
    @ns.response(200, "计划交易的信息", plan_transaction)
    @login_require()
    def get(self, user: User, invreq_id: str):
        # 根据ID 获取所有满足条件的Advice
        records = RestDao().generateTransactionRecord(invreq_id)

        sum = 0.0
        date = ""
        if len(records) > 0:
            date = records[0].time

        for r in records:
            sum = sum + r.price * r.quantity

        id = invreq_id + str(date)

        tran_list = []
        for i in records:
            print(str(i.type))
            print(str(i.buy_or_sale))
            temp_dict = {
                "time": str(i.time),
                "type": str(i.type).split('.')[1],
                "quotaId": i.quota_id,
                "quotaName": i.quota_name,
                "buyOrSale": str(i.buy_or_sale).split('.')[1],
                "quantity": round(i.quantity, 2),
                "price": i.price,
                "totalPrice": round(i.quantity * i.price, 2),
                "matching": i.matching,
                "lastMatching": i.lastMatching,
            }
            # 需要跟前端说明一下，这里有的数据是不能要的
            tran_list.append(temp_dict)
            # print(temp_dict)

        ret = {'tranId': id, 'tranVolume': sum, "tranDate": str(date).split('.')[0], 'tranList': tran_list}
        return ret, 200

        pass

    @ns.doc("确认进行计划交易")
    # @ns.expect(transaction_parser)
    @ns.response(201, "交易确认")
    @login_require()
    def post(self, user: User, invreq_id: str):
        # 都拿invreq id 来拿，废弃掉tran id
        # args = transaction_parser.parse_args()
        # tran_id = args["tranId"]
        RestDao().generateRecordsAndChange(invreq_id)
        return '交易确认', 201
        pass

    @ns.doc("取消计划交易")
    # @ns.expect(transaction_parser)
    @ns.response(200, "取消交易成功")
    @login_require()
    def delete(self, user: User, invreq_id: str):
        # args = transaction_parser.parse_args()
        # tran_id = args["tranId"]
        advice_arr = RestDao().getAdivceById(invreq_id)
        for adv in advice_arr:
            investDao.delete(adv)
            adv.is_done = True
            investDao.insert(adv)
        return "取消交易成功", 200

        pass


earning = ns.model("收益", {
    'date': fields.Date(description="日期。精确到日"),
    "straEarning": fields.Float(description="策略收益，百分数，95%为95"),
    "baseEarning": fields.Float(description="基准收益，百分数。")
})


# √
@ns.route("/<invreq_id>/earnings")
@ns.param("invreq_id", "资产账户ID")
class InvReqEarnings(Resource):
    @ns.doc("得到收益列表")
    @ns.response(200, "收益列表", [earning])
    @login_require()
    def get(self, user: User, invreq_id: str):
        invest = investDao.get_one_invest(invreq_id)
        amount = invest.amount
        pred_revenue_year = invest.pred_revenue_year
        revenue = pred_revenue_year
        profits = profitDao.get_profits(invreq_id)
        result = []
        if len(profits) == 0:
            temp = {'date': str(date.today()).split(' ')[0], 'straEarning': 0,
                    'baseEarning': revenue*100}
            result.append(temp)
        else:
            for profit in profits:
                temp = {'date': str(profit.date).split(' ')[0], 'straEarning': profit.profit_rate * amount,
                        'baseEarning': revenue*100}
                result.append(temp)

        return result, 200
        pass


daily_position = ns.model("每日持仓", {
    'quotaId': fields.String(description="标的代码"),
    'quotaName': fields.String(description="标的名称"),
    'currentValue': fields.Float(description="当前价"),
    'quantity': fields.Integer(description="持有量"),
    'totalValue': fields.Float(description="总额"),
    'profitAndLoss': fields.Float(description="盈亏（相对于初始金额），盈利为正数，亏损为负数"),
    'serviceCharge': fields.Float(description="手续费用"),
})


@ns.route("/<invreq_id>/position/dailyPosition")
@ns.param("invreq_id", "资产账户ID")
class InvReqDailyPosition(Resource):
    @ns.doc("得到每日持仓列表，需要每日更新")
    @ns.response(200, "每日持仓列表", [daily_position])
    @login_require()
    def get(self, user: User, invreq_id: str):
        from model.Enumeration import Mode
        result = []
        position = investDao.get_position(invreq_id)
        for posi in position:
            type = posi.type
            code = posi.code
            name = posi.name
            quantity = posi.quantity
            price = posi.price

            if type == Mode.BOND:
                current_price = bondsDao.get_price_by_code(code)
            else:
                current_price = stockDao.get_stock_price(code)

            expense = 0.0
            if type == Mode.STOCK:
                expense = StockBl().cal_expense(code, quantity, price * quantity)
            elif type == Mode.GOODS:
                pass  # TODO
            elif type == Mode.BOND:
                pass  # TODO
            result.append({'quotaId': code,
                           'quotaName': name,
                           'currentValue': price,
                           'quantity': quantity,
                           'totalValue': price * quantity,
                           'profitAndLoss': current_price * quantity - price * quantity,
                           'serviceCharge': expense})

        return result, 200
        pass
