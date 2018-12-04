import React, {Component} from 'react';
import { connect } from 'react-redux';
import { loginAction, checkForUserAction, googleLoginAction } from '../actions/actions';
import { Button, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input  } from 'reactstrap';
import { GoogleLogin } from 'react-google-login';


class AuthGateway extends Component {
    constructor(){
        super();
        this.state = {
            loginForm: {
                "username": "",
                "password": "",
                "errors": {},
            },
            registerForm: {
                "username": "",
                "password": "",
                "confirmPassword": "",
                "displayName": "",
                "email": "",
                "errors": {},
            },
            registerModal: false,
        }
    }
    handleChange = (type, e) => {
        e.preventDefault()
        this.setState({
            [type]: {
                ...this.state[type],
                [e.currentTarget.name] : e.currentTarget.value
            }
        })
    }
    toggleRegisterModal = () => {
        this.setState({
          registerModal: !this.state.registerModal
        });
    }
    submitLogin = async (e) => {
        e.preventDefault();
        const valid = await this.props.login(this.state.loginForm);
        if(!valid){
            this.setState({
                loginForm: {...this.state.loginForm,
                            error: true}
            })
        }
    }
    hasValidRegistration = () => {
        const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        let errors = {
            "email": [],
            "username": [],
            "password": [],
            "confirmPassword": [],
            "displayName": ""
        };
        let newUser = this.state.registerForm;
        if(newUser.email === ""){
            errors.email = [...errors.email, "Provide an email address"]
        }
        else if(!newUser.email.match(emailRegex)){
            errors.email = [...errors.email, "Invalid email format"]
        }
        if(newUser.username.length < 2){
            errors.username = [...errors.username, "Username must be more than 2 characters"]
        }
        if(!newUser.password){
            errors.password = [...errors.password, "Provide a password"]
        }
        else if(newUser.password !== newUser.confirmPassword){
            errors.confirmPassword = [...errors.confirmPassword, "Passwords do not match"]
        }
        return errors
    }
    submitRegister = async (e) => {
        e.preventDefault();
        const errors = this.hasValidRegistration();
        if(errors.email.length || errors.username.length  ||
            errors.password.length || errors.confirmPassword.length ){
            this.setState({
                "registerForm": {
                    ...this.state.registerForm,
                    errors: errors
                }
            })
        } else {
            const validRegister = await fetch(`${process.env.REACT_APP_API_HOST}/api/v1/auth/register`, {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({...this.state.registerForm, _csrf: this.props.csrfToken}),
                headers:{
                  'Content-Type': 'application/json'
                }
            })
            const parsedResponse = await validRegister.json()
            if(parsedResponse.status === 200){
                this.props.checkForUser();
            } else {
                this.setState({
                    registerForm: {
                        ...this.state.registerForm,
                        error: parsedResponse.data
                    }
                })
            }
        }

    }
    socialAuthFailure = (response) => {
        this.setState({
            socialAuthError: response.error
        })
    }
    responseGoogle = async (response) => {
            const tokenBlob = new Blob([JSON.stringify({access_token: response.accessToken}, null, 2)], {type : 'application/json'});
            const serverResponse = await fetch(`${process.env.REACT_APP_API_HOST}/api/v1/auth/google`, {
                'credentials':'include',
                'method':'POST',
                body: tokenBlob,
            })
            const token = await serverResponse.headers.get('x-auth-token')
            const parsedResponse = await serverResponse.json()
            this.props.googleLogin({data: parsedResponse, token: token});
    }
    render(){
        return(
            <div>
                {this.state.loginForm.error ? <p>WRONG</p> : null}
                <Row>
                    <Col sm="2" />
                    <Col sm="8" >
                    <Form onSubmit={this.submitLogin}>
                        <FormGroup>
                        <Label for="username">Username</Label>
                        <Input type="text" name="username" id="loginUsername" onChange={this.handleChange.bind(null, "loginForm")} />
                        </FormGroup>
                        <FormGroup>
                        <Label for="password">Password</Label>
                        <Input type="password" name="password" id="loginPassword" onChange={this.handleChange.bind(null, "loginForm")} />
                        </FormGroup>
                        <Button>Login</Button>
                    </Form>
                    <GoogleLogin
                        clientId="640930211298-dchl0606tvv4mqul67dohpluucnacsdq.apps.googleusercontent.com"
                        buttonText="login with google"
                        onSuccess={this.responseGoogle}
                        onFailure={this.socialAuthFailure}
                    />
                    <Button color="success" onClick={this.toggleRegisterModal}>New user? Register</Button>
                        <Modal isOpen={this.state.registerModal} toggle={this.toggle} className={this.props.className}>
                        <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
                        <ModalBody>
                            <Form onSubmit={this.submitRegister}>
                                {JSON.stringify(this.state.registerForm.errors) === "{}" ? null : JSON.stringify(this.state.registerForm.errors)}
                                <FormGroup>
                                <Label for="username">Username</Label>
                                <Input type="text" name="username" id="registerUsername" onChange={this.handleChange.bind(null, "registerForm")} />
                                </FormGroup>
                                <FormGroup>
                                <Label for="displayName">Display Name</Label>
                                <Input type="text" name="displayName" id="registerdisplayName" onChange={this.handleChange.bind(null, "registerForm")} />
                                </FormGroup>
                                <FormGroup>
                                <Label for="email">Email</Label>
                                <Input type="email" name="email" id="registerEmail" onChange={this.handleChange.bind(null, "registerForm")} />
                                </FormGroup>
                                <FormGroup>
                                <Label for="password">Password</Label>
                                <Input type="password" name="password" id="registerPassword" onChange={this.handleChange.bind(null, "registerForm")} />
                                </FormGroup>
                                <FormGroup>
                                <Label for="password">Confirm Password</Label>
                                <Input type="password" name="confirmPassword" id="registerConfirmPassword" onChange={this.handleChange.bind(null, "registerForm")} />
                                </FormGroup>
                                <Button type="submit">Register</Button>
                            </Form>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={this.toggleRegisterModal}>Cancel</Button>
                        </ModalFooter>
                        </Modal>
                </Col>
                </Row>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
      currentUser: state.auth.currentUser
    }
  };
const mapDispatchToProps = (dispatch) => {
    return {
        login: (formData) => { return loginAction(dispatch, formData)},
        googleLogin: () => { return googleLoginAction(dispatch)},
        checkForUser: () => { return checkForUserAction(dispatch) } 
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AuthGateway);