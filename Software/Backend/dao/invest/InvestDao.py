# -*- coding: utf-8 -*-
import traceback

from model.invest.InvestRequirement import InvestRequirement
from model.invest.InvReqAccountMatchining import InvestRequirementMatchining
from model.invest.StockPosition import StockPosition
from model.invest.StockAdvice import StockAdvice
from model.invest.Advice import Advice
from model.invest.TransactionRecord import TransactionRecord
from model.invest.Position import Position
from model.invest.ReallowcationRecord import ReallowcationRecord
from model.vo.StockStrategy import StockStrategy
from model.vo.StockPortfolio import StockPortfolio
from model.vo.StockTransactionsAdvice import StockTransactionsAdvice

from dao.DaoUtil import DaoUtil

from exceptions.SQLException import NotFoundException
from run import db

from model.Enumeration import State, Mode


class InvestDao(DaoUtil):
    def __init__(self):

        pass

    '''
    得到该用户创建的最新资产账户
    '''

    def get_latest_invest_id(self):
        try:
            accounts = self.get_all_invest()
            return len(accounts)
        except:
            return 1
        pass

    def get_all_invest(self):
        try:
            session = db.session()
            history = session.query(InvestRequirement).all()
            return history
        except:
            print("error")
            traceback.print_exc()
        finally:
            session.close()
        pass

    '''
    根据id得到某个具体的资产策略（包括需求和交易历史）
    '''

    def get_one_invest(self, id):
        try:
            session = db.session()
            invest = session.query(InvestRequirement).filter(InvestRequirement.id == id)[0]
            if not invest:
                return NotFoundException
            return invest

        except:
            print("error")
            traceback.print_exc()
        finally:
            session.close()
        pass

    '''
    修改资产状态
    '''

    def modify_invest_state(self, req_id):
        try:
            session = db.session()
            invest = session.query(InvestRequirement).filter(InvestRequirement.id == req_id)[0]
            if not invest:
                return []
            invest.is_bought = State.BUY
            session.commit()

        except:
            print("error")
            traceback.print_exc()
        finally:
            session.close()
        pass

    '''
    根据username得到某个具体的资产策略（包括需求和交易历史）
    '''

    def get_account_by_username(self, username):
        try:
            session = db.session()
            invest = session.query(InvestRequirement).filter(InvestRequirement.username == username).all()

            if not invest:
                return []
            return invest
        except:
            print("error")
            traceback.print_exc()
        finally:
            session.close()
        pass

    def get_stock_position(self, req_id):
        try:
            session = db.session()
            position = session.query(Position).filter(Position.request_id == req_id).filter(
                Position.type == Mode.STOCK).all()

            code = []
            quantity = []

            for i in range(len(position)):
                code.append(position[i].code)
                quantity.append(position[i].quantity)

            return code, quantity

        finally:
            session.close()

        pass

    '''
    修改收益
    '''

    def modify_profit(self, invreq_id, accu_revenue, today_revenue):
        try:
            session = db.session()
            invest = session.query(InvestRequirement).filter(InvestRequirement.id == invreq_id).all()[0]

            if not invest:
                return
            else:
                invest.accu_revenue = accu_revenue
                invest.today_revenue = today_revenue
                session.commit()
        except:
            print("error")
            traceback.print_exc()
        finally:
            session.close()

    def get_stock_asset_allocation(self, invreq_id):

        try:
            session = db.session()
            advices = session.query(StockAdvice).filter(StockAdvice.request_id == invreq_id).all()
            strategy = {}
            for advice in advices:
                strategy[advice.code] = advice.quantity
            strategy = StockStrategy(strategy)

            positions = session.query(StockPosition).filter(StockPosition.request_id == invreq_id).all()
            portfolio = StockPortfolio(positions)

            return strategy, portfolio

        finally:
            session.close()

    def save_stock_asset_allocation(self, invreq_id, strategy: StockStrategy,
                                    portfolio: StockPortfolio, transactions_advice: StockTransactionsAdvice):

        try:
            session = db.session()
            session.query(StockAdvice).filter(StockAdvice.request_id == invreq_id).delete()
            for code, quantity in strategy.strategy.items():
                session.add(StockAdvice(code, quantity, invreq_id))

            session.query(StockPosition).filter(StockPosition.request_id == invreq_id).delete()
            for position in portfolio.portfolio:
                position.request_id = invreq_id
                session.add(position)

            for record in transactions_advice.transactions:
                record.request_id = invreq_id
                session.add(record)

            session.commit()
            session.close()
        except:
            print("error")
            traceback.print_exc()

        finally:
            session.close()

    '''
    根据资产账户id得到各项资产配比
    '''

    def get_invest_requirement_matchining(self, invreq_id):
        try:
            session = db.session()
            invest_requirement_matching = session.query(InvestRequirementMatchining).filter(
                InvestRequirementMatchining.invreq_id == invreq_id).all()[0]

            if invest_requirement_matching is None:
                return []

            return invest_requirement_matching

        except:
            print("error")
            traceback.print_exc()

        finally:
            session.close()

    '''
    根据资产账户修改各项资产配比
    '''

    def modify_invest_requirement_matchining(self, invreq_id, stock, bonds, goods):
        try:
            session = db.session()
            invest_requirement_matching = session.query(InvestRequirementMatchining).filter(
                InvestRequirementMatchining.invreq_id == invreq_id).all()[0]

            if invest_requirement_matching is None:
                return
            else:
                invest_requirement_matching.stock = stock
                invest_requirement_matching.bonds = bonds
                invest_requirement_matching.goods = goods

            session.commit()

        except:
            print("error")
            traceback.print_exc()

        finally:
            session.close()

    '''
    根据id得到所有交易记录
    '''

    def get_transaction_record(self, invreq_id):
        try:
            session = db.session()
            transaction_record = session.query(TransactionRecord).filter(
                TransactionRecord.request_id == invreq_id).all()

            if transaction_record is None:
                return []

            return transaction_record

        except:
            print("error")
            traceback.print_exc()

        finally:
            session.close()

    '''
    得到资产配比情况
    '''

    def get_reallowcation_record(self, invreq_id):
        try:
            session = db.session()
            transcation_record = session.query(ReallowcationRecord).filter(
                ReallowcationRecord.invreq_id == invreq_id).all()

            if transcation_record is None:
                return []

            return transcation_record

        except:
            print("error")
            traceback.print_exc()

        finally:
            session.close()
        pass

    '''
    得到资产配比情况
    '''

    def get_reallowcation_record_by_date(self, invrq_id, date):
        try:
            session = db.session()
            print()
            transcation_record = session.query(ReallowcationRecord).filter(
                str(ReallowcationRecord.time).split(' ')[0] == date).filter(
                ReallowcationRecord.invreq_id == invrq_id).all()
            if transcation_record is None:
                return []
            return transcation_record

        except:
            print("error")
            traceback.print_exc()

        finally:
            session.close()
        pass

    '''
    得到用户持仓情况
    '''

    def get_position(self, id):
        try:
            session = db.session()
            position = session.query(Position).filter(
                Position.request_id == id).all()

            if not position:
                return []

            return position

        except:
            print("error")
            traceback.print_exc()

        finally:
            session.close()
        pass

    '''
    得到某个资产配置的交易建议
    '''

    def get_advice_by_id(self, request_id):
        try:
            session = db.session()
            advice = session.query(Advice).filter(
                Advice.request_id == request_id).all()
            if not advice:
                return []

            return advice

        except:
            print("error")
            traceback.print_exc()

        finally:
            session.close()
        pass

    def delete_advice(self, request_id):
        try:
            session = db.session()
            advice = session.query(Advice).filter(
                Advice.request_id == request_id).delete()
            session.commit()
            session.close()

            return advice

        except:
            print("error")
            traceback.print_exc()

        finally:
            session.close()

    def modify_advice(self, id):
        try:
            session = db.session()
            advice = session.query(Advice).filter(
                Advice.id == id)[0]
            if not advice:
                return
            else:
                advice.is_done = False

            return advice

        except:
            print("error")
            traceback.print_exc()

        finally:
            session.close()
        pass

    '''
    修改交易选项
    '''

    def set_transaction_option(self, plan_tran_time, plan_remind_time, min_confirmed_price, confirm_time,
                               default_confirm, request_id):
        try:
            session = db.session()
            investrequirement = session.query(InvestRequirement).filter(InvestRequirement.id == request_id)[0]
            investrequirement.confirm_time = confirm_time
            investrequirement.plan_remind_time = plan_remind_time
            investrequirement.plan_tran_time = plan_tran_time
            investrequirement.min_confirmed_price = min_confirmed_price
            investrequirement.defaultConfirm = default_confirm
            session.commit()
        except:
            print("error")
            traceback.print_exc()
        finally:
            session.close()
        pass
