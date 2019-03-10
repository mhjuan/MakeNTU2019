'use strict';

import Navbar from './Navbar.js'

const e = React.createElement;

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = { participantButtonClicked: false, plainHTML: '' };

    this.handleParticipantButtonClick.bind(this);
  }

  handleParticipantButtonClick = () => {
    this.setState({participantButtonClicked: true});
  };

  componentDidMount() {
    fetch('html/main.html')
      .then(s => s.text())
      .then(s => this.setState({ plainHTML: s }))
  }

  render() {
    const participantButtonClicked = this.state.participantButtonClicked;
    return e('div', null,
      e(Navbar, {onParticipantButtonClick: this.handleParticipantButtonClick}),
      participantButtonClicked ?
        e('div', null) :
        e('div', { dangerouslySetInnerHTML: {__html: this.state.plainHTML} })
    );
  }
}

const pageContainer = document.querySelector('#page-container');
ReactDOM.render(e(Main), pageContainer);
