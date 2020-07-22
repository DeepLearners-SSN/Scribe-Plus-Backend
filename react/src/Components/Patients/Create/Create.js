import React, { Component } from 'react';

// Custom NPM imports
import axios from 'axios';
import SideBar from '../../../Components/Landing/SideBar/SideBar';
import QrReader from 'react-qr-reader';
import ls from 'local-storage';

import './CreatePat.css';

class Create extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: null,
            phno: null,
            email: null,
            dob: null,
            gender: null,
            click: false,
            result: undefined,
            scanButton : true,
            patName: "",
            patMobile: "",
            patEmail : "",
            patGender: "",
            patDOB: ""
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

    handleGender = (e) => {
        console.log(e.target.value)
        this.setState({
            gender: e.target.value
        })
    }

    handleAge = (e) => {
        console.log(e.target.value)
        this.setState({
            dob: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        console.log(this.state.name)
        console.log(this.state.phno)
        console.log(this.state.email)
        console.log(this.state.dob)
        console.log(this.state.gender)
        this.formSubmit()
        console.log("Clicked")
    }

    formSubmit() {
        let url = 'http://13.234.75.146:3000/api/patient/create';
        axios.post(url,{
            "name": this.state.name,
            "phno": this.state.phno,
            "email": this.state.email,
            "dob": this.state.dob,
            "gender": this.state.gender
        },{
            headers: {
                'auth-token': ls.get('authToken')
              },
        }).then(response => {
            console.log("Res Data",response.data)
            if(response.status === 200) {
                alert('Patient Created')
            }
        }).catch(err => {
            console.log(err)
            alert('Error while creating')
        })
    }

    handleScanButton = (e) => {
        this.setState({
            click: true
        })
    }

    handleScan = (e) => {
        if (e) {
          this.setState({
            result: e,
            click: false,
            scanButton: false
          })
        
        if(this.state.result !== undefined) {
            axios.post('http://13.234.75.146:3000/api/admin/patient/details', {
            "patientQrCode":this.state.result
        },{
            headers: {
                'auth-token': ls.get('authToken')
            }
        }).then(response => {
            console.log(response.data)
            if(response.status === 200) {
                this.setState({
                    patName: response.data.patient.name,
                    patEmail: response.data.patient.email,
                    patMobile: response.data.patient.phone,
                    patDOB: response.data.patient.dob,
                    patGender: response.data.patient.gender, 
                })
                console.log("patList",this.state.patName)
            }
        }).catch(err => {
            console.log(err)
            })
        }
        }
    }
    
    handleError = err => {
        console.error(err)
    }

    openScan = () => {
        return (
            <>
                <QrReader 
                        delay={300}
                        onError={this.handleError}
                        onScan={this.handleScan}
                        style={{ width: '320px' }}
                />
                
            </>
        )
    } 

    render () {

        return (
            <div className="mainPatDiv">
                
                <SideBar />

                <div className="left">
                
                    <div className="outerPatBox">
                        <div className="innerPatBox">
                            
                            <div className="formPatBox">

                            <h3 className="createPatientTitle">CREATE PATIENT</h3>
                                
                                    <input className="patNameInput" type="text" placeholder="NAME" onChange={this.handleName}></input>
                                <br></br>
                            
                                    <input className="patMobileInput" type="text"placeholder="MOBILE" onChange={this.handleNumber}></input>
                                <br></br>
                            
                                    <input className="patEmailInput" type="text" placeholder="EMAIL" onChange={this.handleEmail}></input>
                                <br></br>

                                    <input className="patGenderInput" type="text" placeholder="GENDER" onChange={this.handleGender}></input>
                                <br></br>

                                    <input className="patAgeInput" type="text" placeholder="DOB" onChange={this.handleAge}></input>
                                <br></br>
                                
                                <button className="patCreate" onClick={this.handleSubmit}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="right">
                    <div className="outerScan">
                        <div className="innerScan">
                            <div className="wrapScan">
                                {
                                    this.state.click ? 
                                        this.openScan()
                                    : 
                                    <>
                                    {this.state.scanButton ?
                                    <> 
                                        <button className="scanButton" onClick={this.handleScanButton}>Scan</button>
                                             
                                    </>  
                                    :
                                    <div className="patCardWrapper">
                                        <div className="cardDetails">
                                            <>
                                                <h1 className="patDetailsText">PATIENT DETAILS</h1>
                                                <h2 className="patName">{this.state.patName}</h2>
                                                
                                                <h5 className="patEmail">{this.state.patEmail}</h5>
                                                <h5 className="patMobile">{this.state.patMobile}</h5>
                                                <h5 className="patGender">{this.state.patGender}</h5>
                                                <h5 className="patDOB">{this.state.patDOB}</h5>  
                                                <button className="anotherScanButton" onClick={this.handleScanButton}>Scan</button>
                                            </>
                                        </div>
                                    </div>
                                    }
                                    </>
                                }

                            </div>
                        </div>
                    </div>
                </div>
        
            </div>
        )
    }
}

export default Create;