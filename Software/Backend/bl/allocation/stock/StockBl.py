import pandas as pd
from datetime import datetime
from numpy import *
from math import *
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import tushare as ts
import scipy

from factory import DaoFactory
from model.vo.StockStrategy import StockStrategy
from model.vo.StockPortfolio import *
from model.vo.StockTransactionsAdvice import StockTransactionsAdvice
from model.invest.TransactionRecord import TransactionRecord

'''
stock_expect_revenue.csv 是 运行 before_get_stock_invest() 生成的结果，其他csv文件都是需要读取的数据
'''


class StockBl(object):
    def __init__(self):
        self.stock_dao = DaoFactory.stockDao
        self.invest_dao = DaoFactory.investDao

    @staticmethod
    def judge_market(price):
        r_market = (price.loc[6] / price.loc[5] - 1).mean()
        if r_market >= 0.05:
            return 1
        elif r_market <= -0.05:
            return 2
        else:
            return 3

    # 判断某行业中因子是否有效，factor为因子名√
    @staticmethod
    def factor_correlation(industry, factor, data, price):
        # 按factor大小将股票分为y组，每组中有n个股票（最后一组不足），并分别计算10组的收益率
        y = 5
        data = data.loc[industry]
        stock_in_industry = data.index
        n = int(len(data) / y) + 1
        r = [0] * y
        for j in range(1, 7):  # 6期
            col = factor + '.' + str(j)
            data = data.sort_values(by=col, ascending=True)
            # 计算行业整体收益率
            r_market = (price.loc[7 - j, stock_in_industry] / price.loc[6 - j, stock_in_industry] - 1).mean()
            # 计算每个档次的超额收益率
            for i in range(y):
                code_rank = data.iloc[i * n:(i + 1) * n].index
                tmp = price.loc[7 - j, code_rank] / price.loc[6 - j, code_rank] - 1
                r[i] = r[i] + tmp.mean() - r_market

        # 计算相关性
        array = np.array([r, range(1, y + 1)])
        coff = np.corrcoef(array)
        # print(coff)
        if abs(coff[0][1]) > 0.8:
            if r[0] > r[y - 1]:
                if r[0] > 0 and r[y - 1] < 0:
                    return True
                else:
                    return False
            else:
                if r[0] < 0 and r[y - 1] > 0:
                    return True
                else:
                    return False
        else:
            return False

    '''
    #一个粗暴的数据处理X
    def deal(data):
        data=data.fillna(0)
        for i in range(len(data)):
            for j in range(0,len(data.columns)):
                if data.iloc[i,j]==0:
                    if j >= len(data.columns):
                        data.iloc[i,j]=data.iloc[i,j-1]
                    else:
                        data.iloc[i,j]=(data.iloc[i,j-1]+data.iloc[i,j+1])/2
                while abs(data.iloc[i,j])<1e-3:
                    data.iloc[i,j]*=10
        return data
    '''

    # 计算正交X
    @staticmethod
    def orthogonality(data):
        F = np.array(data)
        M = np.dot(F.T, F)
        d, fig = np.linalg.eig(M)
        D = np.diag(d ** -0.5)
        S = np.dot(np.dot(fig, D), fig.T)
        tmp_result = np.dot(F, S)
        result = pd.DataFrame(tmp_result, index=data.index)
        return result

    # 计算因子收益率 √
    @staticmethod
    def cal_factors_r(a):
        a = a.fillna(0)
        X = a.iloc[:, 0:-1]
        y = a.iloc[:, -1]
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=100)
        linreg = LinearRegression()
        model = linreg.fit(X_train, y_train)
        r = list(linreg.coef_)
        return (r)

    # 计算因子期望收益率 √
    @staticmethod
    def cal_r_under_ACI(R):
        N = 24
        # 外生变量
        rev = pd.read_csv("bl/allocation/stock/shangzhengindex.csv")
        rev = np.array(rev['close'])
        vari = np.array(pd.read_csv("bl/allocation/stock/variables.csv")['0'])
        money = pd.read_csv("bl/allocation/stock/money_supply.csv")
        m1 = [];
        m2 = [];
        m1_m2 = []
        i = 0
        while (i < N):
            m1.append((money['m1'][i] - money['m1'][i + 12]) / money['m1'][i + 12])
            m2.append((float(money['m2'][i]) - float(money['m2'][i + 12])) / float(money['m2'][i + 12]))
            i += 1
        for i in range(0, N):
            m1_m2.append(m1[i] - m2[i])
        cp = pd.read_csv("bl/allocation/stock/cpi.csv")
        pp = pd.read_csv("bl/allocation/stock/ppi.csv")
        cpi = [];
        ppi = [];
        cpi_ppi = []
        i = 0
        while (i < N):
            cpi.append((cp['cpi'][i] - cp['cpi'][i + 12]) / cp['cpi'][i + 12])
            ppi.append((float(pp['ppi'][i]) - float(pp['ppi'][i + 12])) / float(pp['ppi'][i + 12]))
            i += 1
        for i in range(0, N):
            cpi_ppi.append(cpi[i] - ppi[i])

        # ACI筛选
        Srr = [];
        Sr_rev = [];
        Srev_r = [];
        Sl_rev = []
        Srev_rev = np.array(rev).var()
        Svari_vari = np.array(vari).var()
        Sm1_m2 = np.array(m1_m2).var()
        Scpi_ppi = np.array(cpi_ppi).var()
        for i in range(0, len(R)):
            Srr.append(np.array(R[i]).var())
            Sr_rev.append(np.cov(R[i], rev))
            Srev_r.append(np.cov(rev, R[i]))
            Sl_rev.append(Sr_rev[i] * (Srev_rev ** -1) * Srev_r[i])
        Sr_vari = [];
        Svari_r = [];
        Sl_vari = []
        for i in range(0, len(R)):
            Sr_vari.append(np.cov(R[i], vari))
            Svari_r.append(np.cov(vari, R[i]))
            Sl_vari.append(Sr_vari[i] * (Svari_vari ** -1) * Svari_r[i])
        Sr_m1_m2 = [];
        Sm1_m2_r = [];
        Sl_m1_m2 = []
        for i in range(0, len(R)):
            Sr_m1_m2.append(np.cov(R[i], m1_m2))
            Sm1_m2_r.append(np.cov(m1_m2, R[i]))
            Sl_m1_m2.append(Sr_m1_m2[i] * (Sm1_m2 ** -1) * Sm1_m2_r[i])
        Sr_cpi_ppi = [];
        Scpi_ppi_r = [];
        Sl_cpi_ppi = []
        for i in range(0, len(R)):
            Sr_cpi_ppi.append(np.cov(R[i], cpi_ppi))
            Scpi_ppi_r.append(np.cov(cpi_ppi, R[i]))
            Sl_cpi_ppi.append(Sr_cpi_ppi[i] * (Scpi_ppi ** -1) * Scpi_ppi_r[i])
        aic0 = [];
        aic1 = [];
        aic2 = [];
        aic3 = [];
        aic4 = [];
        index = []
        for i in range(0, len(R)):
            aic0.append(N * log(Srr[i]))
        for i in range(0, len(R)):
            aic1.append(N * log(abs((Srr[i] - Sl_rev[i][0][1]))) + 2)
        for i in range(0, len(R)):
            aic2.append(N * log(abs((Srr[i] - Sl_rev[i][0][1] - Sl_vari[i][0][1]))) + 4)
        for i in range(0, len(R)):
            aic3.append(N * log(abs((Srr[i] - Sl_rev[i][0][1] - Sl_vari[i][0][1] - Sl_m1_m2[i][0][1]))) + 6)
        for i in range(0, len(R)):
            aic4.append(N * log(
                abs((Srr[i] - Sl_rev[i][0][1] - Sl_vari[i][0][1] - Sl_cpi_ppi[i][0][1] - Sl_m1_m2[i][0][1]))) + 8)
        for i in range(0, len(R)):
            if aic0[i] < aic1[i]:
                index.append(0)
            elif aic1[i] < aic2[i]:
                index.append(1)
            elif aic2[i] < aic3[i]:
                index.append(2)
            elif aic3[i] < aic4[i]:
                index.append(3)
            else:
                index.append(4)

        renew = []
        j = 0
        for i in index:
            if i == 0:
                renew.append(np.array(R[j]).mean())
            if i == 1:
                renew.append(np.array(R[j]).mean() + Sr_rev[j][0][1] * (Srev_rev ** -1) * (rev[0] - rev.mean()))
            if i == 2:
                renew.append(
                    np.array(R[j]).mean() + Sr_rev[j][0][1] * (Srev_rev ** -1) * (rev[0] - rev.mean()) + Sr_vari[j][0][
                        1] * (Svari_vari ** -1) * (rev[0] - vari.mean()))
            if i == 3:
                renew.append(
                    np.array(R[j]).mean() + Sr_rev[j][0][1] * (Srev_rev ** -1) * (rev[0] - rev.mean()) + Sr_vari[j][0][
                        1] * (Svari_vari ** -1) * (rev[0] - vari.mean()) + Sr_m1_m2[j][0][1] * (Sm1_m2 ** -1) * (
                            m1_m2[0] - np.array(m1_m2).mean()))
            if i == 4:
                renew.append(
                    np.array(R[j]).mean() + Sr_rev[j][0][1] * (Srev_rev ** -1) * (rev[0] - rev.mean()) + Sr_vari[j][0][
                        1] * (Svari_vari ** -1) * (rev[0] - vari.mean()) + Sr_m1_m2[j][0][1] * (Sm1_m2 ** -1) * (
                            m1_m2[0] - np.array(m1_m2).mean()) + Sr_cpi_ppi[j][0][1] * (Scpi_ppi ** -1) * (
                            cpi_ppi[0] - np.array(cpi_ppi).mean()))
            j += 1

        return renew

    # 计算股票期望收益率 √
    @staticmethod
    def cal_expect_revenue(data, r, industry, market_status):
        # 从http://www.policyuncertainty.com/china_monthly.html获取最新epu数据
        epu = 561.9995728
        epu_industry = ['801120.INDX', '801750.INDX', '801080.INDX', '801760.INDX', '801150.INDX', '801770.INDX',
                        '801740.INDX', '801140.INDX', '801050.INDX', '801030.INDX']

        price = []
        for i in range(len(data)):
            r_line = data.iloc[i, :] * r
            price.append(sum(r_line))
        # 根据EPU进行修改
        if industry in epu_industry:
            if epu > 200:
                if market_status == 1:
                    price = [i * 1.1 for i in price]
                elif market_status == 2:
                    price = [i * 0.9 for i in price]
        data['price'] = price
        D = data['price']
        return D

    # 该函数执行时间较长（大概几分钟），用于分析当前股票市场，并给出股票的期望收益，**建议单独执行**。
    def before_get_stock_invest(self):
        # 获取数据
        data1 = pd.read_csv('bl/allocation/stock/dealt_fundamental_data.csv', skiprows=[1], index_col=[0, 1])
        data2 = pd.read_csv('bl/allocation/stock/dealt_turnover_rate.csv', skiprows=[1], index_col=[0, 1])
        data = pd.concat([data1, data2], axis=1, join='inner')
        price = pd.read_csv('bl/allocation/stock/price.csv')
        market_status = self.judge_market(price)
        # print(market_status)
        # 按行业进行因子有效性检验
        all_industries = ['801010.INDX',
                          '801020.INDX',
                          '801030.INDX',
                          '801040.INDX',
                          '801050.INDX',
                          '801080.INDX',
                          '801110.INDX',
                          '801120.INDX',
                          '801130.INDX',
                          '801140.INDX',
                          '801150.INDX',
                          '801160.INDX',
                          '801170.INDX',
                          '801180.INDX',
                          '801200.INDX',
                          '801210.INDX',
                          '801230.INDX',
                          "801710.INDX",
                          "801720.INDX",
                          "801730.INDX",
                          "801740.INDX",
                          "801750.INDX",
                          "801760.INDX",
                          "801770.INDX",
                          "801780.INDX",
                          "801790.INDX",
                          "801880.INDX",
                          "801890.INDX"]
        all_factors = ['market_cap', 'pb', 'pe', 'pcf', 't_asset_turnover', 'debt_to_asset', 'ROIC', 'mto', 'yto']
        industry_factors = {}
        for industry in all_industries:
            factors = []
            for factor in all_factors:
                # t期的因子的t+1期的价格
                if self.factor_correlation(industry, factor, data, price):
                    factors.append(factor)
            industry_factors[industry] = factors
        # print(industry_factors)

        industry_factors_r = {}
        total_expect_revenue = pd.DataFrame()
        for industry in all_industries:
            if industry_factors[industry] == []:
                continue
            this_time_factor_r = []  # 记录有效因子多时期的收益率
            for i in range(len(industry_factors[industry])):
                this_time_factor_r.append([])
            for i in range(24):  # 24期
                if i == 0:
                    original = data.loc[industry, industry_factors[industry]]
                else:
                    factors = []
                    for factor in industry_factors[industry]:
                        factor = factor + '.' + str(i)
                        factors.append(factor)
                    original = data.loc[industry, factors]
                orth_factors = self.orthogonality(original)  # 对于每一期分别因子正交

                rev = pd.read_csv("bl/allocation/stock/revenue.csv").T
                data_plus_revenue = pd.concat([orth_factors, rev[0]], axis=1, join='inner')
                # 计算因子收益率
                this_time_r = self.cal_factors_r(data_plus_revenue)
                for j in range(len(this_time_factor_r)):
                    this_time_factor_r[j].append(this_time_r[j])
            # print(this_time_factor_r)
            # 筛选外生变量并获取因子期望收益率
            industry_factors_r[industry] = self.cal_r_under_ACI(this_time_factor_r)
            # print(industry_factors_r)
            # 计算该行业中股票总收益
            original = data.loc[industry, industry_factors[industry]]
            orth_factors = self.orthogonality(original)
            expect_revenue = self.cal_expect_revenue(orth_factors, industry_factors_r[industry], industry,
                                                     market_status)

            if len(total_expect_revenue) == 0:
                total_expect_revenue = expect_revenue
            else:
                total_expect_revenue = pd.concat([total_expect_revenue, expect_revenue])
        total_expect_revenue = total_expect_revenue.sort_values(ascending=False)
        # print(total_expect_revenue)
        total_expect_revenue.to_csv('bl/allocation/stock/stock_expect_revenue.csv')

    # 股票持仓策略生成
    def get_stock_invest(self, volume: float) -> StockStrategy:
        stocks = pd.read_csv('bl/allocation/stock/stock_expect_revenue.csv', header=None, skiprows=20)
        # 获取股票持仓策略
        # 持股排名靠前的n支股票
        # 在n较小的时候，不买price大的股票（后延）
        strategy = {}
        last_money = 0  # 用于股票要求整百股购买，此处表示未用完的金额
        if volume < 100000:
            each = sqrt(volume / 100) * 100 / 1.5
            n = int(volume / each)
            i = 0
            for code in stocks.iloc[:, 0]:
                price = self.get_stock_price(code)
                expect_cost = each + last_money
                quantity = int(expect_cost / price / 100) * 100  # 购买股数
                if quantity < 100:
                    continue
                total_amount = price * quantity
                last_money = expect_cost - total_amount
                i = i + 1
                strategy[code] = quantity
                if i >= n:
                    break
        elif volume < 200000:
            each = log(volume, 2) * 150
            n = int(volume / each)
            i = 0
            for code in stocks.iloc[:, 0]:
                price = self.get_stock_price(code)
                expect_cost = each + last_money
                quantity = int(expect_cost / price / 100) * 100  # 购买股数
                if quantity < 100:
                    continue
                total_amount = price * quantity
                last_money = expect_cost - total_amount
                i = i + 1
                strategy[code] = quantity
                if i >= n:
                    break
        else:
            n = 150
            i = 0
            for code in stocks.iloc[:, 0]:
                each = int(volume / n)
                price = self.get_stock_price(code)
                expect_cost = each + last_money
                quantity = int(expect_cost / price / 100) * 100  # 购买股数
                if quantity < 100:
                    continue
                total_amount = price * quantity
                last_money = expect_cost - total_amount
                i = i + 1
                strategy[code] = quantity
                if i >= n:
                    break

        stock_strategy = StockStrategy(strategy)
        return stock_strategy

    # 当用户确认策略后，由策略生成持仓。√
    def strategy_to_portfolio(self, strategy: StockStrategy) -> StockPortfolio:
        strategy = strategy.strategy
        portfolio = []
        for code in strategy:
            price = self.get_stock_price(code)
            quantity = strategy[code]
            total_amount = price * quantity
            position = StockPosition(code, price, quantity, total_amount, datetime.now())  # TODO
            portfolio.append(position)
        stock_portfolio = StockPortfolio(portfolio)  # TODO
        return stock_portfolio

    # 获取股票价格，要接口权限
    def get_stock_price(self, code):
        return self.stock_dao.get_stock_price(code)

    # 计算手续费 √
    @staticmethod
    def cal_expense(code, quantity, total_amount):
        # 佣金，0.05%~0.3%，自定
        expense = total_amount * 0.002
        if expense < 5:
            expense = 5
        # 沪股收过户费
        if code[-1] == 'E':
            if quantity <= 1000:
                expense = expense + 1
            else:
                expense = expense + int(abs(quantity) / 1000)
        # 印花税
        if quantity < 0:
            expense = expense + total_amount * 0.001
        return expense

    # 生成新持仓后，生成交易逻辑，并记录交易记录(record)（存数据库），
    # 返回交易逻辑
    def modify_stock_portfolio(self, old_stock_portfolio: StockPortfolio,
                               new_stock_portfolio: StockPortfolio) -> StockTransactionsAdvice:
        from model.Enumeration import Mode

        old_code = []
        for item in old_stock_portfolio.portfolio:
            old_code.append(item.stock_code)
        new_code = []
        for item in new_stock_portfolio.portfolio:
            new_code.append(item.stock_code)
        need_to_buy = set(new_code) - set(old_code)
        need_to_sell = set(old_code) - set(new_code)
        transactions = []  # 交易行为
        # 新持仓为空，全卖
        if new_stock_portfolio.portfolio == []:
            for position in old_stock_portfolio.portfolio:
                price = self.get_stock_price(position.stock_code)
                quantity = - position.quantity
                total_amount = price * position.quantity
                expense = self.cal_expense(position.stock_code, quantity, total_amount)
                record = TransactionRecord(position.stock_code, price, quantity, datetime.now(),
                                                expense, Mode.STOCK)  # TODO
                # 【record写入数据库】
                transactions.append(record)
            return StockTransactionsAdvice(transactions)  # TODO
        for position in new_stock_portfolio.portfolio:
            # 买入新的股票
            if position.stock_code in need_to_buy:
                expense = self.cal_expense(position.stock_code, position.quantity, position.total_amount)
                record = TransactionRecord(position.stock_code, position.price, position.quantity,
                                                position.buy_time, expense, Mode.STOCK)  # TODO
                # 【record记入数据库】
                transactions.append(record)
            # 少买多卖
            elif position.stock_code not in need_to_sell:
                # 找到之前的持仓
                for old_position in old_stock_portfolio.portfolio:
                    if position.stock_code == old_position.stock_code:
                        price = 0
                        # 多卖
                        if position.quantity < old_position.quantity:
                            price = self.get_stock_price(position.stock_code)
                        # 少买
                        elif position.quantity > old_position.quantity:
                            price = position.price
                        else:
                            break
                        quantity = position.quantity - old_position.quantity
                        total_amount = price * abs(quantity)
                        expense = self.cal_expense(position.stock_code, quantity, total_amount)
                        record = TransactionRecord(position.stock_code, price, quantity,
                                                        position.buy_time, expense, Mode.STOCK)  # TODO
                        # 【record写入数据库】
                        transactions.append(record)
                        break
        # 卖出旧的股票
        for position in old_stock_portfolio.portfolio:
            if position.stock_code in need_to_sell:
                price = self.get_stock_price(position.stock_code)
                quantity = - position.quantity
                total_amount = price * position.quantity
                expense = self.cal_expense(position.stock_code, quantity, total_amount)
                record = TransactionRecord(position.stock_code, price, quantity, datetime.now(),
                                                expense, Mode.STOCK)  # TODO
                # 【record写入数据库】
                transactions.append(record)

        return StockTransactionsAdvice(transactions)  # TODO

    # 计算策略预期收益率与波动率
    def cal_rev_and_risk(self, strategy: StockStrategy):
        stocks_rev = pd.read_csv('stock_expect_revenue.csv', header=None, index_col=0)
        s = strategy.strategy
        rev = stocks_rev.loc[s.keys()].mean()
        stocks_risk = pd.read_csv('vola.csv')
        n = len(s)
        w = mat([1 / n] * n)
        tmp = stocks_risk[list(s.keys())]
        tmpp = array(tmp.iloc[-n:]).T
        print(w, tmpp)
        risk = w * tmpp
        return rev, risk

    def allocate_stock(self, invreq_id, volume: float):

        old_stock_strategy, old_stock_portfolio = self.invest_dao.get_stock_asset_allocation(invreq_id)

        new_stock_strategy = self.get_stock_invest(volume)

        # 用户的策略的修改 TODO

        stock_portfolio = self.strategy_to_portfolio(new_stock_strategy)
        transactions_advice = self.modify_stock_portfolio(old_stock_portfolio, stock_portfolio)

        self.invest_dao.save_stock_asset_allocation(invreq_id, new_stock_strategy, stock_portfolio, transactions_advice)

    @staticmethod
    def cal_sin(price_end):
        window = 5
        alpha = 2 / (window + 1)
        M = 5
        pi = 3.14159265359
        phy = 0

        # step 1
        p_acc = np.hstack((np.zeros((1)), price_end.cumsum()))
        price = (p_acc[window:] - p_acc[:(-window)]) / window

        # step 2
        SF = np.zeros(price.shape)
        price = price[::-1]
        SF[0] = price[0]
        SF[1] = price[1]
        for i in range(2, price.shape[0]):
            SF[i] = ((1 - alpha / 2) ** 2) * (price[i] - 2 * price[i - 1] + price[i - 2]) + 2 * (1 - alpha) * SF[
                i - 1] - ((1 - alpha) ** 2) * SF[i - 2]

        # step 3
        y = np.zeros(SF.shape)
        for i in range(M, SF.shape[0] - M):
            for r in range(1, 2 * M + 2):
                if np.mod(r - M - 1, 2) == 1:
                    y[i] += 2 / pi / (r - M - 1) * SF[i - M - 1 + r]
        Q = y[M:(-M)]
        I = SF[M:(-M)]

        # step 4
        thetat = np.arctan(Q / I)
        omega = thetat[1:] - thetat[:-1]
        T = 2 * pi / omega

        # step 5
        SF = SF[::-1]
        N = abs(int(T[-1]))
        a = 0
        b = 0
        for i in range(N):
            a += SF[i] * np.sin(2 * pi * i / N)
            b += SF[i] * np.cos(2 * pi * i / N)
        theta = np.arctan(a / b)
        sin1 = np.sin(theta + phy)
        sin2 = np.sin(theta + phy + pi / 4)

        # step 7
        return sin1, sin2

    def cal_phase(self, code):
        if code[-1] == 'E':
            code = code[:7] + 'sz'
        else:
            code = code[:7] + 'sh'
        try:
            pro = ts.pro_api('9b04bfe2cbc4624a726a9f5677b3aab5dd7e618b0b5b20002802a856')
            start_date = (datetime.date.today() + datetime.timedelta(days=-100)).strftime('%Y%m%d')
            end_date = datetime.date.today().strftime('%Y%m%d')
            df = pro.daily(ts_code=code, start_date=start_date, end_date=end_date)
            yesterday = self.cal_sin(np.array(df.close)[1:])
            today = self.cal_sin(np.array(df.close))
            if today[1] > today[0] and yesterday[1] < yesterday[0]:
                return 1
            elif today[1] < today[0] and yesterday[1] > yesterday[0]:
                return 2
            else:
                return 3
        except:
            return 3

    '''
    增加函数market_timing，每日调用这个函数，会进行股票市场持仓策略的调整，无需用户确认。
    参数：
    strategy: StockStrategy为最近一次get_stock_invest所生成的策略，
    portfolio: StockPortfolio为当前持仓，
    last_money为当前股票市场结余的闲置金额
    返回值：
    stock_strategy: StockStrategy为新的持仓策略
    
    参数中last_money的计算：初始用于股票市场投资的金额 - 当前所有持仓股票的买入价*买入股数 + 之前卖掉的股票的卖出价*卖出股数
    （emm这边算的很粗暴
    
    执行完此函数，就按照正常的get_stock_invest后面的逻辑
    '''
    def market_timing(self, strategy: StockStrategy, portfolio: StockPortfolio, last_money: float) -> StockStrategy:
        portfolio = portfolio.portfolio
        strategy = strategy.strategy
        new_stock_strategy = {}
        will_buy = []
        for code in strategy:
            phase = self.cal_phase(code)
            # 买入
            if phase == 1:
                flag = 0
                for position in portfolio:
                    # 已经买了，不变
                    if code == position.stock_code:
                        # print('mlle')
                        new_stock_strategy[code] = strategy[code]
                        flag = 1
                        break
                # 没买过
                if flag == 0:
                    # print('ykml')
                    will_buy.append(code)
            elif phase == 2:
                pass
            # 不变
            elif phase == 3:
                new_stock_strategy[code] = strategy[code]
        if len(will_buy) != 0:
            each = last_money / len(will_buy)
            for code in will_buy:
                price = self.get_stock_price(code)
                quantity = int(each / price / 100) * 100  # 购买股数
                if quantity < 100:
                    continue
                total_amount = price * quantity
                last_money = last_money - total_amount
                new_stock_strategy[code] = quantity

        stock_strategy = StockStrategy(new_stock_strategy)
        return stock_strategy

    # 市场崩盘指标1
    @staticmethod
    def cal_r2():
        # 注册https://tushare.pro/即可获得token，不确定token是否会失效需要重新获取
        pro = ts.pro_api('9b04bfe2cbc4624a726a9f5677b3aab5dd7e618b0b5b20002802a856')
        stock_r = pd.DataFrame()
        for i in range(42):
            i = - i
            day = (datetime.date.today() + datetime.timedelta(days=i)).strftime('%Y%m%d')
            df = pro.query('daily', trade_date=day)
            if df.empty == False:
                df = df['pct_change']
                stock_r = pd.concat([stock_r, df], axis=1)
        stock_r = stock_r.fillna(0)
        end_date = datetime.date.today().strftime('%Y%m%d')
        start_date = (datetime.date.today() + datetime.timedelta(days=-41)).strftime('%Y%m%d')
        df = pro.index_daily(ts_code='000001.SH', start_date=start_date, end_date=end_date)
        a_r = df['pct_change']
        r = 0
        for i in range(len(stock_r)):
            a = scipy.stats.linregress(stock_r.iloc[i, :], a_r)
            r = r + a[2] * a[2]
        return r / (len(stock_r))

    # 市场崩盘指标2
    @staticmethod
    def cal_ma():
        # 注册https://tushare.pro/即可获得token，不确定token是否会失效需要重新获取
        pro = ts.pro_api('9b04bfe2cbc4624a726a9f5677b3aab5dd7e618b0b5b20002802a856')
        end_date = datetime.date.today().strftime('%Y%m%d')
        start_date = (datetime.date.today() + datetime.timedelta(days=-100)).strftime('%Y%m%d')
        df = pro.index_daily(ts_code='000001.SH', start_date=start_date, end_date=end_date)
        a_r = df['pct_change']
        ma50 = []
        n = len(a_r)
        for i in range(n - 60):
            tmp = a_r.iloc[i:50 + i, ].mean()
            ma50.append(tmp)
        # 计算ma50是否有变大的趋势
        array = np.array([ma50, range(len(ma50), 0, -1)])
        coff1 = np.corrcoef(array)
        ma10 = []
        for i in range(n - 60):
            tmp = a_r.iloc[i:10 + i, ].mean()
            ma10.append(tmp)
        array = np.array([ma10, range(len(ma10))])
        coff2 = np.corrcoef(array)
        return coff1[0][1], coff2[0][1]

    # 每日都应进行一次判断
    def stock_market_fail(self):
        tmp = self.cal_ma()
        if self.cal_r2() < 0.3 and tmp[0] > 0.8 and tmp[1] > 0.8:
            return True
        else:
            return False
        '''
        如果为True，表明股票市场将高概率停止上涨或下跌，则：
        1. 清仓股票市场：调用modify_stock_portfolio函数，旧持仓也即当前持仓，新持仓就为空，
        2. 然后再次调用大类资产配置函数（投资金额就是股票市场卖出后获得的钱，其他参数不变），
           同时置股票的预期收益为-无穷，将钱临时分到债券和商品市场。
        '''

    # 当stock_market_fail返回值为True时，应每日调用此函数判断股票是否恢复正常
    def stock_market_normal(self):
        if self.cal_r2() > 0.5 and self.cal_ma()[1] < -0.7:
            return True
        else:
            return False
        '''
        如果为True，表明股票市场恢复正常，调用大类资产配置重新组合资产，投资各个市场
        '''


'''   
完整逻辑模拟演示
用户输入需求 -> 大类资产配置
 -> 股票市场策略生成(get_stock_invest)
 -> 比较策略(estimate_to_post)，进行推送（在这里允许用户对策略进行修改(modify_stock_strategy)）
 -> 用户确认后由策略生成持仓(strategy_to_portfolio)，并进行交易，同时记录交易记录(modify_stock_portfolio)
 另，应将持仓和交易记录记入数据库。
'''

'''
生成股票策略前提：
1. 在大类资产分析完后调用，进行股票市场的配置。
2. 每月（暂定为第一个交易日）调用一次。
另，如果用户更改了持仓，对于当期策略结果需要保存一下(old_stock_stratrgy)，
没更改的话就还是存之前的策略不用变，以便下次调用后进行两次结果的比较。
'''
'''
before_get_stock_invest()
new_stock_strategy = get_stock_invest(0,0,0,100000)

#之前的策略
old_stock_strategy = StockStrategy()
#对两次策略进行比较，如果差距较大，向用户推送当前策略。
if estimate_to_post(old_stock_strategy, new_stock_strategy):
    pass
#else:
    #return
#用户的策略的修改
new_stock_strategy = modify_stock_strategy(new_stock_strategy)
#根据新策略生成持仓，并【记入数据库】
stock_portfolio = strategy_to_portfolio(new_stock_strategy)
#获取当前持仓
old_stock_portfolio = StockPortfolio([])
user_id = ''
#生成交易逻辑，同时记录交易行为
modify_stock_portfolio(user_id, old_stock_portfolio, stock_portfolio)
'''
