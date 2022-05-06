import React from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../Styles/header.css';
import { withRouter } from 'react-router-dom';

import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        border: 'solid 2px brown'
    }
};

class Header extends React.Component {
    constructor() {
        super();
        this.state = {
            signUpModalIsOpen: false,
            loginModalIsOpen: false,
            email: '',
            pwd: '',
            FN: '',
            LN: '',
            isLoggedIn: false,
            userName:undefined
        }
    }

    signUp = () => {
        this.setState({ signUpModalIsOpen: true });
    }

    login = () => {
        this.setState({ loginModalIsOpen: true });
    }

    handleCancelSignUp = () => {
        this.setState({ signUpModalIsOpen: false });
    }

    handleCancelLogin = () => {
        this.setState({ loginModalIsOpen: false });
    }

    handleChange = (event, state) => {
        this.setState({ [state]: event.target.value });
    }

    handleSignUp = () => {
        const { email, pwd, FN, LN } = this.state;
        const signUpObj = {
            email: email,
            password: pwd,
            firstname: FN,
            lastname: LN
        };
        axios({
            method: 'POST',
            url: 'http://localhost:9564/usersignup',
            headers: { 'Content-Type': 'application/json' },
            data: signUpObj
        })
            .then(response => {
                if (response.data.message == 'User SignedUp Sucessfully') {
                    this.setState({
                        signUpModalIsOpen: false,
                        email: '',
                        pwd: '',
                        FN: '',
                        LN: ''
                    });
                    alert(response.data.message);
                }
            })
            .catch(err => console.log(err))
    }

    handleLogin = () => {
        const { email, pwd } = this.state;
        const loginObj = {
            email: email,
            password: pwd
        };
        axios({
            method: 'GET',
            url: 'http://localhost:9564/login',
            headers: { 'Content-Type': 'application/json' },
            data: loginObj
        })
            .then(response => {
                this.setState({
                    isLoggedIn: response.data.isAuthenticated,
                    loginModalIsOpen: false,
                    email: '',
                    pwd: '',
                });
                sessionStorage.setItem('isLoggedIn', response.data.isAuthenticated);
            })
            .catch(err => console.log(err))
    }

    handleLogo = () => {
        this.props.history.push('/');
    }

    responseGoogle = (response) => {
        if(response && response.profileObj.name){
            this.setState({loginModalIsOpen:false,isLoggedIn:true,userName:response.profileObj.name})
        }
        else{
            this.setState({loginModalIsOpen:false})
        }
        

        
    }
    handlelogout=()=>{
        this.setState({isLoggedIn:false,userName:undefined})
    }

    responseFacebook = (response) => {
        if(response && response.name){
            this.setState({loginModalIsOpen:false,isLoggedIn:true,userName:response.name})

        }
        else{
            this.setState({loginModalIsOpen:false})
        }
    }

    render() {
        const { signUpModalIsOpen, loginModalIsOpen,isLoggedIn, userName,email, pwd, FN, LN } = this.state;
        return (
            <div className="header">
                <div className="s-logo" onClick={this.handleLogo}>
                    <p>e!</p>
                </div>
                <div className="btn-group login-block">
                    {isLoggedIn? <span className="login">{userName}</span>:
                    <span onClick={this.login} className="login">LogIn</span>}
                    {isLoggedIn?<span onClick={this.handlelogout} className="signUp">Log out</span>:
                    <span onClick={this.signUp} className="signUp">Create an account</span>
                    }
                    
                </div>
                <Modal

                    style={customStyles}
                >
                    <div>
                        <h3>SignUp User</h3>
                        <div><span>Email : </span><input type="text" value={email} onChange={(event) => this.handleChange(event, 'email')} /></div>
                        <div><span>Password : </span><input type="password" value={pwd} onChange={(event) => this.handleChange(event, 'pwd')} /></div>
                        <div><span>First Name: </span><input type="text" value={FN} onChange={(event) => this.handleChange(event, 'FN')} /></div>
                        <div><span>Last Name: </span><input type="text" value={LN} onChange={(event) => this.handleChange(event, 'LN')} /></div>
                        <button onClick={this.handleSignUp} class="btn btn-sm btn-primary">SignUp</button>
                        <button class="btn btn-sm btn-primary" onClick={this.handleCancelSignUp}>Cancel</button>
                    </div>
                </Modal>
                <Modal
                    isOpen={loginModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <div class="login-heading">Login</div>
                        <div style={{ marginBottom: '2px' }}>
                            <GoogleLogin
                                clientId="992512220330-56nppoe4ma1bms6d8s7g2svdsag5o9oo.apps.googleusercontent.com"
                                buttonText="Continue with Gmail"
                                onSuccess={this.responseGoogle}
                                onFailure={this.responseGoogle}
                                className="btn google"
                                cookiePolicy={'single_host_origin'}
                            /></div>
                        <FacebookLogin
                            appId="241319707687828"
                            textButton="Continue with Facebook"
                            size="metro"
                            fields="name,email,picture"
                            callback={this.responseFacebook}
                            cssClass="btn-md fb"
                            icon="fa-facebook-square"
                        /><br />
                        <button className="btn normal-login">
                            <span className="glyphicon glyphicon-user user-icon"></span>
                            Login with Credentials</button>
                        <hr />
                        <div>Don't have account? <span style={{ color: 'red' }}>SignUp</span></div>
                    </div>
                </Modal>
                <Modal
                    isOpen={signUpModalIsOpen}
                    style={customStyles}
                >
                    <div>
                        <div class="login-heading">Sign Up</div>
                        <div style={{ marginBottom: '2px' }}>
                            <GoogleLogin
                                clientId="745717577080-5uo0jrq7g23qqioe155h28u94a0co1cj.apps.googleusercontent.com"
                                buttonText="Continue with Gmail"
                                onSuccess={this.responseGoogle}
                                onFailure={this.responseGoogle}
                                className="google"
                                cookiePolicy={'single_host_origin'}
                            /></div>
                        <FacebookLogin
                            appId="1938560389620287"
                            textButton="Continue with Facebook"
                            size="metro"
                            fields="name,email,picture"
                            callback={this.responseFacebook}
                            cssClass="btn-md fb"
                            icon="fa-facebook-square"
                        />
                        <hr />
                        <div>Already have an account? <span style={{ color: 'red' }}>Login</span></div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default withRouter(Header);