import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Label,
  Input,
  Navbar,
  NavbarBrand,
  Spinner
} from 'reactstrap';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import PouchDB from 'pouchdb-browser';
import PouchdbFind from 'pouchdb-find';
import MD5 from 'blueimp-md5';

import MainNavbar from './MainNavbar'

class Login extends Component {
  constructor(props) {
    super(props);

    PouchDB.plugin(PouchdbFind);

    this.state = {
      isLoggingIn: false,
      isLogInError: false,
      teamId: '',
      password: ''
    };

  }

  handleIdChange = (e) => {
    this.setState({teamId: e.target.value});
  };

  handlePasswordChange = (e) => {
    this.setState({password: e.target.value});
  };

  handleSubmit = () => {
    this.setState({isLoggingIn: true});
    const account = 'be8a3d9c-c44b-431c-9a32-69389efeb85a-bluemix';
    const apiKey = 'sistsinglovelyintaidepri'; // Read-only key, db pwd stored in MD5
    const apiPassword = 'aba91a052253fd31e87cad5e11130103d4f5f5b5';

    const baseUrl = `https://${apiKey}:${apiPassword}@${account}.cloudant.com/passwords`;
    const db = new PouchDB(baseUrl);

    db.find({ selector: {'team_id': this.state.teamId}, fields: ['team_id', 'md5_password'] })
      .then((res) => res.docs[0])
      .then((data) => {
        if (data.team_id === this.state.teamId &&
          data.md5_password === MD5(this.state.password)) {
          this.props.onLoggedIn(this.state.teamId, this.state.password);
        } else {
          this.setState({
            isLoggingIn: false,
            isLogInError: true
          });
        }
      })
      .catch((err) => {
        console.error(err);
        this.setState({
          isLoggingIn: false,
          isLogInError: true
        });
      });
  };

  render() {
    return (
      <div>
        <MainNavbar active='login' />

        <Container>
          <Row>
            <Col style={{ textAlign: 'center', marginTop: '3vh' }}>
              <h4>參賽者登入</h4>
            </Col>
          </Row>

          <Row>
            <Col md={{ size: 4, offset: 4 }} sm={{ size: 8, offset: 2}}>
              <Form>
                <FormGroup>
                  <Label for="team-id">Team ID</Label>
                  <Input id="team-id" placeholder="team_xx"
                    onChange={this.handleIdChange} autoFocus/>
                </FormGroup>

                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input type="password" id="password" placeholder="password"
                    invalid={this.state.isLogInError} onChange={this.handlePasswordChange}/>
                  <FormFeedback>Incorrect Password or Team ID</FormFeedback>
                </FormGroup>
                
                {this.state.isLoggingIn ? 
                  <Spinner color="secondary" /> :
                  <Button onClick={this.handleSubmit}>Submit</Button>}
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
