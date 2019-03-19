import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

import './App.css'
import Main from './Main'
import Login from './Login'
import Participant from './Participant'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isParticipantLoginClicked: false,
      isLoggedIn: false
    };

    this.handleLoggedIn.bind(this);
  }

  handleLoggedIn = () => {
    this.setState({isLoggedIn: true});
  };

  render() {
    return (
      <Router>
        <div>          
          <Route exact path="/" component={Main} />
          <Route path="/login" render={
            (props) => this.state.isLoggedIn ?
              <Redirect to='/participant/mac-to-ip' /> :
              <Login {...props} onLoggedIn={this.handleLoggedIn} />
          } />
          <Route exact path="/participant" render={
            (props) => this.state.isLoggedIn ?
              <Redirect to='/participant/mac-to-ip' /> :
              <Redirect to='/login' />
          } />
          <Route path="/participant/mac-to-ip" render={
            (props) => this.state.isLoggedIn ?
              <Participant {...props} /> :
              <Redirect to='/login' />
          } />
        </div>
      </Router>
    );
  }
}

export default App;
