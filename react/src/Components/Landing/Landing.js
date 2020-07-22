import React, { Component } from 'react';

// Custom Components
import Fab from './FAB/Fab';
import DoctorList from '../Doctors/DoctorList';

import '../../Container/App.css';
import Steth from '../../Assets/steth.png';

class Landing extends Component {
    
    render () {
        return (
            <div>
                  <div className="HeaderWrap">
                    <img className="docHeaderIcon" src = {Steth} alt="headerIcon" />
                    <div>
                      <h1 className="docTextTitle">DOCTORS</h1>
                      <div className="underLine"/>
                    </div>
                  </div>
    
                <div className="gridWrap">
                    <DoctorList />
                </div>
                
                <Fab />
            </div>
        )
    }
}

export default Landing;