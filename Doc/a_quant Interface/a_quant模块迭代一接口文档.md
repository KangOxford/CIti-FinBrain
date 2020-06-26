# A_Quant迭代一接口文档

## 省略的导入部分

```python
from dataclasses import dataclass
from datetime import datetime
from typing import Tuple, List, Dict, Union
from vo import *
```

## 名词表

| 名词         | 定义                                       | 对应类                  |
| ------------ | ------------------------------------------ | ----------------------- |
| 投资需求     | 收益、风险、年限、额度组成的用户投资的偏好 | InvestReq               |
| 交易建议     | 包括股票、基金等的所有买入卖出建议         | TransactionsAdvice      |
| 股票交易建议 | 仅包括股票的买入卖出建议                   | StockTransactionsAdvice |


## 1. 用户注册、登陆以及个人信息的修改（不涉及）

## 2. 股票评价深度分析

### 2.1 系统显示目前市场上股票的概况

`用例 #2` `正常流程-2`

#### 2.1.1 提供的接口

##### a. 接口定义

```python
def get_stock_market_overview() -> Dict[str, Union[PerformanceAnalysis, AttributionAnalysis, ScenarioAnalysis]]:
    """
    展示股票市场的概况
    :return: 包含业绩分析，归因分析和场景分析的字典
    """
    return {
        "performance": PerformanceAnalysis(),
        "attribution": AttributionAnalysis(),
        "scenario": ScenarioAnalysis()
    }
```

##### b. 参数定义

##### c. 返回值定义

- "performance": 业绩分析

  ```python
  @dataclass
  class PerformanceAnalysis:
      pass
  ```

- "attribution": 归因分析

  ```python 
  @dataclass
  class AttributionAnalysis:
      pass
  ```

- "scenario": 场景分析

  ```python
  @dataclass
  class ScenarioAnalysis:
      pass
  ```

##### d. 界面参考

> 可以参考朝阳永续网址：12345fund.com，用户名:E00055196，密码：739508  

![股票行情](D:/Projects/GitHub/FinBrain/static/%E8%82%A1%E7%A5%A8%E8%A1%8C%E6%83%85.png)

![动态回撤与超额收益](D:/Projects/GitHub/FinBrain/static/%E5%8A%A8%E6%80%81%E5%9B%9E%E6%92%A4%E4%B8%8E%E8%B6%85%E9%A2%9D%E6%94%B6%E7%9B%8A.png)

#### 2.1.2 依赖的接口

## 3. 债券评价深度分析（不做）

## 4. 管理期货深度分析（不做）

## 5. 一级市场深度分析（不做）

## 6. 进行资产配置（仅针对股票市场进行资产配置）

### 6.1 用户创建或更新投资需求，得到系统给出的所有的交易建议（暂仅含股票）		

`用例 #6` `正常流程-1`

#### 6.1.1 提供的接口

##### a. 接口定义

```python
def save_invest_req(user_id: str, invreq: InvestReq) -> Dict[str, Union[float, TransactionsAdvice]]:
    """
    用户增加或更新投资需求，系统立即给出交易建议
    :param user_id: 用户id
    :param invreq: 投资需求
    :return: 包含这组交易后的预期收益和交易建议的字典
    """
    return {
        "expect": float(),
        "advice": TransactionsAdvice()
    }
```

##### b. 参数定义

- 用户ID，用一个字符串表示，例如 `'0e210c0b824b'`

- 投资需求，类定义如下所示

  ```python
  @dataclass
  class InvestReq:
      ror_bound: Tuple[float, float]  # 收益率：百分比上下界
      volatility_bound: Tuple[float, float]  # 波动率：百分比上下界
      investment_years: int  # 投资年限
      volume: float  # 投资额: TODO 精度限制
  ```

##### c. 返回值定义

- "expect": 这组交易后的预期收益，例如`1430.40`

- "advice": 所有交易建议

  ```python
  @dataclass
  class StockTransaction:
      date: datetime  # 时间:日期
      stock_code: str  # 股票代码
      stock_name: str  # 股票名称
      price: float  # 买入价格
      quantity: int  # 买入数量
  
  
  @dataclass
  class StockTransactionsAdvice:
      transactions: List[StockTransaction]
      id: str
  
  
  @dataclass
  class TransactionsAdvice:
      s_advice: StockTransactionsAdvice  # 股票市场投资的交易建议
      # TODO 其他资产配置的交易建议
  ```

#### 6.1.2 依赖的接口

### 6.2 用户根据已有投资需求，查看股票市场投资的交易建议

`用例 #6` `正常流程-3`

#### 6.2.1 提供的接口

##### a. 接口定义

```python
def get_stock_invest_advice(invreq_id: str) -> Dict[str, Union[float, TransactionsAdvice]]:
    """
    根据用户的一个投资需求的id，获得该投资需求下，A+Quant所做股票市场投资的一组股票交易建议
    :param invreq_id: 投资需求id
    :return: 包含这组交易后的预期收益和股票交易建议的字典
    """
    return {
        "expect": float(),
        "advice": StockTransactionsAdvice()
    }
```

##### b. 参数定义

- 投资需求ID，用一个字符串表示，例如 `'0e210c0b824b'`

##### c. 返回值定义

- "expect": 这组交易后的预期收益，例如`1430.40`

- "advice": 股票市场投资的交易建议

  ```python
  @dataclass
  class StockTransaction:
      date: datetime  # 时间:日期
      stock_code: str  # 股票代码
      stock_name: str  # 股票名称
      price: float  # 买入价格
      quantity: int  # 买入数量
  
  
  @dataclass
  class StockTransactionsAdvice:
      transactions: List[StockTransaction]
      id: str
  ```

#### 6.2.2 依赖的接口

### 6.3  用户根据已有投资需求，查看股票市场投资的收益表现

`用例 #6` `正常流程-3`

#### 6.3.1 提供的接口

##### a. 接口定义

```python
def get_stock_invest_revenue(invreq_id: str) -> StockRevenue:
    """
    根据用户的一个投资需求的id，获得该投资需求下，A+Quant所做股票市场投资的收益表现
    :param invreq_id: 投资需求id
    :return: 股票市场投资的收益表现
    """
    return StockRevenue()
```

##### b. 参数定义

- 投资需求ID，用一个字符串表示，例如 `'0e210c0b824b'`

##### c. 返回值定义

- 股票市场投资的收益表现，类定义如下

  ```python
  @dataclass
  class StockRevenue:
      accu_revenue: float  # 累计收益:百分率
      max_drawdowm: float  # 最大回撤：百分率
      ror_year: float  # 年化收益:百分率
      start_date: datetime  # 开始时间
      start_volume: float  # 初始资金
  
      # 以下浮点数取值范围为：0~100
      beta: float  # 贝塔
      growth: float  # 成长性
      leverage_ratio: float  # 杠杆率
      liquidity: float  # 流动性
      momentum: float  # 动量
      reversal: float  # 反转
      market_value: float  # 市值
      price: float  # 价值
      volatility: float  # 波动率
      profitability: float  # 盈利性
  
      industry: dict[str:float]  # 版块情况，键为版块名（包括现金），值为百分比
  
      # Brinson 分析
      active_return: float  # 主动收益:浮点，可为负数
      asset_allo: float  # 资产配置
      stock_allo: float  # 选股配置
  ```

#### 6.3.2 依赖的接口

### 6.4 用户查看一支股票的行情

#### 6.4.1 提供的接口

`用例 #6` `扩展流程-1`

##### a. 接口定义

```python
def get_stock_quotation(stockcode: str) -> Dict[str, Union[StockPriceHistory, StockCurInfo]]:
    """
    根据一支股票的代码，获得该股票的行情
    :param stockcode: 股票代码
    :return: 包含股票历史价格列表和股票当前部分信息的字典
    """
    return {
        "history": StockPriceHistory(),
        "current": StockCurInfo()
    }

```

##### b. 参数定义

- 股票代码，用一个字符串表示，例如 `'0384758'`

##### c. 返回值定义

- "history": 股票历史价格

  ```python
  @dataclass
  class StockPriceHistory:
      # 用于画K线图
      date: datetime  # 日期：哪天的价格
      max_price: float  # 最高价
      min_price: float  # 最低价
      opening: float  # 开盘价
      closing: float  # 收盘价
      change: float  # 涨跌额
      chg: float  # 涨跌幅：百分数，大小一般不超过10%
      volume: float  # 成交量
  ```

- "current": 股票当前部分信息

  ```python
  @dataclass
  class StockCurInfo:
      # 当日部分信息
      market_cap: float  # 市值
      opening: float  # 开盘价
      volume: float  # 成交量
      turnover: float  # 换手率
      closing: float  # 收盘价（或者精确为当前价）
      pe: float  # 市盈率
      change: Tuple[float, float]  # 涨跌幅,涨跌幅
      day_range: Tuple[float, float]  # 最低价，最高价
      peta: float  # 贝塔
      sharpe: float  # 夏普率
  ```

### 6.5 根据用户已有投资需求，进行股票市场投资的交易建议

`用例 #6` `扩展流程-2`

#### 6.5.1 提供的接口

#### 6.5.2 依赖的接口

##### a. 接口定义

```python
def trade_stock(invreq_id: str) -> bool:
    """
    根据用户的一个投资需求，进行该投资需求下，A+Quant所做股票市场投资的一组股票交易建议
    :param invreq_id: 投资需求id
    :return: 是否交易成功
    """
    return False
```

##### b. 参数定义

- 投资需求ID，用一个字符串表示，例如 `'0e210c0b824b'`

##### c. 返回值定义

- 是否交易成功标识，`True`为成功，`False`为失败

## 7. 查看交易明细及目前持仓情况

## 8. 修改资产配置方案