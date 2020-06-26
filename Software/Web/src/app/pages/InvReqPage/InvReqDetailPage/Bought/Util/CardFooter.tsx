import styled from "styled-components";
import React from "react";

interface Props {
  text: string;
}

export class CardFooter extends React.Component<Props, {}> {
  render() {
    return (
      <div style={{ marginTop: "15px", textAlign: "center"}}>
        <p style={{color: "#9e9e9e"}}>{this.props.text}</p>
      </div>
    );
  }
}
