from flask_restplus import Resource, fields, Namespace
from datetime import date, timedelta

from jqdatasdk import *

from factory.DaoFactory import stockDao
from factory.DaoFactory import newsDao, marketPriceDao

# 这个文件里的所有API都不需要登录

ns = Namespace('quotation', description="关于市场展示的")

news = ns.model("新闻", {
    "title": fields.String(description="标题"),
    "content": fields.String(description="内容"),
    "time": fields.Date(description="日期"),
})


@ns.route('/news')
@ns.doc("新闻")
class News(Resource):
    @ns.doc("获得所有新闻")
    @ns.response(200, "所有新闻", [news])
    def get(self):
        news = newsDao.get_all_news()
        result = []
        for one in news:
            result.append({'title': one.title, 'content': one.content, 'time': one.time})
        return result, 200
        pass


base_quotation = ns.model("基准市场展示数据结构，用于股票、债券和商品", {
    "time": fields.Date(description="日期"),
    "start": fields.Float(description="开盘价"),
    "max": fields.Float(description="最高价"),
    "min": fields.Float(description="最低价"),
    "end": fields.Float(description="收盘价"),
    "volume": fields.Float(description="成交量"),
    "money": fields.Float(description="钱数")
})

stock_quotation_detail = ns.model("一支股票的具体标的的信息", {
    "quotaId": fields.String(description="标的合约代码"),
    "quotaName": fields.String(description="标的名称"),
    "currentVolume": fields.Float(description="现价"),
    "rising": fields.Float(description="涨幅，百分比，95%为95，下同，可谓负数"),
    "upAndDown": fields.Float(description="涨跌。是个小数，不知道什么意思"),
    "todayPrice": fields.Float(description="今日开盘价"),
    "yesterdayPrice": fields.Float(description="昨日收盘价"),
    "highest": fields.Float(description="今日最高"),
    "lowest": fields.Float(description="今日最低"),
    "totalVolume": fields.Float(description="总成交额"),
    "totalQuantity": fields.Float(description="总成交量"),
    "history": fields.List(fields.Nested(base_quotation), description="本支股票的历史记录")
})


@ns.route('/stock/<quota_id>')
class StockDetail(Resource):
    @ns.doc("获得一支股票的具体标的的信息")
    @ns.response(200, "股票标的信息", stock_quotation_detail)
    def get(self, quota_id: str):
        auth('18724008366', 'JoinQuantPass!')
        end_date = date.today() + timedelta(days=1)
        start_date = date.today() - timedelta(days=1)
        price = get_price(quota_id, start_date=str(start_date), end_date=str(end_date), frequency='minute',
                          skip_paused=False, fq='pre')

        yesterday_end_time = str(start_date) + " 15:00:00"
        today_start_time = str(end_date) + " 09:31:00"

        if len(price) > 0:
            open_list = list(price['open'])
            close_list = list(price['close'])
            high_list = list(price['high'])
            low_list = list(price['low'])
            volume_list = list(price['volume'])
            money_list = list(price['money'])

            open = 0
            close = 0
            high = 0
            low = 0
            volume = 0
            money = 0

            if len(open_list) > 0:
                money = money_list[len(money_list) - 1]
                volume = volume_list[len(money_list) - 1]
                low = low_list[len(money_list) - 1]
                high = high_list[len(money_list) - 1]
                close = close_list[len(money_list) - 1]
                open = open_list[len(money_list) - 1]
            yesterday_end_price = price['close'][yesterday_end_time]
            today_start_price = price['open'][today_start_time]

            up_or_down = 0
            delta = 0
            if open > yesterday_end_price:
                up_or_down = 1  # 上涨
                if (open != 'NAN' and yesterday_end_price != 'NAN'):
                    delta = open - yesterday_end_price / yesterday_end_price
            else:
                up_or_down = -1  # 下跌
                if (open != 'NAN' and yesterday_end_price != 'NAN'):
                    delta = yesterday_end_price - open / yesterday_end_price
            name = stockDao.get_stock_name(quota_id)

            historyArr = []
            indexs = price.index
            for i in range(len(open_list)):
                temp = {"time": indexs[i], "start": open_list[i], "end": close_list[i],
                        "max": high_list[i], "min": low_list[i], "volumn": volume_list[i], "money": money_list[i]}
                historyArr.append(temp)

            return {"quotaId": quota_id,
                    "quotaName": name,
                    "currentVolumn": open,
                    "rising": delta,
                    "upAndDown": up_or_down,
                    "todayPrice": today_start_price,
                    "yesterdayPrice": yesterday_end_price,
                    "highest": high,
                    "lowest": low,
                    "todayVolumn": money,
                    "todayQuantity": volume,
                    "history": historyArr
                    }, 200
        else:
            return {"quotaId": quota_id,
                    "quotaName": stockDao.get_stock_name(quota_id),
                    "currentVolumn": 0,
                    "rising": 0,
                    "upAndDown": 0,
                    "todayPrice": 0,
                    "yesterdayPrice": 0,
                    "highest": 0,
                    "lowest": 0,
                    "todayVolumn": 0,
                    "todayQuant": []
                    }
        pass


@ns.route('/stock')
class Stock(Resource):
    @ns.doc("获得股票市场表现")
    @ns.response(200, "市场表现数据", [base_quotation])
    def get(self):
        return marketPriceDao.get_300_index(), 200
        pass


@ns.route('/bond')
class Bond(Resource):
    @ns.doc("获得债券市场表现")
    @ns.response(200, "市场表现数据", [base_quotation])
    def get(self):
        return marketPriceDao.get_national_debt(), 200
        pass


@ns.route('/goods')
class Goods(Resource):
    @ns.doc("获得商品市场表现")
    @ns.response(200, "市场表现数据", [base_quotation])
    def get(self):
        return marketPriceDao.get_enterprise_bond(), 200
        pass
