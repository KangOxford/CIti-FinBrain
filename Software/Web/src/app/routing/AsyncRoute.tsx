import React, { ReactNode } from "react";
import { Route, RouteComponentProps } from "react-router";
import { AsyncComponent, ObserverAsyncComponent } from "./AsyncComponent";
import Loading from "../components/Loading";

interface Props<T> {
  path?: string;
  exact?: boolean;
  component?: Promise<any>;
  props?: any;
  render?: (props: RouteComponentProps<T>) => Promise<ReactNode>;
}

export class AsyncRoute<T> extends React.Component<Props<T>> {

  renderRoute = (routeProps) => {
    return <AsyncComponent
      render={this.props.component
        ? async () => {
          return React.createElement(
            (await this.props.component).default,
            { ...routeProps, ...this.props.props },
          );
        }
        : () => this.props.render(routeProps)}
      componentWhenLoading={<Loading/>}
    />;
  }

  render() {
    return <Route path={this.props.path}
                  exact={this.props.exact}
                  render={this.renderRoute}
    />;
  }
}
