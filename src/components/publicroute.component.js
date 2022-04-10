import React from 'react'
import { Route, Redirect } from 'react-router-dom'
// import authService from '../services/auth-service'
import { connect } from 'react-redux';

export const PublicRoute = ({ component: Component, ...rest }) => {

    var state = store.getState();

    return (
        <Route {...rest} render={props => {
            if (!state) {
                return <Component {...props} />;
            } else {
                return (
                    <Redirect
                        to={{
                            pathname: '/',
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