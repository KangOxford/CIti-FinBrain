import React from "react";
import { observer } from "mobx-react";
import { Breadcrumb } from "antd";
import { Inject } from "react.di";
import { NavStore } from "./NavStore";
import { Link } from "react-router-dom";
import { LocaleMessage } from "../../internationalization/components";

interface Props {
  className?: string;
}

@observer
export class BreadcrumbNav extends React.Component<Props, {}> {

  @Inject navStore: NavStore;

  render() {
    return <Breadcrumb className={this.props.className}>
      {this.navStore.currentNavPath.map((x) =>
        <Breadcrumb.Item key={x.path as string}>
          <Link to={x.path}><LocaleMessage id={x.textId}/></Link>
        </Breadcrumb.Item>,
      )}
    </Breadcrumb>;
  }
}
