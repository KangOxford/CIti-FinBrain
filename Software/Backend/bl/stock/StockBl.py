from datetime import date, timedelta

import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score

from factory import DaoFactory
from publicdata.MarketState import MarketState
from utils import DateUtil


class StockBl(object):
    def __init__(self):
        self.stock_dao = DaoFactory.stockDao
        self.invest_dao = DaoFactory.investDao

    def calculate_max_back(self, input_list: []):
        max_back = 0
        now_max_back = 0
        is_now_max_back = False
        max_start_index = 0
        max_end_index = 0
        max_back_return_index = 0
        start_index = 0
        start_value = input_list[0]
        last_value = start_value
        for i in range(1, input_list.__len__()):
            if input_list[i] <= last_value:
                now_max_back = input_list[i] - start_value
                last_value = input_list[i]
                is_now_max_back = False
            else:
                if not is_now_max_back:
                    if max_back > is_now_max_back:
                        max_back = now_max_back
                        max_start_index = start_index
                        max_end_index = i - 1
                start_index = i
                start_value = input_list[i]
        for i in range(max_end_index, input_list.__len__()):
            if input_list[i] >= input_list[max_start_index]:
                max_back_return_index = i - max_end_index
                break
        max_back_start_date = date(2016, 9, 1) + timedelta(max_start_index)
        max_back_end_date = date(2016, 9, 1) + timedelta(max_end_index)
        return max_back, max_back_start_date, max_back_end_date, max_back_return_index

    def calculate_quarter_regression(self, big_growg, big_worthg, mid_growg, mid_worthg, small_growg,
                                     small_worthg, myfundg):
        style_ratio = []
        styleg = []
        r_2 = []

        for i in range(np.math.floor(big_growg.__len__() / 90)):
            index = i * 90
            big_growg_block = big_growg[index:index + 90]
            big_worthg_block = big_worthg[index:index + 90]
            mid_growg_block = mid_growg[index:index + 90]
            mid_worthg_block = mid_worthg[index:index + 90]
            small_growg_block = small_growg[index:index + 90]
            small_worthg_block = small_worthg[index:index + 90]
            myfundg_block = myfundg[index:index + 90]
            train_x = []
            train_x.append(big_growg_block)
            train_x.append(big_worthg_block)
            train_x.append(mid_growg_block)
            train_x.append(mid_worthg_block)
            train_x.append(small_growg_block)
            train_x.append(small_worthg_block)
            train_x = np.transpose(train_x)
            train_y = myfundg_block
            linreg = LinearRegression()
            linreg.fit(train_x, train_y)
            power = linreg.coef_
            power.__add__(linreg.intercept_)
            style_ratio.append(power)
            pred = linreg.predict(train_x)
            for day_data in pred:
                styleg.append(day_data)
            r_2.append(r2_score(train_y, pred))
        return style_ratio, styleg, r_2

    def transform_list_with_date(self, list_with_date: []):
        result = []
        for i in range(list_with_date.__len__()):
            result.append(list_with_date[i][1])
        return result

    def get_achievement(self, req_id):
        stocks, numbers = self.invest_dao.get_stock_position(req_id)
        ratios = np.array(numbers) / np.array(numbers).sum()
        start_date = date(2016, 9, 1)
        end_date = date(2018, 6, 1)
        stocks_price = []
        for stock in stocks:
            _, values = self.stock_dao.get_stock_period_price(stock, start_date, end_date)
            for i in range(values.__len__()):
                if np.isnan(values[i]):
                    values[i] = 0
            stocks_price.append(values)
        myfund = []
        for i in range(stocks_price[0].__len__()):
            fund = 0
            for j in range(stocks_price.__len__()):
                fund += stocks_price[j][i] * ratios[j]
            myfund.append(fund)
        base_300 = self.transform_list_with_date(self.stock_dao.get_csi_300(start_date, end_date))
        base_300g = [0]
        myfundg = [0]
        for i in range(base_300.__len__() - 1):
            base_300g.append((base_300[i + 1] - base_300[i]) / base_300[i])
        for i in range(myfund.__len__() - 1):
            myfundg.append((myfund[i + 1] - myfund[i]) / myfund[i])
        revenueg = []
        for i in range(myfundg.__len__()):
            revenueg.append(myfundg[i] - base_300g[i])
        revenuem = []
        for i in range(np.math.floor(revenueg.__len__() / 30)):
            index = i * 30
            month_revenueg = np.average(myfundg[index:index + 30])
            revenuem.append(month_revenueg)
        revenueq = []
        for i in range(np.math.floor(revenueg.__len__() / 90)):
            index = i * 90
            quarter_revenueg = np.average(myfundg[index:index + 90])
            revenueq.append(quarter_revenueg)
        revenue = []
        for i in range(myfund.__len__()):
            revenue.append(myfund[i] - base_300[i])
        back = []
        for i in range(revenue.__len__()):
            max_revenue = max(revenue[0:i + 1])
            value = (revenue[i] - max_revenue) / max_revenue
            if value < 0:
                value = 0
            back.append(value)

        # 开始设置返回值
        chart_data = []
        for i in range(revenueg.__len__()):
            chart_data.append({
                'date': DateUtil.get_format_date(start_date + timedelta(i)),
                'returnNum': "%.2f" % revenueg[i],
                'revenueNum': "%.2f" % back[i]
            })
        form_data = []
        for j in range(stocks.__len__()):
            stock_price = self.stock_dao.get_stock_period_price(stocks[j], start_date, end_date)[1]
            stock_priceg = [0]
            for i in range(myfund.__len__() - 1):
                stock_priceg.append((stock_price[i + 1] - stock_price[i]) / stock_price[i])
            stock_revenueg = []
            for i in range(stock_priceg.__len__()):
                stock_revenueg.append(stock_priceg[i] - base_300g[i])
            stock_revenuem = []
            for i in range(np.math.floor(stock_revenueg.__len__() / 30)):
                index = i * 30
                month_stock_revenueg = np.average(stock_revenueg[index:index + 30])
                stock_revenuem.append(month_stock_revenueg)
            stock_winm_num = 0
            for i in range(stock_revenuem.__len__()):
                if stock_revenuem[i] > 0:
                    stock_winm_num += 0
            stock_winm = stock_winm_num * 1.0 / stock_revenuem.__len__()
            stock_revenue = []
            for i in range(stock_price.__len__()):
                stock_revenue.append(stock_price[i] - base_300[i])
            stock_back = []
            for i in range(stock_revenue.__len__()):
                max_revenue = max(stock_revenue[0:i + 1])
                value = (stock_revenue[i] - max_revenue) / max_revenue
                if value < 0:
                    value = 0
                stock_back.append(value)
            stock_max_back, stock_max_back_start_date, stock_max_back_end_date, stock_max_back_return_time = self.calculate_max_back(
                stock_back)  # 超额最大回撤,超额最大回撤起开始日,超额最大回撤起终止日,超额最大回撤回补日
            form_data.append({
                'quotaName': stocks[j],  # 名称
                'period': 7,  # 周期数：月
                'totalRevenue': stock_max_back,  # 超额累计回撤率：百分比
                'monthly': stock_winm,  # 月胜率：百分比
                'maxReturn': "%.2f" % sum(stock_revenueg),  # 超额最大回撤率：百分比
                'maxReturnBegin': DateUtil.get_format_date(stock_max_back_start_date),  # 超额最大回撤起始日期：date
                'maxReturnEnd': DateUtil.get_format_date(stock_max_back_end_date),  # 超额最大回撤结束日期：date
                'maxReturnSupplement': stock_max_back_return_time  # 超额最大回撤补期：天
            })
        return {
            'chartData': chart_data,
            'formData': form_data
        }

    def get_reason(self, req_id):
        stocks, numbers = self.invest_dao.get_stock_position(req_id)
        stocks = ["002495.XSHE", "603189.XSHG"]
        numbers = [200, 100]
        ratios = np.array(numbers) / np.array(numbers).sum()
        start_date = date(2016, 9, 1)
        end_date = date(2018, 6, 1)
        base_300 = self.stock_dao.get_csi_300(start_date, end_date)
        big_grow = self.stock_dao.get_big_grow(start_date, end_date)
        big_worth = self.stock_dao.get_big_worth(start_date, end_date)
        mid_grow = self.stock_dao.get_mid_grow(start_date, end_date)
        mid_worth = self.stock_dao.get_mid_worth(start_date, end_date)
        small_grow = self.stock_dao.get_small_grow(start_date, end_date)
        small_worth = self.stock_dao.get_small_worth(start_date, end_date)
        stocks_price = []
        for stock in stocks:
            _, values = self.stock_dao.get_stock_period_price(stock, start_date, end_date)
            for i in range(values.__len__()):
                if np.isnan(values[i]):
                    values[i] = 0
            stocks_price.append(values)
        myfund = []
        for i in range(stocks_price[0].__len__()):
            fund = 0
            for j in range(stocks_price.__len__()):
                fund += stocks_price[j][i] * ratios[j]
            myfund.append(fund)
        base_300g = [0]
        myfundg = [0]
        big_growg = [0]
        big_worthg = [0]
        mid_growg = [0]
        mid_worthg = [0]
        small_growg = [0]
        small_worthg = [0]
        for i in range(base_300.__len__() - 1):
            base_300g.append((base_300[i + 1][1] - base_300[i][1]) / base_300[i][1])
        for i in range(myfund.__len__() - 1):
            myfundg.append((myfund[i + 1] - myfund[i]) / myfund[i])
        for i in range(big_grow.__len__() - 1):
            big_growg.append((big_grow[i + 1] - big_grow[i]) / big_grow[i])
        for i in range(big_worth.__len__() - 1):
            big_worthg.append((big_worth[i + 1] - big_worth[i]) / big_worth[i])
        for i in range(mid_grow.__len__() - 1):
            mid_growg.append((mid_grow[i + 1] - mid_grow[i]) / mid_grow[i])
        for i in range(mid_worth.__len__() - 1):
            mid_worthg.append((mid_worth[i + 1] - mid_worth[i]) / mid_worth[i])
        for i in range(small_grow.__len__() - 1):
            small_growg.append((small_grow[i + 1] - small_grow[i]) / small_grow[i])
        for i in range(small_worth.__len__() - 1):
            small_worthg.append((small_worth[i + 1] - small_worth[i]) / small_worth[i])
        style_ratio, styleg, r_2 = self.calculate_quarter_regression(big_growg, big_worthg, mid_growg, mid_worthg,
                                                                     small_growg,
                                                                     small_worthg, myfundg)
        style_timing = []
        for i in range(styleg.__len__()):
            style_timing.append(styleg[i] - base_300g[i])
        style_timingq = []
        for i in range(np.math.floor(style_timing.__len__() / 90)):
            index = i * 90
            quarter_sum = np.sum(style_timing[index:index + 90])
            style_timingq.append(quarter_sum)
        style_choose = []
        for i in range(styleg.__len__()):
            style_choose.append(myfundg[i] - styleg[i])
        style_chooseq = []
        for i in range(np.math.floor(style_choose.__len__() / 90)):
            index = i * 90
            quarter_sum = np.sum(style_choose[index:index + 90])
            style_chooseq.append(quarter_sum)
        fund_over = []
        for i in range(style_choose.__len__()):
            sum = 0
            for j in range(0, i):
                sum += style_choose[j]
            fund_over.append(sum)
        fund_baseover = []
        for i in range(style_timing.__len__()):
            sum = 0
            for j in range(0, i):
                sum += style_timing[j]
            fund_baseover.append(sum)
        plus_count = 0
        for i in range(style_timingq.__len__()):
            if style_timingq[i] > 0:
                plus_count += 1
        style_timingw = plus_count * 1.0 / style_timingq.__len__()
        plus_count = 0
        for i in range(style_chooseq.__len__()):
            if style_chooseq[i] > 0:
                plus_count += 1
        style_choosew = plus_count * 1.0 / style_chooseq.__len__()
        style_timingr = fund_baseover[fund_baseover.__len__() - 1] / 630 * 365 * 100
        style_chooser = fund_over[fund_over.__len__() - 1] / 630 * 365 * 100
        dateq = ['2016Q4', '2017Q1', '2017Q2', '2017Q3', '2017Q4', '2018Q1', '2018Q2', '2018Q3']
        base_ratio, _, _ = self.calculate_quarter_regression(big_growg, big_worthg, mid_growg, mid_worthg, small_growg,
                                                             small_worthg, base_300g)
        time_over = []
        time_below = []
        for i in range(base_ratio[0].__len__()):
            over_num = 0
            below_num = 0
            for j in range(base_ratio.__len__()):
                if base_ratio[j][i] < style_ratio[j][i]:
                    over_num += 1
                elif base_ratio[j][i] > style_ratio[j][i]:
                    below_num += 1
            time_over.append(over_num)
            time_below.append(below_num)

        # 开始设置返回值
        style_config_form = [{
            'style': "风格择时贡献",
            'winRate': style_timingw,
            'yearRevenue': "%.2f" % style_timingr,
        }, {
            'style': "风格择时贡献",
            'winRate': style_choosew,
            'yearRevenue': "%.2f" % style_chooser,
        }]
        style_explain_form = []
        for i in range(r_2.__len__()):
            style_explain_form.append({
                'season': dateq[i],
                'rSquare': "%.2f" % r_2[i],
            })
        prefer_and_contr_list = []
        sum_style_ratios = []
        for i in range(style_ratio[0].__len__()):
            temp_sum = 0
            for j in range(style_ratio.__len__()):
                temp_sum += style_ratio[j][i]
            sum_style_ratios.append(temp_sum * 1.0 / style_ratio.__len__())
        prefer_and_contr_list.append({
            'style': "平均持仓",
            'largeGrowth': "%.2f" % sum_style_ratios[0],
            'largeValue': "%.2f" % sum_style_ratios[1],
            'middleGrowth': "%.2f" % sum_style_ratios[2],
            'middleValue': "%.2f" % sum_style_ratios[3],
            'smallGrowth': "%.2f" % sum_style_ratios[4],
            'smallValue': "%.2f" % sum_style_ratios[5]
        })
        prefer_and_contr_list.append({
            'style': "平均超额收益率",
            'largeGrowth': "%.2f" % (np.average(big_growg) / 630 * 365),
            'largeValue': "%.2f" % (np.average(big_worthg) / 630 * 365),
            'middleGrowth': "%.2f" % (np.average(mid_growg) / 630 * 365),
            'middleValue': "%.2f" % (np.average(mid_worthg) / 630 * 365),
            'smallGrowth': "%.2f" % (np.average(small_growg) / 630 * 365),
            'smallValue': "%.2f" % (np.average(small_worthg) / 630 * 365)
        })
        prefer_and_contr_list.append({
            'style': "超配次数",
            'largeGrowth': time_over[0],
            'largeValue': time_over[1],
            'middleGrowth': time_over[2],
            'middleValue': time_over[3],
            'smallGrowth': time_over[4],
            'smallValue': time_over[5]
        })
        prefer_and_contr_list.append({
            'style': "低配次数",
            'largeGrowth': time_below[0],
            'largeValue': time_below[1],
            'middleGrowth': time_below[2],
            'middleValue': time_below[3],
            'smallGrowth': time_below[4],
            'smallValue': time_below[5]
        })

        style_config_chart = []
        for i in range(style_timingq.__len__()):
            style_config_chart.append({
                'date': dateq[i],
                'styleTiming': style_timingq[i] * 100,
                'styleChoosing': style_chooseq[i] * 100,
                'fundOver': fund_over[i] * 100,
                'fundBaseOver': fund_baseover[i] * 100
            })
        return {
            'styleConfigChart': style_config_chart,
            'styleConfigForm': style_config_form,
            'styleExplainForm': style_explain_form,
            'preferAndContributionChart': prefer_and_contr_list
        }

    def get_scene(self, req_id):
        stocks, numbers = self.invest_dao.get_stock_position(req_id)
        ratios = np.array(numbers) / np.array(numbers).sum()
        start_date = date(2016, 9, 1)
        end_date = date(2018, 6, 1)
        stocks_price = []
        for stock in stocks:
            _, values = self.stock_dao.get_stock_period_price(stock, start_date, end_date)
            for i in range(values.__len__()):
                if np.isnan(values[i]):
                    values[i] = 0
            stocks_price.append(values)
        if stocks_price.__len__() == 0:
            return []
        myfund = []
        for i in range(stocks_price[0].__len__()):
            fund = 0
            for j in range(stocks_price.__len__()):
                fund += stocks_price[j][i] * ratios[j]
            myfund.append(fund)
        base_300 = self.transform_list_with_date(self.stock_dao.get_csi_300(start_date, end_date))
        base_300g = [0]
        myfundg = [0]
        for i in range(base_300.__len__() - 1):
            base_300g.append((base_300[i + 1] - base_300[i]) / base_300[i])
        for i in range(myfund.__len__() - 1):
            myfundg.append((myfund[i + 1] - myfund[i]) / myfund[i])

        start_date = date(2016, 9, 1)
        end_date = date(2018, 6, 1)
        big = self.stock_dao.get_big_worth(start_date, end_date)
        small = self.stock_dao.get_small_worth(start_date, end_date)
        bigg = [0]
        smallg = [0]
        for i in range(big.__len__() - 1):
            bigg.append((big[i + 1] - big[i]) / big[i])
        for i in range(small.__len__() - 1):
            smallg.append((small[i + 1] - small[i]) / small[i])
        market = []
        for i in range(np.math.floor(base_300g.__len__() / 30)):
            index = i * 30
            month_sum = np.sum(base_300g[index:index + 30])
            market.append(month_sum)
        biggm = []
        for i in range(np.math.floor(bigg.__len__() / 30)):
            index = i * 30
            month_sum = np.sum(bigg[index:index + 30])
            biggm.append(month_sum)
        smallgm = []
        for i in range(np.math.floor(smallg.__len__() / 30)):
            index = i * 30
            month_sum = np.sum(smallg[index:index + 30])
            smallgm.append(month_sum)
        sign = []
        for i in range(biggm.__len__()):
            sign.append(biggm[i] - smallgm[i])
        myfundgm = []
        for i in range(np.math.floor(bigg.__len__() / 30)):
            index = i * 30
            month_sum = np.sum(myfundg[index:index + 30])
            myfundgm.append(month_sum)
        rf = self.stock_dao.get_risk_free_rate()
        market_up_and_big_up = 0
        market_up_and_big_up_num = 0
        market_up_and_big_up_list = []
        market_down_and_big_up = 0
        market_down_and_big_up_num = 0
        market_down_and_big_up_list = []
        market_up_and_small_up = 0
        market_up_and_small_up_num = 0
        market_up_and_small_up_list = []
        market_down_and_small_up = 0
        market_down_and_small_up_num = 0
        market_down_and_small_up_list = []
        myfundgm_sum = 0
        max_back_market_up_and_big_up = 0
        max_back_market_down_and_big_up = 0
        max_back_market_up_and_small_up = 0
        max_back_market_down_and_small_up = 0
        for i in range(myfundgm.__len__()):
            if market[i] > 0 and sign[i] > 0:
                market_up_and_big_up_num += 1
                market_up_and_big_up += myfundgm[i]
                market_up_and_big_up_list.append(myfundgm[i])
                for j in range(30 * (i - 1), 30 * i):
                    for k in range(0, j):
                        this_back = (myfund[k] - myfund[j]) / myfund[j]
                        if this_back > max_back_market_up_and_big_up:
                            max_back_market_up_and_big_up = this_back
            elif market[i] < 0 < sign[i]:
                market_down_and_big_up_num += 1
                market_down_and_big_up += myfundgm[i]
                market_down_and_big_up_list.append(myfundgm[i])
                for j in range(30 * (i - 1), 30 * i):
                    for k in range(0, j):
                        this_back = (myfund[k] - myfund[j]) / myfund[j]
                        if this_back > max_back_market_down_and_big_up:
                            max_back_market_down_and_big_up = this_back
            elif market[i] > 0 > sign[i]:
                market_up_and_small_up_num += 1
                market_up_and_small_up += myfundgm[i]
                market_up_and_small_up_list.append(myfundgm[i])
                for j in range(30 * (i - 1), 30 * i):
                    for k in range(0, j):
                        this_back = (myfund[k] - myfund[j]) / myfund[j]
                        if this_back > max_back_market_up_and_small_up:
                            max_back_market_up_and_small_up = this_back
            elif market[i] < 0 and sign[i] < 0:
                market_down_and_small_up_num += 1
                market_down_and_small_up += myfundgm[i]
                market_down_and_small_up_list.append(myfundgm[i])
                for j in range(30 * (i - 1), 30 * i):
                    for k in range(0, j):
                        this_back = (myfund[k] - myfund[j]) / myfund[j]
                        if this_back > max_back_market_down_and_small_up:
                            max_back_market_down_and_small_up = this_back
            myfundgm_sum += myfundgm[i]
        market_up_and_big_up_rate = market_up_and_big_up / myfundgm_sum
        market_down_and_big_up_rate = market_down_and_big_up / myfundgm_sum
        market_up_and_small_up_rate = market_up_and_small_up / myfundgm_sum
        market_down_and_small_up_rate = market_down_and_small_up / myfundgm_sum

        volatility_market_up_and_big_up = np.std(market_up_and_big_up_list)
        volatility_market_down_and_big_up = np.std(market_down_and_big_up_list)
        volatility_market_up_and_small_up = np.std(market_up_and_small_up_list)
        volatility_market_down_and_small_up = np.std(market_down_and_small_up_list)
        sharpe_ratio_market_up_and_big_up = (market_up_and_big_up - rf) / volatility_market_up_and_big_up
        sharpe_ratio_market_down_and_big_up = (market_down_and_big_up - rf) / volatility_market_down_and_big_up
        sharpe_ratio_market_up_and_small_up = (market_up_and_small_up - rf) / volatility_market_up_and_small_up
        sharpe_ratio_market_down_and_small_up = (market_down_and_small_up - rf) / volatility_market_down_and_small_up

        sortino_ratio_market_up_and_big_up = np.std(market_up_and_big_up_list, ddof=1)
        sortino_ratio_market_down_and_big_up = np.std(market_down_and_big_up_list, ddof=1)
        sortino_ratio_market_up_and_small_up = np.std(market_up_and_small_up_list, ddof=1)
        sortino_ratio_market_down_and_small_up = np.std(market_down_and_small_up_list, ddof=1)
        calmar_ratio_market_up_and_big_up = np.average(market_up_and_big_up) / 30 / 365 / max_back_market_up_and_big_up
        calmar_ratio_market_down_and_big_up = np.average(
            market_down_and_big_up) / 30 / 365 / max_back_market_down_and_big_up
        calmar_ratio_market_up_and_small_up = np.average(
            market_up_and_small_up) / 30 / 365 / max_back_market_up_and_small_up
        calmar_ratio_market_down_and_small_up = np.average(
            market_down_and_big_up) / 30 / 365 / max_back_market_down_and_big_up

        fluctuation = []
        for i in range(np.math.floor(myfund.__len__() / 30)):
            index = i * 30
            month_sum = np.std(myfund[index:index + 30])
            fluctuation.append(month_sum)
        get = []
        for i in range(np.math.floor(myfundg.__len__() / 30)):
            index = i * 30
            month_sum = np.average(myfundg[index:index + 30])
            get.append(month_sum)

        average_fluctuation = np.average(fluctuation)
        std_fluctuation = np.std(fluctuation)
        fluctuationf = []
        fluctuationf_2d = []
        for i in range(fluctuation.__len__()):
            fluctuationf.append((fluctuation[i] - average_fluctuation) / std_fluctuation)
            fluctuationf_2d.append([(fluctuation[i] - average_fluctuation) / std_fluctuation])
        average_get = np.average(get)
        std_get = np.std(get)
        getf = []
        getf_2d = []
        for i in range(get.__len__()):
            getf.append((get[i] - average_get) / std_get)
            getf_2d.append([(get[i] - average_get) / std_get])
        # 线性拟合
        line_regression = LinearRegression()
        line_regression.fit(fluctuationf_2d, getf_2d)
        line_pred = line_regression.predict(fluctuationf_2d)
        # 曲线拟合
        poly_fit = np.polyfit(fluctuationf, getf, 3)  # 用3次多项式拟合
        poly = np.poly1d(poly_fit)
        poly_pred = poly(fluctuationf)

        # 开始设置返回值
        market_route_chart = []
        for i in range(market.__len__()):
            if market[i] > 0 and sign[i] > 0:
                market_state = MarketState.OBVIOUS_UP
            elif market[i] < 0 < sign[i]:
                market_state = MarketState.OBVIOUS_DOWN
            elif market[i] > 0 > sign[i]:
                market_state = MarketState.WAVERY_UP
            else:
                market_state = MarketState.WAVERY_DOWN
            market_route_chart.append({
                'date': str(start_date + timedelta(i)),
                'myfund': "%.2f" % myfund[i],
                'marketState': market_state.value
            })
        market_route_form = [{
            'index': '周期数',
            'obviousUp': "%.2f" % market_up_and_big_up_num,
            'waveryUp': "%.2f" % market_down_and_big_up_num,
            'obviousDown': "%.2f" % market_up_and_small_up_num,
            'waveryDown': "%.2f" % market_down_and_small_up_num
        }, {
            'index': '场景收益占比',
            'obviousUp': "%.2f" % market_up_and_big_up_rate,
            'waveryUp': "%.2f" % market_down_and_big_up_rate,
            'obviousDown': "%.2f" % market_up_and_small_up_rate,
            'waveryDown': "%.2f" % market_down_and_small_up_rate
        }, {
            'index': '波动率',
            'obviousUp': "%.2f" % volatility_market_up_and_big_up,
            'waveryUp': "%.2f" % volatility_market_down_and_big_up,
            'obviousDown': "%.2f" % volatility_market_up_and_small_up,
            'waveryDown': "%.2f" % volatility_market_down_and_small_up
        }, {
            'index': '夏普比率',
            'obviousUp': "%.2f" % sharpe_ratio_market_up_and_big_up,
            'waveryUp': "%.2f" % sharpe_ratio_market_down_and_big_up,
            'obviousDown': "%.2f" % sharpe_ratio_market_up_and_small_up,
            'waveryDown': "%.2f" % sharpe_ratio_market_down_and_small_up
        }, {
            'index': '最大回撤率',
            'obviousUp': "%.2f" % max_back_market_up_and_big_up,
            'waveryUp': "%.2f" % max_back_market_down_and_big_up,
            'obviousDown': "%.2f" % max_back_market_up_and_small_up,
            'waveryDown': "%.2f" % max_back_market_down_and_big_up
        }, {
            'index': 'Sortino比率',
            'obviousUp': "%.2f" % sortino_ratio_market_up_and_big_up,
            'waveryUp': "%.2f" % sortino_ratio_market_down_and_big_up,
            'obviousDown': "%.2f" % sortino_ratio_market_up_and_small_up,
            'waveryDown': "%.2f" % sortino_ratio_market_down_and_small_up
        }, {
            'index': 'Calmar比率',
            'obviousUp': "%.2f" % calmar_ratio_market_up_and_big_up,
            'waveryUp': "%.2f" % calmar_ratio_market_down_and_big_up,
            'obviousDown': "%.2f" % calmar_ratio_market_up_and_small_up,
            'waveryDown': "%.2f" % calmar_ratio_market_down_and_small_up
        }]
        sensibility_chart = []
        for i in range(fluctuationf.__len__()):
            sensibility_chart.append({
                'fluctuation': round(fluctuationf[i], 2),
                'lineRevenue': round(line_pred[i][0], 2),
                'curveRevenue': round(poly_pred[i], 2)
            })
        return {
            "marketRouteChart": market_route_chart,
            "marketRouteForm": market_route_form,
            "sensibilityChart": sensibility_chart
        }
