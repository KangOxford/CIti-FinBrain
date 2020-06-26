import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, List, Tag, Row, Col } from "antd";
import { InvreqService } from "../../../api/InvreqService";
import { Inject } from "react.di";
import { InvReq, InvReqList } from "../../../models/invreq/InvReq";
import { LocaleMessage } from "../../../internationalization/components";
import lang from "../../../internationalization/LocaleStore/lang";
import InitModal from "../InitModal";

interface Props {
  invreqList: InvReqList;

}

interface State {
  initModalShown: boolean;
  list: InvReq[];
  fetching: boolean;
}

const root = lang().invreq.list;

function Item(props: { invreq: InvReq }) {
  const { invreqId, bought, recommended } = props.invreq;
  return <div>
    <Card title={<LocaleMessage id={root.invreq} replacements={{ invreqId }}/>}
               hoverable={true}
               extra={<Link to={`/invreq/${invreqId}`}><LocaleMessage id={root.detail}/></Link>}
               style={{height: "200px"}}
  >
    <Tag color={"#108ee9"}><LocaleMessage id={root.bought[bought + ""]}/></Tag>
    {recommended
      ? <Tag color={"#f50"}><LocaleMessage id={root.recommended}/></Tag>
      : null
    }

  </Card></div>;
}

export default class InvReqListPage extends React.Component<Props, State> {

  state = {
    initModalShown: false,
    list: [],
    fetching: false,
  };

  @Inject invreqService: InvreqService;

  componentDidMount() {
    this.fetchContent();
  }

  async fetchContent() {
    this.setState({
      fetching: true,
    });
    const accounts = await this.invreqService.getAllInvreqAccounts();
    this.setState({
      list: accounts,
      fetching: false,
    });

  }

  closeAddModal = () => {
    this.setState({
      initModalShown: false,
    });
  }

  openAddModal = () => {
    this.setState({
      initModalShown: true,
    });
  }

  render() {
    return <Card style={{height: "750px"}}>
      <h1 style={{margin: "10px"}}>
        <span><LocaleMessage id={root.title}/></span>
        <Button style={{ float: "right"}} type={"primary"} icon={"plus"} onClick={this.openAddModal}>
          <LocaleMessage id={root.add}/>
        </Button>
      </h1>

      <List
        grid={{xs: 1, sm: 2, md: 3, lg: 4}}
        dataSource={this.state.list}
        renderItem={(item) => (
          <List.Item key={item.invreqId}>
            <Item invreq={item}/>
          </List.Item>
        )}
        loading={this.state.fetching}
        // pagination={false}
      />
      <InitModal close={this.closeAddModal} shown={this.state.initModalShown}/>
    </Card>;
  }
}
