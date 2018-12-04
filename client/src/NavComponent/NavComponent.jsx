import React, {Component} from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logOutAction } from '../actions/actions';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button, } from 'reactstrap';
import LoginModal from './LoginModal/LoginModal';

class NavComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }
  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
        <Navbar color="light" light expand="sm">
          <NavbarBrand tag={Link} to="/">Social Planner Thingy</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
              {this.props.currentUser.loggedIn ?
              //IF LOGGED IN, THIS IS THE NAVBAR VV
              <Nav className="loggedInNav ml-auto" navbar>
              <NavItem>
                <p>Welcome, {this.props.currentUser.displayName}</p>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/friends">Friends</NavLink>
              </NavItem>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Plans
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>
                      <NavLink tag={Link} to="/plans">My Plans</NavLink>
                    </DropdownItem>
                    <DropdownItem>
                    <NavLink tag={Link} to="/plans/new">New Plan</NavLink>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              <NavItem>
                <Button onClick={this.props.logOut}>Logout</Button>
              </NavItem>
              </Nav> :
              //IF NOT LOGGED IN, THIS IS THE NAVBAR VV
              <Nav className="ml-auto" navbar>
              <LoginModal loginSuccess={this.props.loginSuccess} csrfToken={this.props.csrfToken}/>
              </Nav>
              }
          </Collapse>
        </Navbar>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    csrfToken: state.auth.csrfToken,
    currentUser: state.auth.currentUser
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    logOut: () => { logOutAction(dispatch)}
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavComponent));