import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  ButtonGroup
} from 'reactstrap';
import Disqus from 'disqus-react';

import MainNavbar from './MainNavbar'

class Comments extends Component {
  constructor(props) {
    super(props);

    this.state = { toggle: false };
  }

  toggle = () => {
    this.setState(state => ({ toggle: !state.toggle }));
  };

  render() {
    const disqusConfig = {
      url: 'https://make.ntuee.org',
      identifier: 'a',
      title: '',
    };

    return (
      <div>
        <MainNavbar active='comments' />

        <Container>
          <Row>
            <Col style={{ textAlign: 'center', marginTop: '3vh' }} >
              <ButtonGroup>
                <Button color="secondary" onClick={this.toggle} disabled={!this.state.toggle} >留言區</Button>
                <Button color="secondary" onClick={this.toggle} disabled={this.state.toggle} >點歌區</Button>
              </ButtonGroup>
            </Col>
          </Row>
          <Row>
            <Col md={{ size: 8, offset: 2 }}>
              <Disqus.DiscussionEmbed 
                shortname={this.state.toggle ? 'makentu2019-songs' : 'makentu2019'}
                config={disqusConfig}
              />            
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Comments;
