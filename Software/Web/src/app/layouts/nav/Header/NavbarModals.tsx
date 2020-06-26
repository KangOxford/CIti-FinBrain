import React from "react";
import { AsyncComponent } from "../../../routing/AsyncComponent";

interface Props {

}

export class NavbarModals extends React.PureComponent<Props, {}> {

  loadComponent = async () => {
    const Component = (await import("../../../components/LoginModal")).LoginModal;
    return <Component/>;
  }

  render() {
    return <AsyncComponent render={this.loadComponent}/>;
  }
}
