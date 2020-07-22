import React, { Component } from 'react';
import './App.css';

// Custom Imports
import Login from '../Components/Login/Login';
import Landing from '../Components/Landing/Landing';
import CreateDoc from '../Components/Doctors/Create/Create';
import Appointment from '../Components/Doctors/BookAppointment';
import CreatePatient from '../Components/Patients/Create/Create';
import ViewAppointment from '../Components/Doctors/ViewAppointment';

// Custom NPM Imports
import { BrowserRouter,Route } from 'react-router-dom';

class App extends Component {
  
  render() {

    return(
    
         <BrowserRouter>
          <Route path ="/" exact render={(props) => <Login/> }  />
          <Route path ="/home" render={(props) => <Landing/> }  />
          <Route path ="/create_doctor" render={(props) => <CreateDoc /> } />
          <Route path ="/create_patient" render={(props) => <CreatePatient /> } />
          <Route path ="/book_appointment" render={(props) => <Appointment /> } />
          <Route path ="/view_appointment" render={(props) => <ViewAppointment /> } />
        </BrowserRouter>
    )
  }
}

export default App;
