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

class MacToIp extends Component {
  constructor(props) {
    super(props);

    PouchDB.plugin(PouchdbFind);    

    this.state = {
      mac: '',
      isSubmitting: false,
      ip: null,
      isSubmitError: false,
      isHTTPSError: false
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

  handleSubmit = async () => {
    this.setState({isSubmitting: true});

    const baseUrl = `http://140.112.249.144:10080/`;

    let isIpFound = false;

    const dataFound = (data) => {
      console.log(data[this.state.mac]);
      if (data[this.state.mac] !== undefined) {
        isIpFound = true;
        this.setState({
          ip: data[this.state.mac],
          isSubmitting: false
        });
      }
    }

    for (let i = 1; i <= 3; i++) {
      await axios.get(`${baseUrl}${i}/`)
        .then((res) => res.data)
        .then(dataFound)
        .catch((err) => {
          console.log(err);
          this.setState({
            isSubmitting: false,
            isHTTPSError: true
          });
        });
      }
      if (isIpFound === false) {
        this.setState({
          isSubmitting: false,
          isSubmitError: true
        });
      }
  };

  render() {
    return (
    <div>
      <ParticipantNavbar {...this.props} active='mac-to-ip' />

      <Container>
        <Row>
          <Col style={{ textAlign: 'center', marginTop: '3vh' }}>
            <h4>MAC to IP</h4>
          </Col>
        </Row>

        <Row>
          <Col md={{ size: 4, offset: 4 }} sm={{ size: 8, offset: 2}}>
            <Form onKeyPress={this.handleMacKeyPress}>
              <FormGroup>
                <Label for="mac">Input device MAC address</Label>
                <Input id="mac" placeholder="xx:xx:xx:xx:xx:xx"
                  onChange={this.handleMacChange} invalid={this.state.isSubmitError} autoFocus/>
                <FormFeedback>MAC address not found in database</FormFeedback>
              </FormGroup>
              {
                this.state.isHTTPSError ?
                  <div>
                    <h6 style={{color: 'red'}}>
                      Network Error<br />
                    </h6>
                    <p style={{color: 'red'}}>
                      Please allow unsafe script (HTTP) or check your network connection.
                    </p>
                  </div> :
                  null
              }
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

export default MacToIp;
