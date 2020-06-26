import React from "react";

export default function todo(WrappedComponent): any {
  return (props) => <div>
    <p>Component: {WrappedComponent.name}</p>
    <p>Props: {JSON.stringify(props)}</p>
  </div>;
}
