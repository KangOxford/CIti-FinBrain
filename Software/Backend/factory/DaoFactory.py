# -*- coding: utf-8 -*-
from dao.user.UserDao import UserDao
from dao.user.ValidationCodeDao import ValidationCodeDao
from dao.invest.InvestDao import InvestDao
from dao.stock.StockDao import StockDao
from dao.bonds.BondsDao import BondsDao
from dao.goods.GoodsDao import GoodsDao
from dao.recommendation.RecommendationDao import RecommendationDao
from dao.notice.NoticeDao import NoticeDao
from dao.user.ProfitDao import ProfitDao
from dao.market.MarketPriceDao import MarketDao
from dao.goods.GoodsInvestDao import GoodsInvestDao
from dao.news.NewsDao import NewsDao


userDao = UserDao()
validationCodeDao = ValidationCodeDao()
stockDao = StockDao()
bondsDao = BondsDao()
goodsDao = GoodsDao()
investDao = InvestDao()
recommendationDao = RecommendationDao()
noticeDao = NoticeDao()
profitDao = ProfitDao()
marketPriceDao = MarketDao()
goodsInvestDao = GoodsInvestDao()
newsDao = NewsDao()

