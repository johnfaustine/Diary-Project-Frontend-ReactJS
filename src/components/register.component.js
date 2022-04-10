import React, { Component } from "react";
import { isEmail } from "validator";

import AuthService from "../services/auth-service";

export default class Register extends Component {

    state = {
        email: "",
        emailMessage: "",
        password: "",
        passwordMessage: "",
        confirmpassword: "",
        confirmPasswordMessage: "",
        message: ""
    };

    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);

    }

    onChangeEmail(e) {
        let email = e.target.value;
        if (isEmail(email)) {
            this.setState({
                email: email,
                emailMessage: ""
            });
        }
        else {
            this.setState({
                emailMessage: " This is not a valid email."
            });
        }
    }

    onChangePassword(e) {
        let password = e.target.value;
        if (password.length < 6 || password.length > 40) {
            this.setState({
                passwordMessage: "The password must be between 6 and 40 characters."
            });
        }
        else {
            this.setState({
                password: password,
                passwordMessage: ""
            });
        }
    }

    onChangeConfirmPassword(e) {
        let confirmpassword = e.target.value;
        if (confirmpassword.length < 6 || confirmpassword.length > 40) {
            this.setState({
                confirmPasswordMessage: "The confirm password must be between 6 and 40 characters."
            });
        }
        else if (this.state.password !== confirmpassword) {
            this.setState({
                confirmPasswordMessage: "The password and the confirm password does not match."
            });
        }
        else {
            this.setState({
                confirmpassword: confirmpassword,
                confirmPasswordMessage: ""
            });
        }
    }

    handleRegister() {

        if (this.state.emailMessage !== "") {
            this.setState({
                emailMessage: this.state.emailMessage
            });
        }
        else if (this.state.email === "") {
            this.setState({
                emailMessage: "This field is required."
            });
        }
        if (this.state.passwordMessage !== "") {
            this.setState({
                passwordMessage: this.state.passwordMessage
            });
        }
        else if (this.state.password === "") {
            this.setState({
                passwordMessage: "This field is required."
            });
        }
        if (this.state.confirmPasswordMessage !== "") {
            this.setState({
                confirmPasswordMessage: this.state.confirmPasswordMessage
            });
        }
        else if (this.state.confirmpassword === "") {
            this.setState({
                confirmPasswordMessage: "This field is required."
            });
        }

        if (this.state.email !== "" && this.state.password !== "" && this.state.confirmpassword !== "") {

            AuthService.register(
                this.state.email,
                this.state.password,
                this.state.confirmpassword

            ).then(
                response => {
                    this.setState({
                        message: response.data.message,
                        success: true
                    });
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    this.setState({
                        message: resMessage,
                        success: false
                    });
                }
            );
        }
    }

    render() {
        return (
            <div className="col-md-12">
                <div className="card card-container">
                    {/* <img
                        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                        alt="profile-img"
                        className="profile-img-card"
                    /> */}

                    <h3 className="display-4 font-weight-light" >Sign Up</h3>
                    <div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="text"
                                className="form-control"
                                name="email"
                                onChange={this.onChangeEmail}
                            />

                            {this.state.emailMessage !== '' ?
                                (<div className="alert alert-danger" role="alert">{this.state.emailMessage}</div>)
                                : (
                                    <div></div>
                                )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                onChange={this.onChangePassword}
                            />

                            {this.state.passwordMessage !== '' ?
                                (<div className="alert alert-danger" role="alert">{this.state.passwordMessage}</div>)
                                : (
                                    <div></div>
                                )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmpassword">Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                name="confirmpassword"
                                onChange={this.onChangeConfirmPassword}
                            />

                            {this.state.confirmPasswordMessage !== '' ?
                                (<div className="alert alert-danger" role="alert">{this.state.confirmPasswordMessage}</div>)
                                : (
                                    <div></div>
                                )}
                        </div>


                        <div className="form-group">
                            <button className="btn btn-primary btn-block" onClick={() => this.handleRegister()}>Sign Up</button>

                            {this.state.message !== '' ? this.state.success === true ?
                                (<div className="alert alert-success">{this.state.message}</div>)
                                : (<div className="alert alert-danger" role="alert">{this.state.message}</div>)
                                : (
                                    <div></div>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
