import React, { Component } from 'react';

// Custom NPM imports
import axios from 'axios';
import SideBar from '../../../Components/Landing/SideBar/SideBar';
import './CreateDoc.css';
import ls from 'local-storage';
import createDocImg from './createDocImg.jpg';

class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: null,
            phno: null,
            email: null,
            password: null
        }   
        console.log(props);
    }

    handleName = (e) => {
        console.log(e.target.value)
        this.setState({
            name: e.target.value
        })
    }

    handleNumber = (e) => {
        console.log(e.target.value)
        this.setState({
            phno: e.target.value
        })
    }

    handleEmail = (e) => {
        console.log(e.target.value)
        this.setState({
            email: e.target.value
        })
    }

    handlePassword = (e) => {
        console.log(e.target.value)
        this.setState({
            password: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        console.log(this.state.name)
        console.log(this.state.phno)
        console.log(this.state.email)
        console.log(this.state.password)
        this.formSubmit()
        console.log("Clicked")
    }

    formSubmit() {
        let url = 'http://13.234.75.146:3000/api/doctor/create';
        axios.post(url,{
            "name": this.state.name,
            "phno": this.state.phno,
            "email": this.state.email,
            "password": this.state.password,
        },{
            headers: {
                'auth-token': ls.get('authToken')
              },
        }).then(response => {
            console.log("Res Data",response.data)
            if(response.status === 200) {
                alert('Doc Created')
            }
        }).catch(err => {
            console.log(err)
            alert('Error while creating')
        })
    }

    render () {
        return (
            <div>
                <SideBar />
                
                <div className="outerBox">
                    <div className = "innerBox">
                        <div className = "formDocDetails">
                            <div className = "floatingImgLeft">
                                <img src = {createDocImg} height = "477px" width ="50%" alt ="docimg" />
                            </div> 
                            <div className = "floatingFormRight">

                                    <input className="nameInput" placeholder="NAME" type="text" onChange={this.handleName}></input>
                                <br></br>

                                    <input className="mobileInput" placeholder="MOBILE" type="text" onChange={this.handleNumber}></input>
                                <br></br>

                                    <input className="mailInput" placeholder="EMAIL" type="text" onChange={this.handleEmail}></input>
                                <br></br>

                                    <input className="passwordInput" placeholder="PASSWORD" type="password" onChange={this.handlePassword}></input>
                                <br></br>
                                
                                <button className="docCreate" onClick={this.handleSubmit}>CREATE</button>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        )
    }
}

export default Create;