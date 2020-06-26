import traceback

from dao.invest.InvestDao import InvestDao
from model.invest.InvestRequirement import InvestRequirement
from model.invest.Profit import Profit
import numpy as np

from run import db
import exceptions


class ProfitDao(object):
    def __init__(self):
        self.investDao = InvestDao()
        pass

    def get_profits(self, invreq_id):
        # 查询数据库，根据数据库，查询账户为invreq_id 的所有 profit
        try:
            session = db.session()
            profits = session.query(Profit).filter(Profit.invreq_id == invreq_id).all()
            return profits
            # profit = Profit(profit)
            # session.add(profit)
            # session.commit()
        except exceptions:
            print('error')
        finally:
            session.close()
        pass

    def get_today_profit(self, invreq_id, date):
        profits = self.get_profits(invreq_id)
        for profit in profits:
            if profit.date == date:
                return profit.profit_rate

        pass

    def insert_today_profit(self, invreq_id):
        # 计算今日收益率并插入数据库
        profit = self.investDao.get_one_invest(invreq_id).today_revenue
        match = self.investDao.get_invest_requirement_matchining(invreq_id)
        # profit = RestDao.getInvestRequirementByKey(invreq_id);
        # match = RestDao.getInvestRequirementMatchining(invreq_id);
        sum = match.stock + match.goods + match.bonds
        today_profit = profit / (sum + 0.000001)

        profit_object = Profit(today_profit, invreq_id)

        try:
            session = db.session()
            session.add(profit_object)
            session.commit()
        except exceptions:
            print('error')
        finally:
            session.close()
        pass


    '''
    计算7天收益率，并写进数据库，同时应该要加7天波动率
    '''
    def calc_weekly_profit_and_risk(self, invreq_id):
        profits = self.get_profits(invreq_id)
        if len(profits) < 7:
            return 0
        else:
            sum = 0.0
            max = 0.0
            sum_l = profits[-7:]
            seven_risk = np.ndarray(sum_l).std()


            for i in profits:
                if i.id >= max:
                    max = i.id
            for i in profits:
                if i.id >= max - 6:
                    sum = sum + i.profit_rate

            try:
                session = db.session()
                invest = session.query(InvestRequirement).filter(InvestRequirement.id == invreq_id)[0]
                if not invest:
                    pass
                else:
                    invest.seven_risk = seven_risk
                    invest.seven_revenue = sum / 7.0

                session.commit()

            except:
                print("error")
                traceback.print_exc()
            finally:
                session.close()


        pass
