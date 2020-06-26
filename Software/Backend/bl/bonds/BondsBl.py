import math
from datetime import datetime, timedelta

import pandas as pd
from factory import DaoFactory
from scipy.optimize import fsolve


class BondsBl(object):
	def __init__(self):
		self.bonds_dao = DaoFactory.bondsDao

	"""
	第一部分
	主要是动态调整和生成方案
	"""

	# util method
	def get_bonds_result(self, target_df, time_bond, invest_bond):
		result = []
		
		current_date = datetime.now()
		delta = timedelta(days = 365) * time_bond
		for i in range(target_df.__len__()):
			expired_date = datetime.strptime(target_df[i][1], "%Y/%m/%d")

			# 如果可以买入
			if current_date + delta > expired_date > current_date:
				number_bonds = math.floor(invest_bond / target_df[i][3])
				result.append(target_df[i][4])  # 收益率
				result.append(datetime.now().strftime('%Y/%m/%d'))
				result.append(target_df[i][0])
				result.append(number_bonds)

				break

		return result[0], pd.DataFrame(result[1: 4], index = ['Time', 'ID', 'number'])

	# 信用债
	# 返回实际收益率RealGainInterestBond以及债券购买表InterestBondPurchase,
	# 后者是个dataframe
	def get_creditbonds(self, invest_bond, gain_interest_bond, risk_interest_bond: float, time_bond):
		# 信用指标筛选
		# return self.bonds_dao.get_credit_debt()
		creditbonds_total = self.bonds_dao.get_credit_debt()

		# check interest rate —— index 1
		if risk_interest_bond <= 0.01:
			possible_bonds1 = [item for item in creditbonds_total if item[1] == 'AAA']
		elif risk_interest_bond < 0.05:
			possible_bonds1 = [item for item in creditbonds_total if item[1] == 'AAA' or item[1] == 'AA+']
		else:
			possible_bonds1 = [item for item in creditbonds_total if
			                   item[1] == 'AAA' or item[1] == 'AA+' or item[1] == 'AA']
		pb1 = pd.DataFrame(possible_bonds1,
		                   columns = ['证券代码', '最新债项评级', '到期日期', '票面利率(发行时)', '收盘价', '资产负债率', '现金流量比', '估价收益率',
		                              '估价收益久期'])

		if risk_interest_bond >= 0.05:
			possible_bonds2 = [item for item in creditbonds_total if item[5] < 70.0]
		else:
			possible_bonds2 = [item for item in creditbonds_total if item[5] < 65.0]
		pb2 = pd.DataFrame(possible_bonds2,
		                   columns = ['证券代码', '最新债项评级', '到期日期', '票面利率(发行时)', '收盘价', '资产负债率', '现金流量比', '估价收益率',
		                              '估价收益久期'])

		pb3 = pd.merge(pb1[['证券代码', '到期日期', '最新债项评级', '票面利率(发行时)']],
		               pb2[['证券代码', '收盘价', '资产负债率', '现金流量比', '估价收益率', '估价收益久期']], on = '证券代码')
		pb3 = pb3[pb3.现金流量比 > 0]

		pb3['f_val'] = pb3['估价收益率'].rank(ascending = False, method = 'min')
		pb3['s_val'] = pb3['估价收益久期'].rank(ascending = True, method = 'min')
		weight_index = gain_interest_bond / risk_interest_bond
		pb3['mixed_rank'] = pb3['f_val'] * weight_index + pb3['s_val']
		pb3['final_rank'] = pb3['mixed_rank'].rank(ascending = True, method = 'min')

		pb4 = pb3.sort_values(by = 'final_rank').drop(['最新债项评级', '资产负债率', '现金流量比'], axis = 1)

		print(pb4.values[0])
		# print(pb4.drop(['final_rank', 'mixed_rank', 'f_val', 's_val'], axis = 1))

		return self.get_bonds_result(pb4.values, time_bond, invest_bond)

	# 此处利率债=国债
	# 返回值同上
	def ged_interestbonds(self, invest_bond, gain_interest_bond, risk_interest_bond: float, time_bond):

		interestbonds_total = pd.DataFrame(self.bonds_dao.get_interest_bonds(),
		                                   columns = ['证券代码', '到期日期', '票面利率', '收盘价', '估价收益率', '估价收益久期'])

		interestbonds_total['f_val'] = interestbonds_total['估价收益率'].rank(ascending = False, method = 'min')
		interestbonds_total['s_val'] = interestbonds_total['估价收益久期'].rank(ascending = True, method = 'min')
		weight_index = gain_interest_bond / risk_interest_bond
		interestbonds_total['mixed_rank'] = interestbonds_total['f_val'] * weight_index + interestbonds_total['s_val']
		interestbonds_total['final_rank'] = interestbonds_total['mixed_rank'].rank(ascending = True, method = 'min')

		after_filter = interestbonds_total.sort_values(by = 'final_rank').values

		return self.get_bonds_result(after_filter, time_bond, invest_bond)

	"""
	第二部分
	主要是展示方案
	v0.1	此部分的接口参数有些可能要改为向数据库取
	"""

	# 2.1 Get profit
	# start_time & end time是债券自身的属性，years是债券持有时间
	def get_profit(self, par_value, coupon, bonds_buy_price, start_time, end_time):
		n_years = end_time - start_time

		result = fsolve(lambda x: ((1 + x[0]) ** n_years * bonds_buy_price) - par_value - (coupon / x[0]) * (
				(1 + x[0]) ** n_years - 1), [2])

		return result

	# 2.2 风险评估
	def risk_evaluation(self, par_value, coupon, start_time, end_time, interest_rate):
		n_years = end_time - start_time
		# i
		profit_rate = self.get_profit(par_value, coupon, start_time, end_time)
		# v
		v_value = 1 / (1 + profit_rate)
		# a n拔|i
		equal_annuity = (1 - (1 + profit_rate) ** (-n_years)) / profit_rate
		# la n拔|i
		incremental_annuity = (equal_annuity * (1 + profit_rate) - n_years * v_value ** n_years) / profit_rate

		Fr = par_value * interest_rate
		Cvn = coupon * v_value ** n_years
		target_value = (Fr * incremental_annuity + Cvn * n_years) / (Fr * equal_annuity + Cvn)
		return target_value

	# 基金中债券的列表信息，xx基金是我们自己构造的债券组合
	def cal_dynamic_retracement_and_absolute_return(self, names: [], ratio: [], dates: [], prices: [], net_worths: []):
		max_return_rate = 0  # 收益率
		max_retracement_rate = 0  # 回撤率

		retracement_rate = []

		for i in range(1, names.__len__()):

			temp = (net_worths[i - 1] - net_worths[i]) / net_worths[i - 1]
			retracement_rate.append(temp)

			if temp > max_retracement_rate:
				max_retracement_rate = temp

# result = BondsBl().get_creditbonds(5000, 0.25, 0.01, 2)
# print(result)
