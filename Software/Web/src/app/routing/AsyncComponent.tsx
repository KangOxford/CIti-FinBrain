import React, { ReactNode } from "react";
import { observer } from "mobx-react";

interface AsyncComponentProps {
  render: () => Promise<ReactNode>;
  componentWhenLoading?: ReactNode;
  componentProducerWhenLoadingFailed?: (e) => ReactNode;
  onRenderSuccess?(): void;
}

interface State {
  render: () => Promise<ReactNode>;
  component: ReactNode;
  loaded: boolean;
}

export class AsyncComponent extends React.Component<AsyncComponentProps, State> {

  state = {
    render: this.props.render,
    component: this.props.componentWhenLoading || null,
    loaded: false,
  };

  async loadComponent() {
    try {
      const component = await this.props.render();
      if (this.props.onRenderSuccess) {
        this.props.onRenderSuccess();
      }
      this.setState({
        component,
        loaded: true,
      });
    } catch (e) {
      console.log(e);
      if (this.props.componentProducerWhenLoadingFailed) {
        this.setState({
            component: this.props.componentProducerWhenLoadingFailed(e),
            loaded: true,
          },
        );
      }
    }
  }

  componentDidMount() {
    this.loadComponent();
  }

  componentDidUpdate() {
    if (!this.state.loaded) {
      this.loadComponent();
    }

  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.props !== prevState.props) {
      console.log("render needed");
      return {render: nextProps.render, props: nextProps.props, loaded: false};
    } else {
      return null;
    }

  }

  render() {
    return this.state.component;
  }
}

// export const ObserverAsyncComponent = observer(AsyncComponent);

export function ObserverAsyncComponent(props: AsyncComponentProps) {
    return React.createElement(observer(() => <AsyncComponent {...props}/>));
}
