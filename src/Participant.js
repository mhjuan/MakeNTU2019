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
  Spinner
} from 'reactstrap';
import axios from 'axios';
import PouchDB from 'pouchdb-browser';
import PouchdbFind from 'pouchdb-find';

import ParticipantNavbar from './ParticipantNavbar'

class Participant extends Component {
  constructor(props) {
    super(props);

    PouchDB.plugin(PouchdbFind);    

    this.state = {
      mac: '',
      isSubmitting: false,
      ip: null,
      isSubmitError: false
    };
  }

  handleMacChange = (e) => {
    this.setState({mac: e.target.value});
  };

  handleMacKeyPress = (e) => {
    if (e.which === 13) {
      e.preventDefault();
      this.handleSubmit();
      return false;
    }
  };

  handleSubmit = () => {
    this.setState({isSubmitting: true});
    const account = 'be8a3d9c-c44b-431c-9a32-69389efeb85a-bluemix';
    const apiKey = 'rmittiourainglaninstudye'; // Read-only key
    const apiPassword = '4bfea8654942dd867acaccebb4da274a9b6f2705';

    const baseUrl = `https://${apiKey}:${apiPassword}@${account}.cloudant.com/ips`;
    const db = new PouchDB(baseUrl);

    db.find({ selector: {'mac': this.state.mac}, fields: ['mac', 'ip'] })
      .then((res) => res.docs[0])
      .then((data) => {
        if (data.mac === this.state.mac) {
          this.setState({
            ip: data.ip,
            isSubmitting: false,
            isSubmitError: false
          });
        } else {
          this.setState({
            isSubmitting: false,
            isSubmitError: true
          });
        }
      })
      .catch((err) => {
        console.error(err);
        this.setState({
          isSubmitting: false,
          isSubmitError: true
        });
      });
  };

  render() {
    return (
    <div>
      <ParticipantNavbar onLoggedOut={this.props.onLoggedOut} />

      <Container>
        <Row>
          <Col style={{textAlign: 'center'}}>
            <h4>MAC to IP</h4>
          </Col>
        </Row>

        <Row>
          <Col sm={{ size: 4, offset: 4 }} xs={{ size: 8, offset: 2}}>
            <Form onKeyPress={this.handleMacKeyPress}>
              <FormGroup>
                <Label for="mac">Input device MAC address</Label>
                <Input id="mac" placeholder="xx:xx:xx:xx:xx:xx"
                  onChange={this.handleMacChange} invalid={this.state.isSubmitError} autoFocus/>
                <FormFeedback>MAC address not found in database</FormFeedback>
              </FormGroup>
              <Button onClick={this.handleSubmit}>Find device IP</Button>
            </Form>
          </Col>
        </Row>

        <Row>
          <Col sm={{ size: 4, offset: 4 }} xs={{ size: 8, offset: 2}}>
            <hr />
          </Col>
        </Row>

        <Row>
          <Col sm={{ size: 4, offset: 4 }} xs={{ size: 8, offset: 2}}>
            {this.state.ip === null || this.state.isSubmitError || this.state.isSubmitting ?
              null : `IP: ${this.state.ip}`}
            {this.state.isSubmitting ? <Spinner color="secondary" /> : null}
          </Col>
        </Row>
      </Container>
    </div>
    );
  }
}

export default Participant;
