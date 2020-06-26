from model.Enumeration import Mode, SellMethod


class EnumTrans(object):
    @staticmethod
    def trans_mode(mode):
        if mode == Mode.BOND:
            return 'BOND'
        elif mode == Mode.GOODS:
            return 'GOODS'
        else:
            return 'STOCK'

    @staticmethod
    def get_sell_method(sell_method):
        if sell_method == SellMethod.BUY:
            return 'BUY'
        else:
            return 'SELL'
