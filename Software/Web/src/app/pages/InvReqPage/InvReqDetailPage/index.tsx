import React, { ReactNode } from "react";
import { RouteComponentProps } from "react-router";
import { AsyncComponent } from "../../../routing/AsyncComponent";
import { Inject } from "react.di";
import { InvreqService } from "../../../api/InvreqService";
import { InvReq } from "../../../models/invreq/InvReq";
import Loading from "../../../components/Loading";

interface MatchParams {
  invreqId: string;
}

interface Props extends RouteComponentProps<MatchParams> {

}

interface State {
  loading: boolean;
  component: ReactNode;
}

// @todo
export default class InvReqDetailPage extends React.Component<Props, State> {

  @Inject invreqService: InvreqService;

  state = {
    loading: true,
    component: null,
  }

  reload = async () => {
    this.setState({ loading: true, component: null });
    const invreq = await this.invreqService.getInvreqAccount(this.props.match.params.invreqId);

    let page;

    if (invreq.bought) {
      const Component = (await import("./Bought")).default;
      page = <Component invreq={invreq}/>;
    } else {
      const Component = (await import("./NotBought")).default;
      page = <Component invreq={invreq} refresh={this.reload}/>;
    }

    this.setState({
      loading: false,
      component: page,
    });
  }

  componentDidMount() {
    this.reload();
  }

  render() {
    if (this.state.loading) {
      return <Loading/>;
    }
    return this.state.component;

  }
}
