import React from "react";
import styled from "styled-components";
import { observer } from "mobx-react";
import {Col, Row, InputNumber, Radio, Button, Card, TimePicker, Divider } from "antd";
import { LocaleMessage, LocaleStore } from "../../../../../internationalization/index";
import lang from "../../../../../internationalization/LocaleStore/lang";
import { Inject } from "react.di";
import {BoughtTranSetting} from "../../../../../models/invreq/Bought/BoughtTranSetting";
import moment from "moment";
import {InvreqServiceMock} from "../../../../../api/mock/InvreqServiceMock";
import { InvreqService } from "../../../../../api/InvreqService";
import PaddingCard from "../../../../../components/PaddingLayouts/PaddingCard";

interface Props {
  data: BoughtTranSetting;
  id: string;
  beModified: boolean;
}

interface State {
  disable: boolean;
  defaultConfirm: boolean;
  tranTime: number;
  remindTime: number;
  minMoney: number;
  confirmTime: number;
}

const FieldRow = styled(Row as any)`
  margin: 4px 0;
`;

@observer
export class TransactionSetting extends React.Component<Props, State> {
  @Inject service: InvreqService;

  state = {
    disable: this.props.beModified,
    defaultConfirm: this.props.data.defaultConfirm,
    tranTime: this.props.data.planTranTime,
    remindTime: this.props.data.planRemindTime,
    minMoney: this.props.data.minConfirmedPrice,
    confirmTime: this.props.data.confirmTime,
  };

  setRadio = (e) => {
    this.setState({
      defaultConfirm: e.target.value,
    });
  }

  setTranTime = (value) => {
    this.setState({
      tranTime: value,
    });
  }

  setRemindTime = (value) => {
    this.setState({
      remindTime: value,
    });
  }

  setMinMoney = (value) => {
    this.setState({
      minMoney: value,
    });
  }

  setConfirmTime = (value) => {
    this.setState({
      confirmTime: value,
    });
  }

  edit = (e) => {
    this.setState({
      disable: !this.state.disable,
    });
  }

  save = async () => {

    const settingData = {
      planTranTime: this.state.tranTime ,
      planRemindTime: this.state.remindTime,
      minConfirmedPrice: this.state.minMoney,
      confirmTime: this.state.confirmTime,
      defaultConfirm: this.state.defaultConfirm,
    };

    try {
      const res = await this.service.setBoughtTranSetting(this.props.id, settingData);
      this.setState({disable: true});
    } catch (e) {
      this.setState({disable: true});
    }
  }

  cancel = (e) => {
    this.setState({
      disable: true,
      defaultConfirm: this.props.data.defaultConfirm,
      tranTime: this.props.data.planTranTime,
      remindTime: this.props.data.planRemindTime,
      minMoney: this.props.data.minConfirmedPrice,
      confirmTime: this.props.data.confirmTime,
    });
  }

  render() {
    return (
      <Card>
        <Row>

          <Col span={3} offset={20}>
            <Button type={"primary"}
                    onClick={this.edit}
                    hidden={!this.props.beModified}
            >编辑</Button>
          </Col>
        </Row>

        <div>

          <Row style={{margin: "4px 0"}}>
            <Col xs={8}>
              <p>计划于北京时间</p>
            </Col>
            <Col xs={6} >
              <InputNumber size={"small"}
                           style={{width: "80px"}}
                           disabled={this.state.disable}
                           min={0}
                           max={23}
                           defaultValue={this.state.tranTime}
                           onChange={this.setTranTime}/>
            </Col>
            <Col xs={10}>
              <p>时(24小时制)进行交易</p>
            </Col>
          </Row>
          <FieldRow>
            <Col span={8}>
              <p>在计划交易时间之前</p>
            </Col>
            <Col span={6} >
              <InputNumber min={1}
                           max={24}
                           defaultValue={this.state.remindTime}
                           size={"small"}
                           style={{width: "80px"}}
                           disabled={this.state.disable}
                           onChange={this.setRemindTime}/>
            </Col>
            <Col span={10} >
              <p>小时提醒我有交易</p>
            </Col>
          </FieldRow>

          <FieldRow>
            <Col span={8}>
              <p>交易额超过</p>
            </Col>
            <Col span={6} >
              <InputNumber min={0}
                           step={1}
                           defaultValue={this.state.minMoney}
                           size={"small"}
                           style={{width: "80px"}}
                           disabled={this.state.disable}
                           onChange={this.setMinMoney}/>
            </Col>
            <Col span={10} >
              <p>元需手动确认交易</p>
            </Col>
          </FieldRow>

          <FieldRow>
            <Col span={8}>
              <p>若消息发出超过</p>
            </Col>
            <Col span={6} >
              <InputNumber min={0}
                           max={24}
                           defaultValue={this.state.confirmTime}
                           style={{width: "80px"}}
                           size={"small"}
                           disabled={this.state.disable} onChange={this.setConfirmTime}/>
            </Col>
            <Col span={10} >
              <p>小时未确认，执行默认操作</p>
            </Col>
          </FieldRow>

          <FieldRow>
            <Col span={8}>
              <p>默认操作</p>
            </Col>
            <Col span={8} >
              <Radio.Group onChange={this.setRadio}
                           defaultValue={this.state.defaultConfirm}
                           disabled={this.state.disable}>
                <Radio value={true}>确认交易</Radio>
                <Radio value={false}>取消交易</Radio>
              </Radio.Group>
            </Col>

            <div style={{marginTop: "40px", float: "right"}} hidden={!this.props.beModified}>
              <Button
                hidden={this.state.disable}
                type={"primary"}
                onClick={this.save}
              >保存</Button>
              <Button
                hidden={this.state.disable}
                style={{marginLeft: "10px"}}
                onClick={this.cancel}
              >取消</Button>
            </div>
          </FieldRow>

        </div>
      </Card>
    );
  }
}
