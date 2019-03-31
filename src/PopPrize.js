import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Card,
  CardHeader,
  CardBody,
  CardTitle
} from 'reactstrap';
import axios from 'axios';
import PouchDB from 'pouchdb-browser';
import PouchdbFind from 'pouchdb-find';

import MainNavbar from './MainNavbar'

class PopPrize extends Component {
  constructor(props) {
    super(props);

    this.state = {
      auth: false,
      isSubmitting: true,
      voteCnt: 0,
      popCnt: [[]],
      votePop: [...Array(50)].map(x => false)
    };
    
    PouchDB.plugin(PouchdbFind);    

    const account = 'be8a3d9c-c44b-431c-9a32-69389efeb85a-bluemix';

    const voteApiKey = 'watintengedgerewiteourui'; // Read-only key
    const voteApiPassword = '0f23a24096b641e2b9bc19905c324008b6dcd9a4';

    const popApiKey = 'aughtsiouldwastruldstrac'; // Vulnerable, not a good practice
    const popApiPassword = '73138c34ce9043ab80a52df9a8b5fd67fa02cda3';

    const voteUrl = `https://${voteApiKey}:${voteApiPassword}@${account}.cloudant.com/voting-keys`;
    const popUrl = `https://${popApiKey}:${popApiPassword}@${account}.cloudant.com/pop-prize`;

    this.voteDb = new PouchDB(voteUrl);
    this.popDb = new PouchDB(popUrl);
  }

  updatePopPrize = async () => {
    await this.popDb.allDocs({include_docs: true})
      .then((res) => res.rows[0].doc)
      .then((data) => {
        let voteCnt = 0;
        let votePop = this.state.votePop;

        for (let i = 0; i < 50; i++) {
          if (data['pop_prize'][i].includes(this.props.match.params.key.slice(-4))) {
            voteCnt += 1;
            votePop[i] = true;
          } else {
            votePop[i] = false;
          }
        }

        this.setState({
          voteCnt: voteCnt,
          popCnt: data['pop_prize'].map(x => x.length),
          votePop: votePop
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  auth = async () => {
    await this.voteDb.find({ selector: {'key': this.props.match.params.key}, fields: ['key'] })
      .then((res) => res.docs[0])
      .then(async (data) => {
        if (data && data['key'] === this.props.match.params.key) {
          await this.setState({auth: true});
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  handleSubmitPop = async (e) => {
    const popIdx = e.target.id;

    this.setState({isSubmitting: true});

    await this.auth();
    
    if (this.state.auth === false) return;

    this.popDb.allDocs({include_docs: true})
      .then((res) => res.rows[0].doc)
      .then(async (data) => {
        data['pop_prize'][popIdx].push(this.props.match.params.key.slice(-4));

        await this.popDb.put({
          _id: data['_id'],
          _rev: data['_rev'],
          pop_prize: data['pop_prize']
        }).then(async () => {
          await this.updatePopPrize();
        }).then(() => {
          this.setState({isSubmitting: false});
        });
      })
      .catch((err) => {
        console.error(err);
        this.setState({isSubmitting: false});
      });
  };

  handleCancelPop = async (e) => {
    const popIdx = e.target.id;

    this.setState({isSubmitting: true});

    await this.auth();

    if (this.state.auth === false) return;

    this.popDb.allDocs({include_docs: true})
      .then((res) => res.rows[0].doc)
      .then((data) => {
        const index = data['pop_prize'][popIdx].indexOf(this.props.match.params.key.slice(-4));
        if (index !== -1) data['pop_prize'][popIdx].splice(index, 1);

        this.popDb.put({
          _id: data['_id'],
          _rev: data['_rev'],
          pop_prize: data['pop_prize']
        }).then(async () => {
          await this.updatePopPrize();
        }).then(() => {
          this.setState({isSubmitting: false});
        });
      })
      .catch((err) => {
        console.error(err);
        this.setState({isSubmitting: false});
      });
  };

  renderBtn = (popIdx) => {
    if (this.state.isSubmitting === true) {
      return <Spinner color="secondary" />;
    } else if (this.state.auth === false) {
      return <Button color="secondary" disabled>索取QR Code登入投票</Button>;
    } else if (this.state.votePop[popIdx] === true) {
      return <Button color="danger" id={popIdx} onClick={this.handleCancelPop}>已投給此組，點選取消</Button>;
    } else if (this.state.voteCnt >= 2) {
      return <Button color="secondary" disabled>已投滿2個人氣獎</Button>;
    } else {
      return <Button color="primary" id={popIdx} onClick={this.handleSubmitPop}>投票</Button>
    }
  };

  componentDidMount = async () => {
    await this.auth();
    await this.updatePopPrize();
    this.setState({isSubmitting: false});
  };

  render() {
    return (
    <div>
      <MainNavbar active='pop-prize' />

      <Container>
        <Row>
          <Col style={{ textAlign: 'center', marginTop: '3vh' }}>
            <h4>人氣獎</h4>
          </Col>
        </Row>

        {
          this.state.auth ? 
          <Row>
            <Col style={{ textAlign: 'center', marginTop: '2vh' }}>
              <h6>已投{this.state.voteCnt}個 | 剩餘{2 - this.state.voteCnt}個</h6>
            </Col>
          </Row>
          : null
        }
        
        <Row>
          {
            [...Array(50)].map((_, i) =>
              <Col lg={{ size: 3, offset: 0 }}
                md={{ size: 4, offset: 0 }}
                sm={{ size: 6, offset: 0 }}
                xs={{ size: 6, offset: 0 }}>
                <Card style={{ marginTop: '3vh' }}>
                  <CardHeader tag="h3">{i + 1}</CardHeader>
                  <CardBody>
                    <CardTitle>已獲{this.state.popCnt[i]}票</CardTitle>
                    {this.renderBtn(i)}
                  </CardBody>
                </Card>
              </Col>
            )
          }
        </Row>

      </Container>
    </div>
    );
  }
}

export default PopPrize;
