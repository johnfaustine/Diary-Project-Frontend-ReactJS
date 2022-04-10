import React from 'react'
import { Route, Redirect } from 'react-router-dom'
// import authService from '../services/auth-service'
import store from '../index';

export const ProtectedRoute = ({ component: Component, ...rest }) => {
    
    var state = store.getState();

    return (
        <Route {...rest} render={props => {
            if (state.accessToken) {
                return <Component {...props} />;
            } else {
                return (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: {
                                from: props.location
                            }
                        }}
                    />
                );
            }
        }}
        />
    );
};