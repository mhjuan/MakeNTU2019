import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

import './App.css'
import Main from './Main'
import Login from './Login'
import Comments from './Comments'
import MacToIp from './MacToIp'
import CorpPrize from './CorpPrize'
import CorpPrizeLate from './CorpPrizeLate'
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

    this.corpEarlyDeadline = new Date(2019, 3 - 1, 30, 16, 0)
    this.corpDeadline = new Date(2019, 3 - 1, 30, 18, 0)

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
              <Redirect to='/participant/corp-prize' /> :
              <Redirect to='/login' />
          } />
          <Route path="/comments" component={Comments}/>
          <Route path="/participant/mac-to-ip" render={
            () => this.state.isLoggedIn ?
              <MacToIp teamId={this.state.teamId} password={this.state.password}
                onLoggedOut={this.handleLoggedOut} /> :
              <Redirect to='/login' />
          } />
          <Route path="/participant/corp-prize" render={
            () => this.state.isLoggedIn ?
              (
                new Date() >= this.corpDeadline ?
                  <CorpPrizeLate teamId={this.state.teamId} password={this.state.password}
                    onLoggedOut={this.handleLoggedOut} over /> :
                  (
                    new Date() >= this.corpEarlyDeadline ?
                      <CorpPrizeLate teamId={this.state.teamId} password={this.state.password}
                        onLoggedOut={this.handleLoggedOut} /> :
                      <CorpPrize teamId={this.state.teamId} password={this.state.password}
                        onLoggedOut={this.handleLoggedOut} />
                  )
              ) :
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
