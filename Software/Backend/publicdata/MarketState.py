from enum import Enum, unique


@unique
class MarketState(Enum):
    OBVIOUS_UP = "OBVIOUS_UP",  # 显著上升
    WAVERY_UP = "WAVERY_UP",  # 震荡上升
    OBVIOUS_DOWN = "OBVIOUS_DOWN",  # 显著下降
    WAVERY_DOWN = "WAVERY_DOWN",  # 震荡下降


