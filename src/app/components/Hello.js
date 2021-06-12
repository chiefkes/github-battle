import React, { Component } from "react";

export default class Hello extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "Max",
    };

    this.updateName = this.updateName.bind(this);
  }

  updateName() {
    this.setState({
      name: "Yo",
    });
  }

  render() {
    return (
      <>
        <h1>Hello, {this.state.name}</h1>
        <button onClick={this.updateName}>Change Name</button>
      </>
    );
  }
}
