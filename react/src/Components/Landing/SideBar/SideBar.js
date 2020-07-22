import React from 'react'

// Custom NPM imports
import {Link} from 'react-router-dom';

// SideBar
import SideNav, { NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Font Awesome Icons
import {faHome} from "@fortawesome/free-solid-svg-icons";
import {faCog} from "@fortawesome/free-solid-svg-icons";
import {faUserInjured} from "@fortawesome/free-solid-svg-icons";
import {faUserMd} from "@fortawesome/free-solid-svg-icons";
import ls from 'local-storage';

const SideBar = () => {
    
    return (
        <div >

            <SideNav style={{height:'100vh'}}>
            <SideNav.Toggle />
            
            <SideNav.Nav defaultSelected="dashboard">
            
                <NavItem eventKey="dashboard">
                    <NavIcon>
                        <FontAwesomeIcon icon={faHome} />
                    </NavIcon>
                    <NavText>
                        <Link to='/home'>
                            DashBoard
                        </Link>
                    </NavText>
                </NavItem>

                <NavItem eventKey="patients">
                    <NavIcon>
                        <FontAwesomeIcon icon={faUserInjured} />
                    </NavIcon>
                    <NavText>
                        Patients
                    </NavText>
                    <NavItem eventKey="patients/create">
                            <NavText>
                                <Link to='/create_patient'>
                                    Create/View Patient
                                </Link>
                            </NavText>
                    </NavItem>
                </NavItem>

                <NavItem eventKey="doctors">
                    <NavIcon>
                        <FontAwesomeIcon icon={faUserMd} />
                    </NavIcon>
                    <NavText>
                        Doctors
                    </NavText>
                    <NavItem eventKey="doctors/create">
                            <NavText>
                                <Link to='/create_doctor'>
                                    Create Doctor
                                </Link>
                            </NavText>
                    </NavItem>
                </NavItem>

                <NavItem eventKey="setting">
                    <NavIcon>
                        <FontAwesomeIcon icon={faCog} />
                    </NavIcon>
                    <NavText>
                        Settings
                    </NavText>
                    <NavItem onSelect = {() => {
                        ls.set('authToken','');
                    }} eventKey="settings/logout">
                            <NavText>
                                <Link to='/'>
                                    Logout
                                </Link>
                            </NavText>
                    </NavItem>
                </NavItem>

            </SideNav.Nav>
            
            </SideNav>
        </div>
    )
}

export default SideBar
