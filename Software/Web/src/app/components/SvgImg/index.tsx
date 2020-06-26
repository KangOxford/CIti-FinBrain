import React from "react";

interface Props {
  filePath: string;
  height?: number;
  width?: number;
  className?: string;
  onClick?(): void;
}

export default class SvgImg extends React.PureComponent<Props> {

  render() {
    const { filePath, height, width, className } = this.props;
    const Svg = require(`svg-react-loader?name=Svg!../../../assets/svg/${filePath}`);
    return <Svg onClick={this.props.onClick} className={className} width={width} height={height}/>;
  }

}
