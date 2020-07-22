import React, { Component } from 'react';

// NPM imports
import axios from 'axios';
import Grid from '@material-ui/core/Grid';

// Custom import
import SideBar from '../../Components/Landing/SideBar/SideBar';
import { Redirect } from 'react-router-dom';
import DOCIcon from './Assets/DOCIcon.png';
import './DocList.css';
import ls from 'local-storage';

class DoctorList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            doctorList : [],
            appointmentButton : false,
            appointmentPage : false,
            viewAppointmentPage : false,
            selectedDocAddress:"",
            selectedViewDocAddress:"",
        }
    }
    
    componentDidMount() {
        axios.get('http://13.234.75.146:3000/api/admin/doctor/list', {
            headers: {
                'auth-token': ls.get('authToken')
              },
        })
        .then(response => {
            console.log("x",response.data)
            
            this.setState({
                doctorList : response.data,
                appointmentButton: true
            });
        })
        .catch(err => {
            console.log(err)
        });
    }

    handleAppointment = (docAddr) => {
        this.setState({
            appointmentPage : true,
            viewAppointmentPage : false,
            selectedDocAddress : docAddr
        });
        ls.set('docAddr',docAddr);
        console.log("Appoint Page",this.state.appointmentPage);
        console.log("docAddr",docAddr);
    }

    handleViewAppointment = (docAddr) => {
        this.setState({
            viewAppointmentPage : true,
            appointmentPage : false,
            selectedViewDocAddress : docAddr
        });
        ls.set('docAddr',docAddr);
        console.log("View Appoint Page",this.state.viewAppointmentPage);
        console.log("selectedviewdocAddr",docAddr);
    }

    render() {
        return (
            <div>
                <SideBar />

                    <Grid container spacing={3}>
                    <br/>
                        {this.state.doctorList.map((doctor) => {
                            return (
                                <Grid item xs={3}>
                                    <div className="itemList">
                                        <Grid item xs={12}>
                                            <img className="docIcon" src={DOCIcon} alt="icon "/>  
                                        </Grid>
                                        <Grid item xs={12}>
                                            <h1 className="docName">{doctor.name}</h1>    
                                        </Grid>
                                       
                                        <Grid item xs={12}>
                                            <h5 className="docPhone">{doctor.phone}</h5>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <h5 className="docEmail">{doctor.email}</h5>
                                        </Grid>
                                        
                                        <Grid item xs={12}>
                                        {this.state.appointmentButton ? 
                                            <>
                                            <button className = "bookAppointment" onClick={() => {
                                                    this.handleAppointment(doctor.docAddress)
                                                    }}>
                                                Book appointment
                                            </button>
                                            
                                            <button className= "viewAppointment"

                                            onClick={() => {
                                                    this.handleViewAppointment(doctor.docAddress)
                                                }}>
                                                View appointment
                                            </button> 
                                            </>
                                            :
                                            null
                                        }
                                                                    
                                    {this.state.appointmentPage ? 
                                            
                                            <Redirect to= {{
                                                pathname: '/book_appointment',
                                            }} /> 
                                            : 
                                            null
                                        }

                                        {this.state.viewAppointmentPage ? 
                                            
                                            <Redirect to= {{
                                                pathname: '/view_appointment',
                                            }} /> 
                                            : 
                                            null
                                        }
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

export default DoctorList;