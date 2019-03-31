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

class MainNavbar extends Component {
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
              <NavLink href="/#about">About</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/#schedule">Schedule</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/#faq">FAQ</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/#sponsors">Sponsors</NavLink>
            </NavItem>
            <NavItem>
              <Link to='/comments'>
                <NavLink active={this.props.active === 'comments'}>
                  留言板
                </NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link to='/login' >
                <NavLink active={this.props.active === 'login'}>參賽者頁面</NavLink>
              </Link>
            </NavItem>
            <NavItem>
              <Link to='/pop-prize/_=_'>
                <NavLink active={this.props.active === 'pop-prize'}>人氣獎實況</NavLink>
              </Link>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

export default MainNavbar;
