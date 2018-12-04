import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import {  Route, Switch, withRouter } from "react-router-dom";
import { Row, Col, Container } from 'reactstrap';
import NavComponent from './NavComponent/NavComponent';
import Main from './Main/Main';
import AuthGateway from './AuthGateway/AuthGateway';
import { fetchCsrfTokenAction, checkForUserAction } from './actions/actions';

class App extends Component {
  componentDidMount = async () => {
    await this.props.checkForUser();
    await this.props.fetchCsrfToken();
  }
  render() {
    return (
      <div className="App">
          <NavComponent />
          <Container>
            <Row>
              <Col sm={12}>
                <Switch>
                  <Route path="/" render={() => (
                    this.props.dataLoaded ?
                      //If the fetch calls are loaded, show either login or main dashboard
                      this.props.currentUser.loggedIn ? <Main /> : <AuthGateway />
                      :
                      //If the fetch calls haven't loaded yet...
                      <img src="/images/loading-spinner.gif" alt="waiting..."></img>
                    )}/>
                </Switch>
              </Col>
            </Row>
          </Container>
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    fetchCsrfToken: () => { fetchCsrfTokenAction(dispatch) },
    checkForUser: () => { checkForUserAction(dispatch)}
  }
};
const mapStateToProps = (state) => {
  return {
    currentUser: state.auth.currentUser,
    dataLoaded: state.auth.dataLoaded
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
