import React, { Component } from 'react';
import axios from 'axios';
import SideBar from '../../Components/Landing/SideBar/SideBar';
import Grid from '@material-ui/core/Grid';
import ls from 'local-storage';

import './ViewAppointment.css';

class ViewAppointment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            appointmentList: [],
            todayList: [],
            date : '',
            todayClick : false,
            docHeaderName : '',
            docHeaderEmail : '',
            docHeaderPhone : '',
        }
    }

    componentDidMount() {
        axios.post('http://13.234.75.146:3000/api/doctor/details', {
            "address" : ls.get('docAddr'),
        },{
            headers: {
                'auth-token': ls.get('authToken')
            },
        })
        .then(response => {
            console.log("resp",response.data);
            if(response.status === 200) {
                this.setState({
                    docHeaderName: response.data.doctor.name,
                    docHeaderEmail: response.data.doctor.email,
                    docHeaderPhone: response.data.doctor.phno
                })
                console.log(this.state.docHeaderName,this.state.docHeaderEmail,this.state.docHeaderPhone); 
            }
        })
        .catch(err => {
            alert("Getting Doc err")
            console.log(err);
        })

        axios.post('http://13.234.75.146:3000/api/doctor/appointment/get',{
            "doctorAddress" : ls.get('docAddr'),
        },{
            headers: {
                'auth-token': ls.get('authToken')
            },
        })
        .then(response => {
            console.log("Appointment List",response.data)
            if(response.status === 200) {
                this.setState({
                    appointmentList: response.data,
                })
            }
            console.log("setstate",this.state.appointmentList);
            console.log("setstate[0]",this.state.appointmentList[0]);
            console.log("chosen doc",this.props.location.state.viewDocAddress);    
        })
        .catch(err => {
            console.log(err)
        });

    }

    // todayAppointment = () => {
    //     this.setState({
    //         date : new Date().toISOString().slice(0,10),
    //         todayClick : true
    //     })

    //     axios.post('http://13.234.64.136:3000/api/doctor/appointment/date', {
    //         "doctorAddress" : this.props.location.state.viewDocAddress,
    //         "date" : this.state.date
    //     },{
    //         headers: {
    //             'auth-token': this.props.getAuth()
    //         },
    //     })
    //     .then(response => {
    //         console.log("Appointment List",response.data)
    //         if(response.status === 200) {
    //             this.setState({
    //                 todayList: response.data
    //             })
    //         }
    //         console.log("setstate",this.state.appointmentList);
    //         console.log("chosen doc",this.props.location.state.viewDocAddress);    
    //     })
    //     .catch(err => {
    //         console.log(err)
    //     });
    // }
    
    render() {
        return (
            <div>
                <SideBar />  

                    <div className="docHeaderContent">
                        <div className="docHeaderText">
                            <h2 className="docHeaderName">{this.state.docHeaderName}</h2>
                            <h2 className="docHeaderEmail">{this.state.docHeaderEmail}</h2>
                            <h2 className="docHeaderPhone">{this.state.docHeaderPhone}</h2>
                        </div>
                    </div>
                
                <Grid container spacing={3}>
                <br />
                    {this.state.appointmentList.map((appointment) => {
                        return (
                            
                            <Grid item xs={4}>
                                    <div className="appList">
                                        
                                        <Grid item xs={12}>
                                            <h3 className="appName">{appointment.patientDetails.name}</h3>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <h3 className="appPhone">{appointment.patientDetails.phone}</h3>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <h3 className="appEmail">{appointment.patientDetails.email}</h3>
                                        </Grid>
                                            
                                        <Grid item xs={12}>
                                            <h5 className="appNumber">Token Number : {appointment.appointment["appointmentNumber"]}</h5>
                                        </Grid>
                                        <Grid className="dispDateTime" item xs={12}>
                                            <h5 className="appDate">{appointment.appointment["date"].substring(0,10)}</h5>
                                            <h5 className="appTime">{appointment.appointment["time"]}</h5>
                                        </Grid>

                                    </div>
                            </Grid>
                            
                        )
                    })}
                </Grid>
            </div>
        )
    }
}

export default ViewAppointment
