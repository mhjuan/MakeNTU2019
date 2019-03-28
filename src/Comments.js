import React, { Component } from 'react';
import {
  Container,
  Row,
  Col
} from 'reactstrap';
import Disqus from 'disqus-react';

import ParticipantNavbar from './ParticipantNavbar'

class Comments extends Component {
  render() {
    const disqusShortname = 'MakeNTU2019';
    const disqusConfig = {
      url: 'https://make.ntuee.org',
      identifier: 'makentu2019',
      title: 'MakeNTU2019',
    };

    return (
      <div>
        <ParticipantNavbar {...this.props} active='comments' />

        <Container>
          <Row>
            <Col>
              <Disqus.DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />            
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Comments;
