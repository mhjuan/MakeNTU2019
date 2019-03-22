import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'

class ParticipantNavbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  toggle = () => {
    this.setState({isOpen: !this.state.isOpen})
  }

  render() {
    return (
      <Navbar dark expand="md" style={{backgroundColor: '#008080f0'}}>
        <Link to='/'>
          <NavbarBrand style={{color: '#ffffff'}}>MakeNTU</NavbarBrand>
        </Link>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <NavItem>
              <Link to='/'>
                <NavLink>Back to main page</NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <NavLink href='https://tlk.io/makentu2019' target='_blank'>
                tlk.io <FontAwesomeIcon icon={faExternalLinkAlt} />
              </NavLink>
            </NavItem>
            <NavItem>
              <Link to='/participant/mac-to-ip'>
                <NavLink active>MAC to IP</NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link to='/'>
                <NavLink onClick={this.props.onLoggedOut}>Logout</NavLink>
              </Link>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

export default ParticipantNavbar;
