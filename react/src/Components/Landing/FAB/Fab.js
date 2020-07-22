import React, { Component } from 'react';

// Floating Action Button
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Container } from 'react-floating-action-button';
import { Redirect } from 'react-router-dom';

class fab extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            switch : false
        }
    }
    
    handleSwitch = () => {
        this.setState({
            switch : true
        })
    }

    render() {
        return (
            <div>
                <Container>
                    {this.state.switch ? 
                        <Redirect to='/create_doctor' />
                        : 
                        <Fab position="right-bottom" slot="fixed" color="secondary" aria-label="add" 
                        onClick = {this.handleSwitch} >
                         <AddIcon />
                        </Fab>
                    }
                </Container>
            </div>
        )
    }
}

export default fab