from enum import Enum, unique


@unique
class Role(Enum):
    ADMIN = "ADMIN"
    USER = "USER"

    @classmethod
    def get_enum_labels(cls):
        return [i.value for i in cls]