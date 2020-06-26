from dao.user.UserDao import UserDao
from dao.invest.InvestDao import InvestDao


class RecommendationDao(object):
    def __init__(self):
        self.userDao = UserDao()
        self.investDao = InvestDao()

    '''
    根据用户标签拿到用户的所有资产账户的列表，包括投资情况，是一个二维数组
    '''
    def get_account_list_by_user_type(self, user_type):
        user = self.userDao.get_username_by_user_type(user_type)
        result = []
        for a_user in user:
            invest_account = self.investDao.get_account_by_username(a_user)

            for one_invest in invest_account:
                position = self.investDao.get_position(one_invest.id)
                one_invest.position = position
                result.append(one_invest)

        return result

    '''
    这个方法可能在用户初始化的时候调用，不知道是不是需要，还没写
    '''
    def set_user_type(self, uesr_type):
        pass
