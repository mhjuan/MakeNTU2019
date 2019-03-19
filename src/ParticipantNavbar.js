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
              <Link to='/participant/mac-to-ip'>
                <NavLink style={{color: '#ffffff'}} active>MAC to IP</NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link to='/'>
                <NavLink style={{color: '#ffffff'}}>Back to main page</NavLink>
              </Link>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

export default ParticipantNavbar;
