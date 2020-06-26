from datetime import date
from typing import Dict

class GoodsDaoMock:

    #  获取INE原油期货的收盘价和成交量
    def get_future_price_and_amount(self, d: date):
        return 50.3, 10000.0

    #  获取配置时返回的w数组，即原油期货和现货分别买多少, 以及用户预期风险
    #  而下面的get_goods_weight返回这两个的比例，即 4 / 11 和 7 / 11
    def get_goods_w(self, invreq_id):
        anticipated_risk = 0.2
        return [4.0, 7.0], anticipated_risk

    #  获取商品收盘价(name除了原油期货和现货(这个name以你们存数据库的名称为准，跟get_buy_price获取买入价那个一样)，还有nanhua, wti, brent)
    def get_goods_price(self, name: str, d: date):
        return 50.0

    def get_goods_weight(self, invreq_id) -> Dict[str, float]:
        return {'期货': 0.5,
                '现货': 0.5}

    #  获取商品买入价 和 最后一笔买入的日期
    def get_buy_price(self, invreq_id):
        last_date = date(2018, 6, 30)
        return {'期货': 50.0,
                '现货': 90.0}, last_date

    #  获取投资金额 即 w[0] * price_x + w[1] * price_y
    def get_investment(self, invreq_id):
        return 100000.0
