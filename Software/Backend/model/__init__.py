# -*- coding: utf-8 -*-
from model.user.Role import Role
from model.user.User import User
from model.user.ValidationCode import ValidationCode
from model.stock.StockTotalHistory import StockTotalHistory
from model.stock.Csi300 import Csi300
from model.invest.InvestRequirement import InvestRequirement
from model.invest.StockPosition import StockPosition
from model.invest.StockAdvice import StockAdvice
from model.invest.TransactionRecord import TransactionRecord
from model.invest.Advice import Advice
from model.invest.ReallowcationRecord import ReallowcationRecord
from model.invest.Position import Position
from model.invest.InvReqAccountMatchining import InvestRequirementMatchining
from model.notice.Notice import Notice
from model.invest.Profit import Profit
from model.goods.GoodsPrice import GoodsPrice
from model.news.News import News

from run import db

db.create_all()
