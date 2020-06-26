from threading import Timer

import tushare
from jqdatasdk import *

from dao.RestDao import RestDao
from factory.BlFactory import stockBl, globalAllocationBl
from factory.DaoFactory import investDao
from model.invest.InvestRequirement import InvestRequirement
from model.news.News import News
from model.notice.Notice import Notice
from run import db

delta_seconds = 24 * 60 * 60
delta_seconds_per_minute = 60


def test_A():
    timer = Timer(delta_seconds, test_A)
    timer.start()
    print('Timer_A running!')


def test_B():
    timer = Timer(delta_seconds, test_B)
    timer.start()
    print('Timer_B running!')


'''
def get_price():
    timer = Timer(delta_seconds, test_B)
    timer.start()
    oilPriceNow = PriceOfCrudeOil.get_latest_data();
    sc0_data = PriceOfCrudeOil.get_SC0_data();
    goodsPrice1 = GoodsPrice(str(sc0_data['时间']).split(" ")[0], sc0_data['收盘价'], "原油期货")
    goodsPrice2 = GoodsPrice(str(sc0_data['时间']).split(" ")[0], oilPriceNow, "原油现货")
    DaoUtil.insert(goodsPrice1)
    DaoUtil.insert(goodsPrice2)


def get_achievement():
    stockBl.get_achievement(1)
'''
def get_data():
    from datetime import date, timedelta
    timer = Timer(24*60*60, get_data)
    timer.start()
    auth('18724008366', 'JoinQuantPass!')
    '''沪深300'''
    hushen_300 = get_price('000300.XSHG', start_date=(date.today() - timedelta(days=45)).isoformat(),
                           end_date=date.today().isoformat(),
                           fields=['open', 'close', 'high', 'low', 'volume', 'money'],
                           skip_paused=False)
    hushen_300.to_csv('data/daily_data/hushen_300.csv')

    '''国债'''
    national_debt = get_price('000012.XSHG', start_date=(date.today() - timedelta(days=45)).isoformat(),
                              end_date=date.today().isoformat(),
                              fields=['open', 'close', 'high', 'low', 'volume', 'money'],
                              skip_paused=False)
    national_debt.to_csv('data/daily_data/national_debt.csv')

    '''企业债'''
    enterprise_bond = get_price('000013.XSHG', start_date=(date.today() - timedelta(days=45)).isoformat(),
                                end_date=date.today().isoformat(),
                                fields=['open', 'close', 'high', 'low', 'volume', 'money'],
                                skip_paused=False)
    enterprise_bond.to_csv('data/daily_data/enterprise_bond.csv')
    pass


'''
定时得到新闻
'''
def get_news():
    timer = Timer(24*60*60, get_news)
    timer.start()

    session = db.session()
    old = session.query(News).all()

    for one in old:
        session.delete(one)

    session.commit()
    session.close()

    session = db.session()

    info = tushare.get_latest_news(top=30, show_content=True)

    for i in range(30):
        news = News(info.title[i].__str__(), info.content[i].__str__(), info.time[i].__str__())
        session.add(news)

    session.commit()

    session.close()


'''
每日定时更新用户的资产配置
'''
def update_allocation():
    timer = Timer(24*60*60, update_allocation)
    timer.start()

    session = db.session()
    all_invest = session.query(InvestRequirement).all()

    for invest in all_invest:
        # 生成方案
        allocation = globalAllocationBl.get_allocation(invest.profit, invest.risk, invest.amount, invest.year, False)
        invest_id = invest.id
        # 先把原来的交易建议删了，然后写入新的
        investDao.delete_advice(invest_id)
        # 写入交易建议
        advices = allocation[2]
        for advice in advices:
            advice.request_id = invest_id
            investDao.insert(advice)

        if not invest.defaultConfirm:
            investDao.insert(Notice('尊敬的用户：您的资产配置方案已产生变更，请尽快确认交易', invest.username, 'Others'))
        else:
            RestDao().generateRecordsAndChange(invest_id)

        pass
