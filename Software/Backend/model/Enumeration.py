from enum import Enum, unique

@unique
class Mode(Enum):
    STOCK = 'STOCK'  # 股票
    BOND = 'BOND'  # 债券
    GOODS = 'GOODS'  # 商品

    @classmethod
    def get_enum_labels(cls):
        return [i.value for i in cls]

@unique
class State(Enum):
    CONSIDERATION = 'CONSIDERATION'  # 考虑中
    BUY = 'BUY'  # 购买
    REDEEM = 'REDEEM'  # 赎回

    @classmethod
    def get_enum_labels(cls):
        return [i.value for i in cls]


@unique
class SellMethod(Enum):
    SELL = 'SELL'
    BUY = 'BUY'

    @classmethod
    def get_enum_labels(cls):
        return [i.value for i in cls]


@unique
class Level(Enum):
	SIMPLE = 'SIMPLE'
	HARD = 'HARD'

	@classmethod
	def get_enum_labels(cls):
		return [i.value for i in cls]
