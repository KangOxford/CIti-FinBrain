import {StockQuotation} from "../../models/quotation/stock/StockQuotation";
import { Injectable } from "react.di";
import {QuotationService} from "../QuotationService";
import { StockDetailQuotation } from "../../models/quotation/stock/StockDetailQuotation";
import { BondQuotation } from "../../models/quotation/bond/BondQuotation";
import { GoodsQuotation } from "../../models/quotation/goods/GoodsQuotation";

import stockMock from "./mockStockQuotation.json";
import { News } from "../../models/quotation/news/News";
import { waitForMs } from "../../../utils/Wait";
import { mockComponent } from "react-dom/test-utils";

@Injectable
export class QuotationServiceMock extends QuotationService {

  async getNews(): Promise<News[]> {
    // await waitForMs(3000);
    return [
      { time: "09-16 17:38",
        content: "英媒称，大学跟大学不一样，毕业生找工作，学历上填哪些学校最能让雇主眼睛一亮？文凭“含金量”谁高谁低？\n\n" +
        "据英国广播公司网站9月14日报道，根据新出炉的2019全球大学毕业生“抢手程度”排行榜，美国麻省理工大学毫无悬念位居榜首。\n\n" +
        "报道称，中国的清华、北大、复旦和香港大学名列30强。发布排行榜的英国QS集团指出，这体现了中国经济实力的提升。\n\n" +
        "报道还称，这个毕业生就业能力排行榜跟QS世界大学排行榜有所不同，更多体现就业市场对大学的青睐程度。\n\n" +
        "报道指出，两者主要区别在于前者更多体现了学生毕业后的职业发展前景和学术成就，主要衡量标准包括雇主对学校的评价、校友的职业发展情况、教研团队与雇主的合作关系、雇主与学生的关联程度、毕业生就业率等几个方面。\n\n" +
        "排行榜基于42000个雇主的评估编制。\n\n" +
        "让雇主回答的问题是：你们从哪里招到那些“能力最强、最有创新力、效率最高的”毕业生？\n\n" +
        "报道称，除了应届毕业生，校友的职业发展和成就也是衡量指标之一。比如，世界各行各业的顶级精英毕业于哪些大学，雇主和大学的合作程度多深，等等。\n\n" +
        "QS研究部门负责人索特解释，大学学费不断上涨，就业市场竞争不断激烈，所以在选择上哪所大学时，毕业后找工作的难易和职业发展前景便成了重要考虑因素。\n\n" +
        "QS的另一份榜单，世界大学排行榜，从2004年开始发表，最初与《泰晤士高等教育》合作编制，2009年分道扬镳，各自发表不同的排名。\n\n" +
        "报道称，这个榜单的衡量指标包括学术成就、雇主评估、师生比例、教师论文被引述情况、国际教师和国际学生比例等。麻省理工大学连续7年在这份榜单上名列榜首。\n\n" +
        "不过，QS的大学排名评估指标也有客观性不足的争议。\n\n" +
        "报道称，比较大学毕业生就业能力排行榜和世界大学排行榜，可以发现耶鲁大学、哥伦比亚大学、南洋理工大学、新加坡国立大学、加州理工学院和洛桑理工学院等大学排行榜上名列前茅的顶级院校，都未能进入就业能力排行榜前30名。\n\n" +
        "澳大利亚两所大学，悉尼大学和墨尔本大学，在QS世界大学排行榜上没有进入前30名，但在“文凭含金量”排行榜上分别名列第五和第六。\n\n" +
        "QS数据显示，主要原因是这两所大学的毕业生更受雇主和猎头公司欢迎。\n\n" +
        "麻省理工大学在两个排行榜上多年来稳居第一，除了科技教研和创新一流，还有诸多著名校友，比如前联合国秘书长安南。斯坦福大学校友群也是明星荟萃。\n\n" +
        "报道称，这个排行榜上排名最高的英国大学是剑桥，第七，牛津排第十。跟其他“更受雇主青睐”的大学相比，英国的大学在跟雇主合作关系和毕业生就业前景方面失分较多。\n\n" +
        "中国的清华大学排名第九，北京大学排第二十。\n\n" +
        "报道称，全球大学毕业生就业能力500强榜单上，美国大学83所（16.6%），西欧大学144所（28.8%），亚洲102所（20.4%）。\n\n" +
        "责任编辑：孟行 \n\n",
        title: "全球大学文凭\"含金量\"排名出炉:\"北清复\"名列30强" },
      { time: "09-16 17:36",
        content: "新浪财经讯 山东黄金公告，根据发行上市的时间安排，" +
        "公司9月14日在香港刊登并派发H股招股说明书。公司H股香港公开发售于9月14日开始，9月20日结束，并预计于9月27日或之前，公布国际发售和香港公开发售的认购情况及香港公开发售股份的分配结果。" +
        "H股预计9月28日在香港联交所挂牌并开始上市交易。\n\n" +
          "责任编辑：白仲平 \n\n",
        title: "山东黄金：公司H股预计9月28日在香港联交所挂牌上市" },
    ];
  }

  async getStockQuotationData(): Promise<StockQuotation[]> {
    return stockMock;
  }

  async getBondQuotationData(): Promise<BondQuotation[]> {
    return stockMock;
  }

  /**
   * 得到一支股票标的信息
   * @param {string} quotaId 标的id
   * @returns {Promise<StockQuotation>} 标的信息
   */
  async getDetailStockQuotation(quotaId: string): Promise<StockDetailQuotation> {
    return {
      quotaId: "HK1810", // 标的合约代码
      quotaName: "小米集团", // 标的名称
      currentVolume: 16.50, // 现价
      rising: -1.79, // 涨幅：百分比
      upAndDown: 0.300, // 涨跌幅：百分比
      todayPrice: 16.800, // 今日开幅
      yesterdayPrice: 14.24,
      highest: 16.860, // 今日最高
      lowest: 16.380, // 今日最低
      totalVolume: 3.35, // 总成交额:亿
      totalQuantity: 2024.26, // 总成交量：万
      // totalMarketValue: 3725.31, // 总市值:亿
      // circulatedMarketValue: 3725.31, // 流通市值：亿,
      history: stockMock,
    };
  }

  async getGoodsQuotationData(): Promise<GoodsQuotation[]> {
    return stockMock;
  }
}
