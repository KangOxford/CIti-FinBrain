from datetime import date, timedelta
from typing import *

import numpy as np


class GoodsBl(object):

    def __init__(self):
        from bl.goods.GoodsDaoMock import GoodsDaoMock
        from dao.goods.GoodsInvestDao import GoodsInvestDao
        self.goods_dao = GoodsInvestDao()

    @staticmethod
    def calc_bonus_ratio(futures_end_price: Dict[str, List[float]], futures_buy_price: Dict[str, float]):
        # 各个期货每日收益率=（每日收盘价格-买入价）/买入价
        bonus_ratio = {}
        print(futures_buy_price)
        print(futures_end_price)
        for future in futures_end_price:
            buy_price = futures_buy_price[future]
            bonus_ratio[future] = [
                (end_price - buy_price) / (buy_price + 0.0000000001) for end_price in futures_end_price[future]]
        return bonus_ratio

    @staticmethod
    def calc_total_income_ratio(weight: Dict[str, float], n: int, bonus_ratio: Dict[str, List[float]]):

        # 组合每日收益率=（期货A当日收益率*期货A投资占比+期货B当日收益率*期货B投资占比+.........+期货N当日收益率*期货N投资占比）
        total_income_ratio = []
        for i in range(n):
            ratio = 0.0
            for future in bonus_ratio:
                ratio += bonus_ratio[future][i] * weight[future]
            total_income_ratio.append(ratio)

        return total_income_ratio

    @staticmethod
    def calc_max_drawdown(total_income_ratio: List[float], n: int):
        max_drawdown = 0.0
        beginning = 0
        ending = 1
        max_income_ratio = total_income_ratio[0]
        max_income_day = 0

        for i in range(1, n):
            drawdown = (total_income_ratio[i] / (max_income_ratio + 0.000000001) - 1) * 100
            if np.abs(drawdown) > np.abs(max_drawdown):
                max_drawdown = drawdown
                beginning = max_income_day
                ending = i
            if total_income_ratio[i] > max_income_ratio:
                max_income_ratio = total_income_ratio[i]
                max_income_day = i

        return max_drawdown, beginning, ending

    def calc_dynamic_drawdown_and_absolute_return(self, weight: Dict[str, float], n: int, investment: float,
                                                  futures_end_price: Dict[str, List[float]],
                                                  futures_buy_price: Dict[str, float], day: List[date]):
        """
        动态回撤和绝对收益图

        入参第5、6、7项的期货名与价格是一一对应的，所有价格保留到小数点后两位。
        最后图的展现：
        各个期货以每日收益率折线图的形式呈现，同时这张图也要显示组合收益率。
        x轴：日期
        y轴：收益率

        期货组合以总收益的形式呈现
        x轴：日期
        y轴：总收益

        :param weight: 期货比重（期货名、占比）
        :param n: 天数
        :param investment: 用户投资额度
        :param futures_end_price: 期货每日收盘价（其中列表存放每日收盘价）
        :param futures_buy_price: 期货买入价
        :param day: 日期 只有周一到周五 周末期货闭市
        :return: bonusRatio: {String:float[]} 期货收益率
                name: String[] 期货名称
                day: datetime[] 日期
                totalIncomeRatio: float[] 组合收益率
                totalIncome: float[] 组合总收益
                maxDrawdown: float 最大回撤
                beginning: date 最大回撤起始时间
                ending: date 最大回撤终止时间
                days: int 最大回撤回补期
        """
        bonus_ratio = self.calc_bonus_ratio(futures_end_price, futures_buy_price)
        total_income_ratio = self.calc_total_income_ratio(weight, n, bonus_ratio)

        # 组合每日总收益=组合每日收益率*用户投资额度
        total_income = [ratio * investment for ratio in total_income_ratio]

        max_drawdown, beginning, ending = self.calc_max_drawdown(total_income_ratio, n)

        return bonus_ratio, total_income_ratio, total_income, max_drawdown, day[beginning], day[ending], (
                    day[ending] - day[beginning]).days

    def get_dynamic_drawdown_and_absolute_return(self, invreq_id):
        weight = self.goods_dao.get_goods_weight(invreq_id)
        futures_buy_price, futures_end_price, n, day = self.get_buy_and_end_price(invreq_id)
        investment = self.goods_dao.get_investment(invreq_id)

        bonus_ratio, total_income_ratio, total_income, max_drawdown, beginning, ending, days = self.calc_dynamic_drawdown_and_absolute_return(
            weight, n, investment, futures_end_price, futures_buy_price, day)

        absolute_return = []
        for i in range(n):
            bonus_return_ratio = []
            for future in bonus_ratio:
                bonus_return_ratio.append({
                    'name': future,
                    'ratio': bonus_ratio[future][i]
                })
            absolute_return.append({
                'date': day[i].strftime('%F'),
                'bonusRatio': bonus_return_ratio,
                'totalIncomeRatio': total_income_ratio[i],
                'totalIncome': total_income[i]
            })
        return {'absoluteReturn': absolute_return,
                'maxDrawdown': max_drawdown,
                'startDate': beginning.strftime('%F'),
                'endDate': ending.strftime('%F'),
                'days': days}

    def calc_week_return_ratio(self, weight: Dict[str, float], n: int, futures_end_price: Dict[str, List[float]],
                               day: List[date]):
        total_end_price = self.calc_combined_price(weight, futures_end_price, n)
        friday_end_price = []
        for i in range(n):
            if day[i].isoweekday() == 5:
                friday_end_price.append(total_end_price[i])
        week_return_ratio = []
        for i in range(1, len(friday_end_price)):
            week_return_ratio.append((friday_end_price[i] - friday_end_price[i - 1]) / friday_end_price[i - 1])
        return week_return_ratio

    @staticmethod
    def calc_week_fluctuation_ratio(total_income_ratio: List[float], n: int, day: List[date]):
        fluctuation_ratio = []
        for i in range(n):
            if day[i].isoweekday() == 5:
                if i - 4 >= 0:
                    fluctuation_ratio.append(np.array(total_income_ratio[i - 4:i + 1]).std() * np.sqrt(50))
        return fluctuation_ratio

    @staticmethod
    def judge_type(max_income: float, min_income: float, fluctuation: float, max_drawdown: float):
        a = [0] * 4
        typ = 1

        if max_income >= 0.06:
            a[0] += 0.5
            typ = 0
        elif max_income >= 0.055:
            a[2] += 0.5
            typ = 2
        elif max_income >= 0.04:
            a[1] += 0.5
            typ = 1
        else:
            a[3] += 0.5
            typ = 3

        if min_income <= -0.06:
            a[0] += 0.5
        elif min_income < -0.05:
            a[2] += 0.5
        elif min_income < -0.04:
            a[1] += 0.5
        else:
            a[3] += 0.5

        if fluctuation >= 0.06:
            a[0] += 1
        elif fluctuation >= 0.05:
            a[3] += 1
        elif fluctuation > 0.04:
            a[2] += 1
        else:
            a[1] += 1

        if max_drawdown >= 12:
            a[0] += 1
        elif max_drawdown > 10.8:
            a[2] += 1
        elif max_drawdown > 8:
            a[1] += 1
        else:
            a[3] += 1

        for i in range(4):
            if a[i] > a[typ]:
                typ = i

        return typ

    def analyze_scene2(self, total_income_ratio: List[float], n: int, day: List[date]):
        data = [[], [], [], []]
        total_income_ratio_list = []
        typs = ['趋势强波动高', '趋势强波动低', '趋势弱波动高', '趋势弱波动低']
        for i in range(n):
            if day[i].isoweekday() == 5 and i - 4 >= 0:
                s = np.array(total_income_ratio[i - 4:i + 1])
                max_income = s.max()
                min_income = s.min()
                fluctuation = s.std() * np.sqrt(50)
                max_drawdown = np.abs(self.calc_max_drawdown(total_income_ratio[i - 4:i + 1], 5)[0])
                sharpe_ratio = s.mean() / s.std() * np.sqrt(252)
                calmar_ratio = ((1 + s.mean()) ** 365 - 1) / (max_drawdown / 100 + 0.00000000001)
                typ = self.judge_type(max_income, min_income, fluctuation, max_drawdown)
                for j in range(i - 4, i + 1):
                    total_income_ratio_list.append({
                        'date': day[j].strftime('%F'),
                        'type': typs[typ],
                        'totalIncomeRatio': total_income_ratio[j]
                    })
                data[typ].append([max_income, min_income, fluctuation, max_drawdown, sharpe_ratio, calmar_ratio])
        res = []

        for i in range(4):
            s = np.array(data[i]).transpose()
            res.append({
                'type': typs[i],
                'weekNum': len(data[i]),
                'maxWeekIncomeRatio': s[0].mean() * 100 if len(data[i]) != 0 else 0,
                'minWeekIncomeRatio': s[1].mean() * 100 if len(data[i]) != 0 else 0,
                'fluctuationRatio': s[2].mean() * 100 if len(data[i]) != 0 else 0,
                'maxDrawdown': s[3].mean() if len(data[i]) != 0 else 0,
                'sharpeRatio': s[4].mean() if len(data[i]) != 0 else 0,
                'calmarRatio': s[5].mean() if len(data[i]) != 0 else 0
            })
        return {'totalIncomeRatioList': total_income_ratio_list,
                'typeData': res
                }

    def analyze_scene(self, total_income_ratio: List[float], weight: Dict[str, float], n: int,
                      futures_end_price: Dict[str, List[float]], day: List[date], max_drawdown: float):
        """
        场景分析
        （夏普比率，Calmar比率）


        :param total_income_ratio: 模块A中算出的组合收益率
        :param weight: 期货比重（期货名、占比）
        :param n: 天数
        :param futures_end_price: 期货每日收盘价
        :param day: 日期 只有周一到周五 周末期货闭市
        :param max_drawdown: 模块A中的最大回撤
        :return: sharpeRatio: float 夏普比率
                calmarRatio: float Calmar比率
                maxWeekIncome: float 周收益率最大值
                minWeekIncome: float 周收益率最小值
                fluctuationRatio: float 波动率
        """
        week_return_ratio = self.calc_week_return_ratio(weight, n, futures_end_price, day)
        s = np.array(week_return_ratio)

        ave_return = s.mean()
        std_return = s.std()
        sharpe_ratio = ave_return / std_return * np.sqrt(50)

        calmar_ratio = ((1 + np.array(total_income_ratio).mean()) ** 365 - 1) / np.abs(max_drawdown / 100)

        max_week_income = s.max()
        min_week_income = s.min()

        fluctuation_ratio = self.calc_week_fluctuation_ratio(total_income_ratio, n, day)

        return sharpe_ratio, calmar_ratio, max_week_income, min_week_income, np.array(fluctuation_ratio).mean()

    def get_scene_analysis(self, invreq_id):
        weight = self.goods_dao.get_goods_weight(invreq_id)
        futures_buy_price, futures_end_price, n, day = self.get_buy_and_end_price(invreq_id)
        bonus_ratio = self.calc_bonus_ratio(futures_end_price, futures_buy_price)
        total_income_ratio = self.calc_total_income_ratio(weight, n, bonus_ratio)
        '''
        max_drawdown = self.calc_max_drawdown(total_income_ratio, n)[0]

        sharpe_ratio, calmar_ratio, max_week_income, min_week_income, fluctuation_ratio = self.analyze_scene(total_income_ratio, weight, n, futures_end_price, day, max_drawdown)
        
        total_income_ratio_list = []
        for i in range(n):
            total_income_ratio_list.append({
                'date': day[i].strftime('%F'),
                'totalIncomeRatio': total_income_ratio[i]
            })

        return {'totalIncomeRatioList': total_income_ratio_list,
                'typeData': self.analyze_scene2(total_income_ratio, n, day)
                }'''
        return self.analyze_scene2(total_income_ratio, n, day)

    @staticmethod
    def calc_market_benchmark(wti: List[float], brent: List[float], nanhua: List[float], n: int):
        """
        与市场基准比较

        展示成折线图的形式，形成投资组合与市场基准的比较

        :param wti: WTI交易价格
        :param brent: Brent交易价格
        :param nanhua: 南华商品指数
        :param n: 天数
        :return: marketRatio1: float[] 南方原油市场基准
                marketRatio2: float[] 南华商品指数市场基准
        """
        market_ratio2 = []
        for i in range(1, n + 1):
            market_ratio2.append((nanhua[i] - nanhua[i - 1]) / nanhua[i - 1])
        market_ratio1 = (np.array(wti) * 0.6 + np.array(brent) * 0.4).tolist()
        return market_ratio1, market_ratio2

    def get_comparision_with_market_benchmark(self, invreq_id):
        weight = self.goods_dao.get_goods_weight(invreq_id)
        futures_buy_price, futures_end_price, n, day = self.get_buy_and_end_price(invreq_id)
        bonus_ratio = self.calc_bonus_ratio(futures_end_price, futures_buy_price)
        total_income_ratio = self.calc_total_income_ratio(weight, n, bonus_ratio)
        wti = self.get_goods_daily_price('wti', day[0], day[-1])[1]
        brent = self.get_goods_daily_price('brent', day[0], day[-1])[1]
        nanhua = self.get_goods_daily_price('nanhua', self.last_day(day[0]), day[-1])[1]
        market_ratio1, market_ratio2 = self.calc_market_benchmark(wti, brent, nanhua, n)
        comparision_list = []
        for i in range(n):
            comparision_list.append({
                'date': day[i].strftime('%F'),
                'marketRatio1': market_ratio1[i],
                'marketRatio2': market_ratio2[i],
                'totalIncomeRatio': total_income_ratio[i]
            })
        return {'comparisionWithMarketBenchmark': comparision_list}

    def get_factor_sensitivity_analysis(self, invreq_id):
        weight = self.goods_dao.get_goods_weight(invreq_id)
        futures_buy_price, futures_end_price, n, day = self.get_buy_and_end_price(invreq_id)
        bonus_ratio = self.calc_bonus_ratio(futures_end_price, futures_buy_price)
        total_income_ratio = self.calc_total_income_ratio(weight, n, bonus_ratio)
        week_income_ratio = self.calc_week_return_ratio(weight, n, futures_end_price, day)
        week_fluctuation_ratio = self.calc_week_fluctuation_ratio(total_income_ratio, n, day)
        if len(week_income_ratio) != len(week_fluctuation_ratio):
            week_fluctuation_ratio = week_fluctuation_ratio[1:]

        points = []
        for i in range(len(week_income_ratio)):
            points.append({
                'weekIncomeRatio': week_income_ratio[i],
                'weekFluctuationRatio': week_fluctuation_ratio[i]
            })

        from sklearn.linear_model import LinearRegression
        train_x = []
        train_y = week_income_ratio
        for ratio in week_fluctuation_ratio:
            train_x.append([ratio])
        reg = LinearRegression()
        reg.fit(train_x, train_y)
        s = np.array(week_fluctuation_ratio)
        f_min = s.min()
        f_max = s.max()

        return {'factorSensitivity': points,
                'x1': f_min,
                'y1': reg.predict(f_min)[0],
                'x2': f_max,
                'y2': reg.predict(f_max)[0]}

    @staticmethod
    def analyze_residual(total_income_ratio: List[float], n: int, day: List[date]):
        """
        残差项分析（残差收益率时序图和残差收益分布图）

        根据的收各个期货的收益率得到回归方程。
        残差，是指实际观察值与回归估计值的差。
        在回归分析中，测定值与按回归方程预测的值之差，以δ表示残差。
        峰度与偏度的计算见备注


        :param total_income_ratio: 模块A中算出的组合收益率
        :param n: 天数
        :param day: 日期 只有周一到周五 周末期货闭市
        :return: residual: float[] 残差列表
                kurt: float 峰度
                skew: float 偏度
        """
        from sklearn.linear_model import LinearRegression
        train_x = []
        train_y = total_income_ratio
        for d in day:
            train_x.append([(d - day[0]).days])
        reg = LinearRegression()
        reg.fit(train_x, train_y)
        residual = []  # 残差列表
        for i in range(n):
            residual.append(total_income_ratio[i] - reg.predict((day[i] - day[0]).days)[0])
        s = np.array(total_income_ratio)
        std_ratio = s.std()
        mean_ratio = s.mean()
        kurt = 1.0 * n * (n + 1) / ((n - 1) * (n - 2) * (n - 3)) * (((s - mean_ratio) / std_ratio) ** 4).sum() - 3.0 * (
                n - 1) ** 2 / ((n - 2) * (n - 3))
        skew = 1.0 * n / ((n - 2) * (n - 3)) * (((s - mean_ratio) / std_ratio) ** 3).sum()
        return residual, kurt, skew

    @staticmethod
    def next_day(d: date) -> date:
        if d.isoweekday() == 5:
            return d + timedelta(days=3)
        return d + timedelta(days=1)

    @staticmethod
    def last_day(d: date) -> date:
        if d.isoweekday() == 1:
            return d - timedelta(days=3)
        return d - timedelta(days=1)

    @staticmethod
    def get_last_day() -> date:
        d = date.today()
        if d.isoweekday() == 6:
            return d - timedelta(days=1)
        if d.isoweekday() == 7:
            return d - timedelta(days=2)
        return d

    def get_buy_and_end_price(self, invreq_id):
        futures_buy_price, start = self.goods_dao.get_buy_price(invreq_id)
        start = self.next_day(start)
        end = self.get_last_day()
        futures_end_price = {}
        day = []
        n = 0
        for future in futures_buy_price:
            day, futures_end_price[future] = self.get_goods_daily_price(future, start, end)
            n = len(day)

        return futures_buy_price, futures_end_price, n, day

    def get_residual_analysis(self, invreq_id):
        weight = self.goods_dao.get_goods_weight(invreq_id)
        futures_buy_price, futures_end_price, n, day = self.get_buy_and_end_price(invreq_id)
        bonus_ratio = self.calc_bonus_ratio(futures_end_price, futures_buy_price)
        total_income_ratio = self.calc_total_income_ratio(weight, n, bonus_ratio)
        residual, kurt, skew = self.analyze_residual(total_income_ratio, n, day)
        residual_list = []
        for i in range(n):
            residual_list.append({'date': day[i].strftime('%F'),
                                  'residual': residual[i]})
        return {'residualList': residual_list,
                'kurt': kurt,
                'skew': skew}

    def get_return_ratio(self, start: date, end: date, weight: Dict[str, float]):
        price1 = 0.0
        price2 = 0.0
        for future in weight:
            price1 += self.goods_dao.get_goods_price(future, start) * weight[future]
            price2 += self.goods_dao.get_goods_price(future, end) * weight[future]
        return (price2 - price1) / price1

    @staticmethod
    def get_interval_max_drawdown(my_fund: List[float]):
        max_drawdown = (my_fund[0] - my_fund[1]) / my_fund[0]
        max_fund = my_fund[0]
        for i in range(1, len(my_fund)):
            max_drawdown = max(max_drawdown, (max_fund - my_fund[i]) / max_fund)
            max_fund = max(max_fund, my_fund[i])
        return max_drawdown

    @staticmethod
    def calc_combined_price(weight: Dict[str, float], futures_end_price: Dict[str, List[float]], n: int):
        my_fund_price = []
        for i in range(n):
            price = 0.0
            for future in weight:
                price += futures_end_price[future][i] * weight[future]
            my_fund_price.append(price)
        return my_fund_price

    def get_goods_daily_price(self, name: str, start: date, end: date):
        day = []
        price = []
        d = start
        while d <= end:
            day.append(d)
            price.append(self.goods_dao.get_goods_price(name, d))
            d = self.next_day(d)
        return day, price

    @staticmethod
    def calc_daily_return_ratio(my_fund: List[float]):
        daily_return_ratio = []
        for i in range(1, len(my_fund)):
            daily_return_ratio.append((my_fund[i] - my_fund[i - 1]) / my_fund[i - 1])
        return daily_return_ratio

    def calc_memorabilia_data(self, start: date, end: date, weight: Dict[str, float]):
        futures_end_price = {}
        n = 0
        for future in weight:
            d, futures_end_price[future] = self.get_goods_daily_price(future, start, end)
            n = len(d)
        my_fund_price = self.calc_combined_price(weight, futures_end_price, n)

        daily_return_ratio = self.calc_daily_return_ratio(my_fund_price)

        nanhua_price1 = self.goods_dao.get_goods_price('nanhua', start)
        nanhua_price2 = self.goods_dao.get_goods_price('nanhua', end)
        nanhua_market_ratio = (nanhua_price2 - nanhua_price1) / nanhua_price1

        return self.get_return_ratio(start, end, weight), self.get_interval_max_drawdown(my_fund_price), np.array(
            daily_return_ratio).std(), nanhua_market_ratio

    def get_memorabilia(self, invreq_id):
        from bl.goods import history_date
        weight = self.goods_dao.get_goods_weight(invreq_id)
        data = []
        for scene in history_date:
            start = history_date[scene][0]
            end = history_date[scene][1]
            return_ratio, max_drawdown, fluctuation, nanhua_market_ratio = self.calc_memorabilia_data(start, end,
                                                                                                      weight)
            data.append({'scene': scene,
                         'startDate': start.strftime('%F'),
                         'endDate': end.strftime('%F'),
                         'returnRatio': return_ratio,
                         'maxDrawdown': max_drawdown,
                         'fluctuation': fluctuation,
                         'nanhuaMarketRatio': nanhua_market_ratio})
        return {'memorabilia': data}

    def get_goods_overview(self, invreq_id):
        from factory.DaoFactory import goodsDao
        overview = self.goods_dao.get_overview(invreq_id)
        future_code = goodsDao.get_future_code_of_crude_oil()
        spot_code = goodsDao.get_spot_code_of_crude_oil()
        future_price = goodsDao.get_future_price_of_crude_oil()
        spot_price = goodsDao.get_spot_price_of_crude_oil()
        if future_code not in overview:
            overview[future_code] = (0, 0, date.today(), '原油期货')
        if spot_code not in overview:
            overview[spot_code] = (0, 0, date.today(), '原油现货')
        old_volume = [overview[future_code][0] * overview[future_code][1],
                      overview[spot_code][0] * overview[spot_code][1]]
        current_volume = [future_price * overview[future_code][1], spot_price * overview[spot_code][1]]
        future_overview = {
            'startDate': overview[future_code][2].strftime('%F'),
            'currentVolume': current_volume[0],
            'currentRatio': current_volume[0] / (sum(current_volume) + 0.0000000001) * 100,
            'profit': (current_volume[0] - old_volume[0]) / (old_volume[0] + 0.0000000001) * 100,
            'quotaId': future_code,
            'name': '原油期货',
            'price': future_price,
            'quantity': overview[future_code][1]
        }
        spot_overview = {
            'startDate': overview[spot_code][2].strftime('%F'),
            'currentVolume': current_volume[1],
            'currentRatio': current_volume[1] / (sum(current_volume) + 0.0000000001) * 100,
            'profit': (current_volume[1] - old_volume[1]) / (old_volume[1] + 0.0000000001) * 100,
            'quotaId': spot_code,
            'name': '原油现货',
            'price': spot_price,
            'quantity': overview[spot_code][1]
        }
        overview = {
            'futuresOverview': future_overview,
            'spotOverview': spot_overview
        }
        return overview
