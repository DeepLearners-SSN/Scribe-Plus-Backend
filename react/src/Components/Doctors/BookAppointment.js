import React, { Component } from 'react';
import axios from 'axios';
import QrReader from 'react-qr-reader';
import SideBar from '../../Components/Landing/SideBar/SideBar';
import DatePicker from 'react-date-picker';
import Timekeeper from 'react-timekeeper';
import Calendar from 'react-calendar';
import ls from 'local-storage';

import './BookAppointment.css';

class BookAppointment extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            selectedDate: '',
            time: null,
            click: false,
            result: undefined,
            scanButton : true,
            patName: "",
            patMobile: "",
            patEmail : "",
            selectedTime: ''
        }
        console.log("Props",props);
        
    }
    
    componentDidMount() {this.formatDate(new Date());}

    handleTime = (e) => {
        console.log(e);
        let tempTime = e.formatted24 + ':00';
        this.setState({
            selectedTime: tempTime
        })
        console.log("temptime",tempTime)
        console.log(this.state.time);
    }

    handleDate = date => {
        console.log(date);
        this.setState({date});
        this.formatDate(date);
    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        let dateFormated = [year, month, day].join('-');
        console.log(dateFormated);
        this.setState({
            selectedDate: dateFormated
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
                console.log(this.state.result)
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
                        patMobile: response.data.patient.phone
                    })
                    console.log("patList",this.state.patName);
                    console.log(this.state.selectedDate);
                    console.log(this.state.selectedTime);
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
                        style={
                            { width: '320px',
                            marginLeft:'10%',
                            marginTop: '-25%'
                        }}
                />   
            </>
        )
    }

    handleBooking = (e) => {
        e.preventDefault();
        console.log(this.state.date);
        console.log(this.state.time);
        console.log(this.state.result);
        this.formSubmit();
    }

    formSubmit() {
            axios.post('http://13.234.75.146:3000/api/doctor/appointment/create', {
                "date": this.state.selectedDate,
                "time": this.state.selectedTime,
                "patientQrCode": this.state.result,
                "doctorAddress": ls.get('docAddr'),
            },{
                headers: {
                    'auth-token': ls.get('authToken')
                },
            })
            .then(response => {
                console.log("Res Data",response.data)
                if(response.status === 200) {
                    alert('Appointment Created')
                }
            }).catch(err => {
                console.log(err)
                alert('Error while creating')
            })
            
    }

    render() {
        return (
            <div className="bookingContainer">
                
                <div className="mainBooking">
            
                <SideBar />

                <div className="bookingLeft">
                <h1 className="pickadate">Pick a Date</h1>
                    <div className="outerLeftBooking">
                        <div className="innerLeftBooking">
                            <div className="leftBookingWrap">
                
                                <Calendar
                                    onChange={this.handleDate}
                                    value={this.state.date}
                                />
                                <p className="pickedDate">Chosen Date : {this.state.selectedDate}</p>
                
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bookingRight">
                <h1 className="scanapat">Scan Patient</h1>
                    <div className="outerBookingScan">
                        <div className="innerBookingScan">
                            <div className="wrapBookingScan">
                                
                                {
                                    this.state.click ? 
                                        this.openScan()
                                    :
                                    <>
                                    {this.state.scanButton ?
                                        <> 
                                            <button className="bookingScanButton" onClick={this.handleScanButton}>Scan</button>
                                                 
                                        </> 
                                        :
                                    <div className="bookingCardWrapper">
                                        <div className="bookingCardDetails">
                                                <h1 className="patDetailsText">PATIENT DETAILS</h1>
                                                <h2 className="patName">{this.state.patName}</h2>
                                                <h5 className="patEmail">{this.state.patEmail}</h5>
                                                <h5 className="patMobile">{this.state.patMobile}</h5>  
                                                
                                        </div>
                                    </div>
                                }
                                </>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                
                <div className="timeMid">
                <h1 className="pickatime">Pick a Time</h1>
                    <Timekeeper
                        className="timePicker"
                        time={this.state.time}
                        onChange={this.handleTime}
                    />
                    <button className="handlebookAppointment" onClick={this.handleBooking}>Book</button>
                </div>

            </div>
            </div>            
        )
    }
}

export default BookAppointment
