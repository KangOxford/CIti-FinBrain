# 剩余没有实现的访问数据库的接口，先把方法写好然后再把它移到其他的包里
from factory.DaoFactory import investDao, stockDao, bondsDao, goodsDao, noticeDao, userDao
from model.invest.Position import Position
from model.invest.ReallowcationRecord import ReallowcationRecord
from model.invest.TransactionRecord import TransactionRecord
from model.invest.InvReqAccountMatchining import InvestRequirementMatchining
from dao.DaoUtil import DaoUtil
from model.Enumeration import Mode, SellMethod
from datetime import datetime


class RestDao(object):

    def __init__(self):
        pass

    # √
    def getAllAccountByUsername(self, username):
        # return [InvestRequirement] searched by username
        # 根据用户名返回用户所有的资产账户
        return investDao.get_account_by_username(username)
        pass

    # √
    def getInvestRequirementByKey(self, invreq_id):
        # return InvestRequirement searched by ID
        # 根据主键查找InvestRequirement
        return investDao.get_one_invest(invreq_id)
        pass

    def getInvestRequirementMatchining(self, invreq_id):
        # return InvestRequirementMatchining searched by ID
        # 根据主键 查找 InvestRequirementMatchining
        return investDao.get_invest_requirement_matchining(invreq_id)
        pass

    def getAllStockTransactionRecord(self, invreq_id):
        # return [StockTransactionRecord] searched by ID
        # 查找所有 交易记录、调仓记录
        return investDao.get_transaction_record(invreq_id)
        pass

    def getAllReallowcationRecord(self, invreq_id):
        # return [ReallowcationRecord]
        # 查找 该账户下 所有的持仓变更记录
        return investDao.get_reallowcation_record(invreq_id)
        pass

    def getReallowcationRecordByDate(self, invrq_id, date):
        #  return ReallowcationRecord
        #  根据 ID 查找单条持仓变更记录
        return investDao.get_reallowcation_record_by_date(invrq_id, date)
        pass

    def generateTransactionRecord(self, invreq_id):
        from bl.allocation.stock.StockBl import StockBl
        # 根据账户ID 比对Advice 和 Position 产生并返回交易记录数组（不存数据库）
        advice_arr = self.getAdivceById(invreq_id)

        position_arr = self.getPositionById(invreq_id)

        matchBefore = self.getInvestRequirementMatchining(invreq_id)

        ret = []  # 交易记录数组
        for r in advice_arr:
            print(r.quantity)
            check = True

            for s in position_arr:
                if r.request_id == s.request_id and r.code == s.code:
                    # 填充逻辑
                    # 这里测试时不添加手续费，目前没有获得手续费的接口
                    check = False
                    if r.quantity > s.quantity:
                        expense = 0.0
                        if r.type == Mode.STOCK:
                            expense = StockBl().cal_expense(r.code, r.quantity - s.quantity,
                                                            r.price * (r.quantity - s.quantity))
                        elif r.type == Mode.GOODS:
                            pass  # TODO
                        elif r.type == Mode.BOND:
                            pass  # TODO

                        # 买入
                        temp = TransactionRecord(r.code, r.price, r.quantity - s.quantity, r.time, expense, r.type,
                                                 invreq_id)
                        temp.is_done = False
                        temp.name = r.name
                        temp.buy_or_sale = SellMethod.BUY
                        if r.type == Mode.STOCK:
                            temp.lastMatching = r.price * r.quantity / (matchBefore.stock + 0.000001)
                        elif r.type == Mode.GOODS:
                            temp.lastMatching = r.price * r.quantity / (matchBefore.goods + 0.000001)
                        elif r.type == Mode.BOND:
                            temp.lastMatching = r.price * r.quantity / (matchBefore.bonds + 0.000001)
                        ret.append(temp)
                        break
                    if r.quantity < s.quantity:
                        expense = 0.0
                        if r.type == Mode.STOCK:
                            expense = StockBl().cal_expense(r.code, r.quantity - s.quantity,
                                                            r.price * (s.quantity - r.quantity))
                        elif r.type == Mode.GOODS:
                            pass  # TODO
                        elif r.type == Mode.BOND:
                            pass  # TODO

                        # 卖出
                        temp = TransactionRecord(r.code, r.price, s.quantity - r.quantity, r.time, expense, r.type,
                                                 invreq_id)
                        temp.is_done = False
                        temp.name = r.name
                        temp.buy_or_sale = SellMethod.SELL
                        ret.append(temp)
                        if r.type == Mode.STOCK:
                            temp.lastMatching = r.price * r.quantity / (matchBefore.stock + 0.000001)
                        elif r.type == Mode.GOODS:
                            temp.lastMatching = r.price * r.quantity / (matchBefore.goods + 0.000001)
                        elif r.type == Mode.BOND:
                            temp.lastMatching = r.price * r.quantity / (matchBefore.bonds + 0.000001)
                        break
                    pass
            if True is check:
                expense = 0.0
                if r.type == Mode.STOCK:
                    expense = StockBl().cal_expense(r.code, r.quantity,
                                                    r.price * r.quantity)
                elif r.type == Mode.GOODS:
                    pass  # TODO
                elif r.type == Mode.BOND:
                    pass  # TODO

                temp = TransactionRecord(r.code, r.price, r.quantity, r.time, expense, r.type, invreq_id)
                if temp.quantity == None:
                    temp.quantity = 0
                temp.lastMatching = 0  # 若该股票是新买的，说明last matching 必然为0
                investDao.modify_advice(r.id)

                temp.buy_or_sale = SellMethod.BUY

                ret.append(temp)

        return ret
        pass

    def generateRecordsAndChange(self, invreq_id):

        from utils.CitiApiUtil import getRealAccessToken, createPurchaseTransfer
        # 根据账户ID 执行当前交易建议
        # 产生交易记录、产生调仓记录、删除Advice、更新Position、更新资产账户中的数据

        # 产生交易记录
        # 存储交易记录
        # 更新Position 同时计算收益、持仓总额。若持仓增加，结算上次收益并调整买入日期和买入量（买入量求和），若持仓减少，则结算上次收益
        # 删除对应条目的Advice
        # 产生并存储调仓记录
        # 更新资产账户中的收益
        # 更新占比

        transactionRecords = self.generateTransactionRecord(invreq_id)
        advice_arr = self.getAdivceById(invreq_id)
        position_arr = self.getPositionById(invreq_id)

        profit = 0.0  # 收益
        goods = 0.0
        bonds = 0.0
        stock = 0.0
        match = self.getInvestRequirementMatchining(invreq_id)
        # 应该不需要删除了，直接更新
        # investDao.delete(match)

        r_record = ReallowcationRecord()
        for s in position_arr:
            if int(s.request_id) == int(invreq_id):
                if s.type == Mode.STOCK:
                    stock = stock + s.quantity * self.getStockPriceByCode(s.code)
                elif s.type == Mode.BOND:
                    bonds = bonds + s.quantity * self.getBondPriceByCode(s.code)
                elif s.type == Mode.GOODS:
                    goods = goods + s.quantity * self.getGoodsPriceByCode(s.code)
        r_record.stock_before = stock
        r_record.goods_before = goods
        r_record.bonds_before = bonds

        goods = 0.0
        bonds = 0.0
        stock = 0.0
        for r in advice_arr:
            check = True
            # if r.request_id is not invreq_id:
            #     continue
            if r.is_done:
                continue  # 该交易已经被取消，不再执行操作
            for s in position_arr:
                # print("进入嵌套子循环")
                if r.code == s.code and r.request_id == s.request_id:
                    check = False
                    investDao.delete(s)
                    investDao.delete(r)
                    # print("应该已经删除")
                    profit = profit + (r.price - s.price) * s.quantity  # 现价减去原价，乘上原数量
                    newPosition = self.copyAdviceToPosition(r)
                    investDao.insert(newPosition)
                    break
            if check:
                # investDao.delete(r)
                # print("check is true")
                newPosition = self.copyAdviceToPosition(r)
                investDao.insert(newPosition)

                pass

        position_arr = self.getPositionById(invreq_id)
        for s in position_arr:
            if int(s.request_id) == int(invreq_id):

                if s.type == Mode.STOCK:

                    stock = stock + s.quantity * self.getStockPriceByCode(s.code)
                elif s.type == Mode.BOND:

                    bonds = bonds + s.quantity * self.getBondPriceByCode(s.code)
                elif s.type == Mode.GOODS:

                    goods = goods + s.quantity * self.getGoodsPriceByCode(s.code)
        r_record.stock_after = stock
        r_record.goods_after = goods
        r_record.bonds_after = bonds

        # TODO 转账失败的异常逻辑
        # if len(self.getAllReallowcationRecord(invreq_id)) == 0:
        #     username = investDao.get_one_invest(invreq_id).username
        #     user = userDao.get_user_by_username(username)
        #     amount = r_record.stock_after + r_record.goods_after + r_record.bonds_after - r_record.stock_before - r_record.goods_before - r_record.bonds_before
        #     access_token = getRealAccessToken(user.citi_username, user.citi_password)
        #     # TODO 绑定一张银行卡
        #     source_account_id = '355a515030616a53576b6a65797359506a634175764a734a3238314e4668627349486a676f7449463949453d'
        #     createPurchaseTransfer(source_account_id, access_token, amount)
        #     pass

        r_record.invreq_id = invreq_id
        r_record.time = datetime.today()

        investDao.modify_invest_state(invreq_id)
        investDao.modify_invest_requirement_matchining(invreq_id, stock, bonds, goods)
        # newMatch = InvestRequirementMatchining(invreq_id)
        #
        # newMatch.stock = stock
        # newMatch.goods = goods
        # newMatch.bonds = bonds
        #
        # investDao.insert(newMatch)
        investDao.insert(r_record)

        print(len(transactionRecords))
        print("下面是交易记录")
        for i in transactionRecords:
            # 计算matching
            if i.type == Mode.GOODS:
                i.matching = (i.price * i.quantity) / (goods + 0.000001)
            elif i.type == Mode.BOND:
                i.matching = (i.price * i.quantity) / (bonds + 0.000001)
            elif i.type == Mode.STOCK:
                i.matching = (i.price * i.quantity) / (stock + 0.000001)
            print()
            investDao.insert(i)

        account = self.getInvestRequirementByKey(invreq_id)

        accu_revenue = profit + account.accu_revenue
        today_revenue = profit + account.today_revenue
        investDao.modify_profit(invreq_id, accu_revenue, today_revenue)

        pass

    def getAdivceById(self, invreq_id):
        # return [Advice]  根据ID 返回该账户下当前Advice 数组
        return investDao.get_advice_by_id(invreq_id)
        pass

    def getPositionById(self, invreq_id):
        # return [position] 根据ID 返回该账户下的Position 数组
        return investDao.get_position(invreq_id)
        pass

    def getStockPriceByCode(self, code):
        # 根据股票代码查询股票单价
        return stockDao.get_stock_price(code)
        pass

    def getBondPriceByCode(self, code):
        # 根据债券代码查询股票单价
        return bondsDao.get_price_by_code(code)
        pass

    def getGoodsPriceByCode(self, code):
        # 根据商品代码查询股票单价
        return goodsDao.get_price_by_code(code)
        pass

    def copyAdviceToPosition(self, advice):
        p = Position(advice.code, advice.price, advice.quantity, advice.time, advice.name)
        p.name = advice.name
        p.type = advice.type
        p.request_id = advice.request_id
        return p

    def getAllNotice(self, username):
        # 获得一个用户所有的通知
        return noticeDao.get_all_notice(username)
        pass

    def deleteNoticeByID(self, id):
        # 根据ID 删除通知
        noticeDao.delete_notice_by_ID(id)
        pass
