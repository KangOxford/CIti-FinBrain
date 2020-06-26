from dao.DaoUtil import DaoUtil
from datetime import date
from dao.invest.InvestDao import InvestDao
from dao.goods.GoodsDao import GoodsDao
from dao.goods.FuturePriceOfCrudeOil import PriceOfCrudeOil

from model.Enumeration import Mode

import pandas as pd


class GoodsInvestDao(DaoUtil):
    def __init__(self):
        self.investDao = InvestDao()
        self.goodsDao = GoodsDao()

    #  获取INE原油期货的收盘价和成交量
    def get_future_price_and_amount(self, d: date):
        df = PriceOfCrudeOil().get_SC0()[['时间', '收盘价', '成交量']]

        return df.values[-1][1], df.values[-1][2]

    #  获取配置时返回的w数组，即原油期货和现货分别买多少, 以及用户预期风险
    #  而下面的get_goods_weight返回这两个的比例，即 4 / 11 和 7 / 11
    def get_goods_w(self, invreq_id):
        position = self.investDao.get_position(invreq_id)
        qihuo = 0.0
        xianhuo = 0.0
        for p in position:
            if p.type == Mode.GOODS:
                # 根据期货和现货进行计算
                if p.name == '原油期货':
                    qihuo = qihuo + p.quantity
                else:
                    xianhuo = xianhuo + p.quantity
                pass

        anticipated_risk = self.investDao.get_one_invest(invreq_id).risk
        return [qihuo, xianhuo], anticipated_risk

    #  获取商品收盘价(name除了原油期货和现货(这个name以你们存数据库的名称为准，跟get_buy_price获取买入价那个一样)，还有nanhua, wti, brent)
    #  str： '原油期货'  '原油现货' 'nanhua' 'wti' 'brent'
    def get_goods_price(self, name: str, d: date):
        price = 0.0
        if name == '原油期货':
            total = PriceOfCrudeOil().get_SC0()
            df = total[['时间', '收盘价']]
            for i in range(df.__len__()):
                if df.values[i][0] >= str(d):
                    return float(df.values[i][1])
            return float(df.values[-1][1])
            pass
        elif name == '原油现货':
            # todo 接口参数转换
            return PriceOfCrudeOil().get_latest_data()
            pass
        elif name == 'nanhua':
            df = pd.read_csv('data/wti_brent_nanhua.csv')
            for i in range(df.__len__()):
                if df.values[i][0] >= str(d):
                    return float(df.values[i][3])
            return float(df.values[-1][3])
            pass
        elif name == 'wti':
            df = pd.read_csv('data/wti_brent_nanhua.csv')
            for i in range(df.__len__()):
                if df.values[i][0] >= str(d):
                    return float(df.values[i][2])
            return float(df.values[-1][2])
            pass
        else:
            df = pd.read_csv('data/wti_brent_nanhua.csv')
            for i in range(df.__len__()):
                if df.values[i][0] >= str(d):
                    return float(df.values[i][1])
            return float(df.values[-1][1])
            pass
        return price

    def get_goods_weight(self, invreq_id):
        price = self.get_goods_w(invreq_id)[0]
        return {'原油期货': price[0] / (price[0] + price[1] + 0.00000001),
                '原油现货': price[1] / (price[0] + price[1] + 0.00000001)}

    #  获取商品买入价 和 最后一笔买入的日期
    def get_buy_price(self, invreq_id):
        last_date = date.today()
        position = self.investDao.get_position(invreq_id)
        qihuo = 0.0
        xianhuo = 0.0
        for p in position:
            if p.type == Mode.GOODS:
                last_date = p.buy_time.date()
                if p.name == '原油期货':
                    qihuo = p.price
                else:
                    xianhuo = p.price

        if (date.today() - last_date).days < 16:
            last_date = date(2018, 8, 31)
        return {'原油期货': qihuo,
                '原油现货': xianhuo}, last_date

    #  获取投资金额 即 w[0] * price_x + w[1] * price_y
    def get_investment(self, invreq_id):
        position = self.investDao.get_position(invreq_id)
        amount = 0.0
        for p in position:
            if p.type == Mode.GOODS:
                # 根据期货和现货进行计算
                amount = amount + p.price * p.quantity
                pass
        return amount

    def get_overview(self, invreq_id):
        position = self.investDao.get_position(invreq_id)
        overview = {}

        for p in position:
            if p.type == Mode.GOODS:
                overview[p.code] = (p.price, p.quantity, p.buy_time.date())
        return overview
