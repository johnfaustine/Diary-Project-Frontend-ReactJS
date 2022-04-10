import React, { Component } from "react";
import Auth from "../services/auth-service";

export default class Logout extends Component {
    constructor(props) {
        super(props);
        this.logout();
        this.state = {
        };
    }

    logout() {
        Auth.logout();
        this.props.history.push('/login')
    }

    render() {
    }
}
