import React, { Component } from 'react';

import MainNavbar from './MainNavbar'

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mainHTML: ''
    };
  }

  componentDidMount() {
    fetch('main.html')
      .then(s => s.text())
      .then(s => this.setState({ mainHTML: s }))
  }

  render() {
    return (
      <div>
        <MainNavbar />
        <div dangerouslySetInnerHTML={{ __html: this.state.mainHTML }}></div>
      </div>
    );
  }
}

export default Main;
