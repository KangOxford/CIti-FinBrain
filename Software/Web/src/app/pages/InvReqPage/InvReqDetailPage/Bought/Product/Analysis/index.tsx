import React from "react";
import {Inject} from "react.di";
import {InvReq} from "../../../../../../models/invreq/InvReq";
import {AsyncComponent} from "../../../../../../routing/AsyncComponent";
import {Card, Row, Col} from "antd";
import {ProfitChart} from "./ProfitChart";
import {ProductAnalysisService} from "../../../../../../api/ProductAnalysisService";
import {LineChart} from "../../Chart/LineChart";
import {CardFooter} from "../../Util/CardFooter";
import {TotalProfitChart} from "./TotalProfitChart";
import {ProSceneChart} from "./ProSceneChart";
import {ComparisionChart} from "./ComparisionChart";
import {SensitivityChart} from "./SensitivityChart";
import {ResidualChart} from "./ResidualChart";
import {SceneForm} from "./ProSceneForm";
import {SensitivityLinearChart} from "./SensitivityLinearChart";
import {ProfitAndDrawdown} from "./ProfitAndDrawdown";
import {MomerabiliaForm} from "./MomerabiliaForm";
import {
  ComparisionTableList, MemorabiliaResponse,
  ProfitAndDrawDown, ResidualAnalysisResponse,
  SceneAnalysisResponse, SensitivityList,
} from "../../../../../../models/invreq/Bought/Product/ProductAnalysis";
import {NonBoughtCard} from "../../Util/NonBoughtCard";

interface Props {
  invreq: InvReq;
}

function AnalysisData(pros: {profitData: ProfitAndDrawDown, sceneData: SceneAnalysisResponse,
  compareData: ComparisionTableList, sensitivityData: SensitivityList, residualData: ResidualAnalysisResponse,
  memoryData: MemorabiliaResponse,
}) {
    return <div>

        <ProfitAndDrawdown data={pros.profitData}/>

      <Card>
        <ComparisionChart data={pros.compareData.comparisionWithMarketBenchmark}/>
        <CardFooter text={"每日与市场基准比较"}/>
      </Card>
        <Card>
          <ProSceneChart data={pros.sceneData.totalIncomeRatioList}/>
          <CardFooter text={"场景分析"}/>
        </Card>
        <Card>
          <SceneForm data={pros.sceneData.typeData} />
          <CardFooter text={"场景分析数据表"}/>
        </Card>

        <Row>
          <Col md={12} sm={24}>
            <Card>
              <SensitivityLinearChart data={pros.sensitivityData}/>
              <CardFooter text={"因子敏感度分析图(线性拟合)"}/>
            </Card>
          </Col>
          <Col md={12} sm={24}>
            <Card>
              <SensitivityChart data={pros.sensitivityData.factorSensitivity}/>
              <CardFooter text={"因子敏感度分析图(曲线拟合)"}/>
            </Card>
          </Col>
        </Row>

        <Card style={{textAlign: "center", height: "440px"}}>
          <ResidualChart data={pros.residualData.residualList}/>
          <CardFooter text={"残差分析图"}/>
          <p style={{color: "#9e9e9e"}}>(峰度: {pros.residualData.kurt} , 偏度: {pros.residualData.skew})</p>
        </Card>

        <Card>
          <MomerabiliaForm data={pros.memoryData.memorabilia}/>
          <CardFooter text={"历史大事记列表"}/>
        </Card>

      </div>;
}

export default class AnalysisPage extends React.Component<Props, {}> {
  @Inject service: ProductAnalysisService;

  renderItem = async () => {
    const InvreqId = this.props.invreq.invreqId;
    const overviewData = await this.service.getProductOverviewData(InvreqId);

    if (overviewData.futuresOverview.quantity === 0 && overviewData.spotOverview.quantity === 0) {
      return <NonBoughtCard />;
    } else {
      const profitData = await this.service.getProfitAndDrawdown(InvreqId);
      const sceneData = await this.service.getSceneData(InvreqId);
      const compareData = await this.service.getComparision(InvreqId);
      const sensitivityData = await this.service.getSensitivity(InvreqId);
      const residualData = await this.service.getResidual(InvreqId);
      const memoryData = await this.service.getMemorabilia(InvreqId);

      return <AnalysisData profitData={profitData}
                           sceneData={sceneData}
                           compareData={compareData}
                           sensitivityData={sensitivityData}
                           residualData={residualData}
                           memoryData={memoryData}/>;
    }
  }

  render() {
    return <h3>目前没有配置商品市场。</h3>;
    // return <AsyncComponent render={this.renderItem}/>;
  }
}
