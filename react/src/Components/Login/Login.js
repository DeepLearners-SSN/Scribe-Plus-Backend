import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import Expandables from './Assets/doctor_expandables.jpg';
import Logo from './Assets/scribeplus.jpg'; 
import ls from 'local-storage';

class Login extends Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            isVerified: false,
            userName: null,
            password: null,
        }
    }

    handleUsername = (e) => {
        this.setState({
            userName: e.target.value
        })
    }

    handlePassword = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    handleLogin = () => {
        this.formSubmit()
    }

    formSubmit() {
        let url = 'http://13.234.75.146:3000/api/admin/login'
        axios.post(url, {
            name: this.state.userName,
            password: this.state.password
        })
        .then(response => {
            console.log(response)
            if(response.status === 200){
                ls.set('authToken',response.headers["auth-token"]);
                console.log(this.props);
                this.setState({
                    isVerified: true,
                });
                
            }
        })
        .catch(err => {
            alert("Login Error")
            console.log(err)
        })
    }

    render() {
        return (
            <div className="loginBg">
                <img src={Logo} className="logo" alt="logo" />
                <div className="loginForm">
                    <div className="formDetails">
                        <div className="floatingLeft"> 
                            <img src={Expandables} height="50%" width="50%" alt="doc">
                            {/* <a href='https://www.freepik.com/free-photos-vectors/medical'>Medical vector created by stories - www.freepik.com</a> */}
                            </img>
                        </div>
                        <div className="floatingRight">
                            <h3 className="adminLoginText">Scribe+</h3>
                            <input className="username" type="text" placeholder="Enter Username" onChange={this.handleUsername}/>
                            <br />
                            <input className="password" type="password" placeholder="Enter Password" onChange={this.handlePassword}/>
                            <br />
                            <button className="loginButton" onClick={this.handleLogin}>LOGIN</button>
                            {this.state.isVerified ? <Redirect to='/home' /> : null}         
                        </div>              
                    </div>
                </div>
                {/* <footer className="footer">
                    © 2020 All rights reserved. Website designed by DeepLearners
                </footer> */}
            </div>
        )
    }
}

export default Login
