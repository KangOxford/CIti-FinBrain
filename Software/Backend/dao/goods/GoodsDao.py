from dao.DaoUtil import DaoUtil
from dao.goods.FuturePriceOfCrudeOil import PriceOfCrudeOil


class GoodsDao(DaoUtil):
    def __init__(self):
        # rq.init()
        pass

    '''
    得到原油现货代码
    '''

    def get_spot_code_of_crude_oil(self):
        return 'NYZCOA'

    '''
    得到原油期货代码
    '''

    def get_future_code_of_crude_oil(self):
        return 'SC'

    '''
    得到原油现货价格
    '''

    def get_spot_price_of_crude_oil(self):
        return PriceOfCrudeOil().get_latest_data() * 6.8674
        pass

    '''
    得到原油期货价格
    '''
    def get_future_price_of_crude_oil(self):
        return PriceOfCrudeOil().get_SC0_data()
        # return rq.get_price('原油主力连续', '2018-8-23', date.today().isoformat(), fields='close').tail(1)[0]
        pass

    '''
    根据合约代码查询价格
    '''

    def get_price_by_code(self, code):
        if code == 'NYZCOA':
            return self.get_spot_price_of_crude_oil()
        else:
            return self.get_future_price_of_crude_oil()

    '''
    得到某只商品的名字
    原油现货默认是'NYZCOA'
    '''

    def get_goods_name(self, code):
        if code == 'NYZCOA':
            return '原油现货'
        else:
            return '原油期货'
