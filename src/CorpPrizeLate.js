import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Card,
  CardImg,
  CardBody,
  CardTitle,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import axios from 'axios';
import PouchDB from 'pouchdb-browser';
import PouchdbFind from 'pouchdb-find';
import MD5 from 'blueimp-md5';

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
      dropdownOpen: [false, false, false, false, false, false],
      isSubmitting: false,
      partCnt: 0,
      corpCnt: [[]],
      partCorp: [false, false, false, false, false, false]
    };

    this.handleSubmitCorp.bind(this);

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

  toggle = (e) => {
    const corpIdx = e.target.parentNode.id;

    let dropdownOpen = this.state.dropdownOpen

    dropdownOpen[corpIdx] = !dropdownOpen[corpIdx]

    this.setState({
      dropdownOpen: dropdownOpen
    });
  };

  updateCorpPrize = async () => {
    await this.corpDb.allDocs({include_docs: true})
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

  auth = async () => {
    await this.pwdDb.find({ selector: {'team_id': this.props.teamId}, fields: ['team_id', 'md5_password'] })
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

  handleSubmitCorp = async (e) => {
    const corpIdx = e.target.id;
    console.log(e.target.parentNode)
    
    await this.handleCancelCorp(e.target.parentNode.parentNode.id);

    await this.corpDb.allDocs({include_docs: true})
      .then((res) => res.rows[0].doc)
      .then(async (data) => {
        data['corp_prize'][corpIdx].push(this.props.teamId.slice(-2));

        await this.corpDb.put({
          _id: data['_id'],
          _rev: data['_rev'],
          corp_prize: data['corp_prize']
        }).then(async () => {
          await this.updateCorpPrize();
        }).then(() => {
          this.setState({isSubmitting: false});
        });
      })
      .catch((err) => {
        console.error(err);
        this.setState({isSubmitting: false});
      });
  };

  handleCancelCorp = async (corpIdx) => {
    this.setState({isSubmitting: true});

    await this.auth();

    await this.corpDb.allDocs({include_docs: true})
      .then((res) => res.rows[0].doc)
      .then(async (data) => {
        const index = data['corp_prize'][corpIdx].indexOf(this.props.teamId.slice(-2));
        if (index !== -1) data['corp_prize'][corpIdx].splice(index, 1);

        await this.corpDb.put({
          _id: data['_id'],
          _rev: data['_rev'],
          corp_prize: data['corp_prize']
        }).then(async () => {
          await this.updateCorpPrize();
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  renderBtn = (corpIdx) => {
    if (this.state.isSubmitting === true) {
      return <Spinner color="secondary" />;
    } else if (this.state.partCorp[corpIdx] === true) {
      if (this.props.over === true) {
        return <Button color="primary" disabled>您報名此企業獎</Button>;
      }
      return (
        <Dropdown id={corpIdx} isOpen={this.state.dropdownOpen[corpIdx]} toggle={this.toggle}>
          <DropdownToggle caret>
            已報名，點選以更改
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem disabled={corpIdx === 0 || this.state.partCorp[0]} id={0} onClick={this.handleSubmitCorp} >
              國泰金控
            </DropdownItem>
            <DropdownItem disabled={corpIdx === 1 || this.state.partCorp[1]} id={1} onClick={this.handleSubmitCorp} >
              聯發科技
            </DropdownItem>
            <DropdownItem disabled={corpIdx === 2 || this.state.partCorp[2]} id={2} onClick={this.handleSubmitCorp} >
              玉山銀行
            </DropdownItem>
            <DropdownItem disabled={corpIdx === 3 || this.state.partCorp[3]} id={3} onClick={this.handleSubmitCorp} >
              中華電信
            </DropdownItem>
            <DropdownItem disabled={corpIdx === 4 || this.state.partCorp[4]} id={4} onClick={this.handleSubmitCorp} >
              意法半導體
            </DropdownItem>
            <DropdownItem disabled={corpIdx === 5 || this.state.partCorp[5]} id={5} onClick={this.handleSubmitCorp} >
              遠傳電信
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
    } else {
      return <Button color="secondary" disabled>未選擇</Button>;
    }
  };

  componentDidMount = this.updateCorpPrize;

  render() {
    return (
    <div>
      <ParticipantNavbar {...this.props} active='corp-prize' />

      <Container>
        <Row>
          {
            this.props.over ?
              <Col style={{ textAlign: 'center', marginTop: '3vh' }}>
                <h4>企業獎報名</h4>
                <h6>已截止</h6>
              </Col> :
              <Col style={{ textAlign: 'center', marginTop: '3vh' }}>
                <h4>企業獎報名</h4>
                <h6>3/30 18:00截止</h6>
                16:00後只能換組，不得新增，請儘速選擇。
            </Col>
          }
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
