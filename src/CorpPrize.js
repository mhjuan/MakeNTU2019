import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle
} from 'reactstrap';
import axios from 'axios';
import PouchDB from 'pouchdb-browser';
import PouchdbFind from 'pouchdb-find';
import MD5 from 'blueimp-md5';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

import ParticipantNavbar from './ParticipantNavbar'
import Cathay from './assets/cathay.png'
import Mtk from './assets/mtk.png'
import Esun from './assets/esun.png'
import Cht from './assets/cht.png'
import Stm from './assets/stm.png'
import Fet from './assets/fet.png'

class CorpPrize extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSubmitting: false,
      partCnt: 0,
      corpCnt: [[]],
      partCorp: [false, false, false, false, false, false]
    };
    
    PouchDB.plugin(PouchdbFind);    

    const account = 'be8a3d9c-c44b-431c-9a32-69389efeb85a-bluemix';

    const pwdApiKey = 'sistsinglovelyintaidepri'; // Read-only key
    const pwdApiPassword = 'aba91a052253fd31e87cad5e11130103d4f5f5b5';

    const corpApiKey = 'cialkeetedegreschistreff'; // Vulnerable, not a good practice
    const corpApiPassword = '331d19fc171716a55741fa0876f12af722a8ceae';

    const pwdUrl = `https://${pwdApiKey}:${pwdApiPassword}@${account}.cloudant.com/passwords`;
    const corpUrl = `https://${corpApiKey}:${corpApiPassword}@${account}.cloudant.com/corp-prize`;

    this.pwdDb = new PouchDB(pwdUrl);
    this.corpDb = new PouchDB(corpUrl);
  }

  updateCorpPrize = () => {
    this.corpDb.allDocs({include_docs: true})
      .then((res) => res.rows[0].doc)
      .then((data) => {
        let partCnt = 0;
        let partCorp = this.state.partCorp;

        for (let i = 0; i < 6; i++) {
          if (data['corp_prize'][i].includes(this.props.teamId.slice(-2))) {
            partCnt += 1;
            partCorp[i] = true;
          } else {
            partCorp[i] = false;
          }
        }

        this.setState({
          partCnt: partCnt,
          corpCnt: data['corp_prize'].map(x => x.length),
          partCorp: partCorp
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  auth = () => {
    this.pwdDb.find({ selector: {'team_id': this.props.teamId}, fields: ['team_id', 'md5_password'] })
      .then((res) => res.docs[0])
      .then((data) => {
        if (data.team_id !== this.props.teamId ||
          data.md5_password !== MD5(this.props.password)) {
            this.props.onLoggedOut();
        }
      })
      .catch((err) => {
        console.error(err);
        this.props.onLoggedOut();
      });
  };

  handleSubmitCorp = (e) => {
    const corpIdx = e.target.id;

    this.setState({isSubmitting: true});

    this.auth();

    this.corpDb.allDocs({include_docs: true})
      .then((res) => res.rows[0].doc)
      .then((data) => {
        data['corp_prize'][corpIdx].push(this.props.teamId.slice(-2));

        this.corpDb.put({
          _id: data['_id'],
          _rev: data['_rev'],
          corp_prize: data['corp_prize']
        }).then(() => {
          this.updateCorpPrize();
          this.setState({isSubmitting: false});
        });
      })
      .catch((err) => {
        console.error(err);
        this.setState({isSubmitting: false});
      });
  };

  handleCancelCorp = (e) => {
    const corpIdx = e.target.id;

    this.setState({isSubmitting: true});

    this.auth();

    this.corpDb.allDocs({include_docs: true})
      .then((res) => res.rows[0].doc)
      .then((data) => {
        const index = data['corp_prize'][corpIdx].indexOf(this.props.teamId.slice(-2));
        if (index !== -1) data['corp_prize'][corpIdx].splice(index, 1);

        this.corpDb.put({
          _id: data['_id'],
          _rev: data['_rev'],
          corp_prize: data['corp_prize']
        }).then(() => {
          this.updateCorpPrize();
          this.setState({isSubmitting: false});
        });
      })
      .catch((err) => {
        console.error(err);
        this.setState({isSubmitting: false});
      });
  };

  renderBtn = (corpIdx) => {
    if (this.state.isSubmitting === true) {
      return <Spinner color="secondary" />;
    } else if (this.state.partCorp[corpIdx] === true) {
      return <Button color="danger" id={corpIdx} onClick={this.handleCancelCorp}>已報名，點選以取消</Button>;
    } else if (this.state.partCnt === 3) {
      return <Button color="secondary" disabled>已報滿3個企業獎</Button>;
    } else {
      return <Button color="primary" id={corpIdx} onClick={this.handleSubmitCorp}>報名此企業獎</Button>
    }
  };

  componentDidMount = this.updateCorpPrize;

  render() {
    return (
    <div>
      <ParticipantNavbar {...this.props} active='corp-prize' />

      <Container>
        <Row>
          <Col style={{ textAlign: 'center', marginTop: '3vh' }}>
            <h4>企業獎報名</h4>
          </Col>
        </Row>

        <Row>
          <Col style={{ textAlign: 'center', marginTop: '2vh' }}>
            已報{this.state.partCnt}個 / 剩餘{3 - this.state.partCnt}個
          </Col>
        </Row>

        <Row>
          <Col sm={{ size: 6, offset: 0 }} xs={{ size: 10, offset: 1 }}>
            <Card style={{ marginTop: '3vh' }}>
              <div style={{ textAlign: 'center' }}>
                <CardImg top src={Cathay} alt="Cathay" style={{ width: '78.6%' }}/>
              </div>
              <CardBody>
                <CardTitle>國泰金控 已報{this.state.corpCnt[0]}組</CardTitle>
                {this.renderBtn(0)}
              </CardBody>
            </Card>
          </Col>
          <Col sm={{ size: 6, offset: 0 }} xs={{ size: 10, offset: 1 }}>
            <Card style={{ marginTop: '3vh' }}>
              <CardImg top src={Mtk} alt="MediaTek" />
              <CardBody>
                <CardTitle>聯發科技 已報{this.state.corpCnt[1]}組</CardTitle>
                {this.renderBtn(1)}
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col sm={{ size: 6, offset: 0 }} xs={{ size: 10, offset: 1 }}>
            <Card style={{ marginTop: '3vh' }}>
              <CardImg top src={Esun} alt="E-Sun Bank" />
              <CardBody>
                <CardTitle>玉山銀行 已報{this.state.corpCnt[2]}組</CardTitle>
                {this.renderBtn(2)}
              </CardBody>
            </Card>
          </Col>
          <Col sm={{ size: 6, offset: 0 }} xs={{ size: 10, offset: 1 }}>
            <Card style={{ marginTop: '3vh' }}>
              <CardImg top src={Cht} alt="Chunghua Telecom" />
              <CardBody>
                <CardTitle>中華電信 已報{this.state.corpCnt[3]}組</CardTitle>
                {this.renderBtn(3)}
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col sm={{ size: 6, offset: 0 }} xs={{ size: 10, offset: 1 }}>
            <Card style={{ marginTop: '3vh' }}>
              <CardImg top src={Stm} alt="STMicroelectronics" />
              <CardBody>
                <CardTitle>意法半導體 已報{this.state.corpCnt[4]}組</CardTitle>
                {this.renderBtn(4)}
              </CardBody>
            </Card>
          </Col>
          <Col sm={{ size: 6, offset: 0 }} xs={{ size: 10, offset: 1 }}>
            <Card style={{ marginTop: '3vh' }}>
              <CardImg top src={Fet} alt="Fareastone Telecom" />
              <CardBody>
                <CardTitle>遠傳電信 已報{this.state.corpCnt[5]}組</CardTitle>
                {this.renderBtn(5)}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
    );
  }
}

export default CorpPrize;
