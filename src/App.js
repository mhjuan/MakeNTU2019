import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

import './App.css'
import Main from './Main'
import Login from './Login'
import Comments from './Comments'
import MacToIp from './MacToIp'
import CorpPrize from './CorpPrize'
import PopPrize from './PopPrize'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isParticipantLoginClicked: false,
      isLoggedIn: false,
      teamId: '',
      password: ''
    };

    this.handleLoggedIn.bind(this);
    this.handleLoggedOut.bind(this);
  }

  handleLoggedIn = (teamId, password) => {
    this.setState({isLoggedIn: true, teamId: teamId, password: password});
  };

  handleLoggedOut = () => {
    this.setState({isLoggedIn: false});
  };

  render() {
    return (
      <Router>
        <div>          
          <Route exact path="/" component={Main} />
          <Route path="/login" render={
            () => this.state.isLoggedIn ?
              <Redirect to='/participant' /> :
              <Login onLoggedIn={this.handleLoggedIn} />
          } />
          <Route exact path="/participant" render={
            () => this.state.isLoggedIn ?
              <Redirect to='/participant/comments' /> :
              <Redirect to='/login' />
          } />
          <Route path="/participant/comments" render={
            () => this.state.isLoggedIn ?
              <Comments teamId={this.state.teamId} password={this.state.password}
                onLoggedOut={this.handleLoggedOut} /> :
              <Redirect to='/login' />
          } />
          <Route path="/participant/mac-to-ip" render={
            () => this.state.isLoggedIn ?
              <MacToIp teamId={this.state.teamId} password={this.state.password}
                onLoggedOut={this.handleLoggedOut} /> :
              <Redirect to='/login' />
          } />
          <Route path="/participant/corp-prize" render={
            () => this.state.isLoggedIn ?
              <CorpPrize teamId={this.state.teamId} password={this.state.password}
                onLoggedOut={this.handleLoggedOut} /> :
              <Redirect to='/login' />
          } />
          <Route path="/pop-prize/:key" render={
            (match) => <PopPrize {...match}/>
          } />
        </div>
      </Router>
    );
  }
}

export default App;
