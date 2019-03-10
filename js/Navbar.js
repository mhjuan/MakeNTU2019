'use strict';

const e = React.createElement;

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { plainHTML: '' };
  }

  handleMutation = () => {
    const participantButtonContainer = document.querySelector('#participant-button-container');
    
    ReactDOM.render(
      e('div', { onClick: this.props.onParticipantButtonClick }, 'Participant Login'),
      participantButtonContainer
    );

    this.observer.disconnect();
  };

  componentDidMount() {
    fetch('html/navbar.html')
      .then(s => s.text())
      .then(s => this.setState({ plainHTML: s }))
    this.observer = new MutationObserver(this.handleMutation);
    this.observer.observe(this.navbarElement, {
      childList: true,
      attributes: true,
      characterData: true
    });
  }
  
  render() {
    return e(
      'div',
      {
        dangerouslySetInnerHTML: {__html: this.state.plainHTML},
        ref: (e) => { this.navbarElement = e; }
      }
    );
  }
}

export default Navbar;
