import React from 'react'
import { Redirect } from 'react-router-dom'

class LoggedInRoute extends React.Component {

    render() {
        const Component = this.props.component;
        const isAuthenticated = localStorage.getItem('token');
       
        return isAuthenticated ? (
            <Redirect to={{ pathname: '/' }} />
        ) : (
            <Component />
        );
    }
}

export default LoggedInRoute;