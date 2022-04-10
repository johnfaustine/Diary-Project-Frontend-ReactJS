import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import authService from "../services/auth-service";

class Login extends Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);

        this.state = {
            email: "",
            emailMessage: "",
            password: "",
            passwordMessage: "",
            loading: false,
            message: ""
        };
    }

    onChangeEmail(e) {
        this.setState({
            email: e.target.value,
            emailMessage: "",
            message: ""
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value,
            passwordMessage: "",
            message: ""
        });

    }

    handleLogin() {

        if (this.state.email === "") {
            this.setState({
                emailMessage: "This field is required."
            });
        }
        if (this.state.password === "") {
            this.setState({
                passwordMessage: "This field is required."
            });
        }

        if (this.state.email !== "" && this.state.password !== "" && this.state.confirmpassword !== "") {

            this.setState({
                emailMessage: "",
                passwordMessage: "",
                message: "",
                loading: true
            }, function () {

                authService.login(this.state.email, this.state.password).then(
                    response => {
                        this.props.setAccessToken(response.token);
                        this.props.handleSuccessfulAuth(response.token);
                        setInterval(() => {
                            console.log("interval refresh after login");
                            authService.refreshToken().then(
                                response => {
                                    this.props.setAccessToken(response.token);
                                },
                                error => {
                                    console.log(error);
                                    //if refresh token error refresh window
                                    window.location.reload();
                                }
                            );

                        }, 240000) //240 seconds
                        this.props.history.push('/')
                        //window.location.reload();

                    },
                    error => {
                        const resMessage =
                            (error.response &&
                                error.response.data &&
                                error.response.data.message) ||
                            error.message ||
                            error.toString();

                        this.setState({
                            loading: false,
                            message: resMessage
                        });
                    }
                );
            })
        }
    }

    render() {
        //onsole.log(this.props);
        return (
            <div className="col-md-12">
                {/* {this.props.isAuthenticated.toString()}
                {this.props.accessToken} */}
                <div className="card card-container">
                    {/* <img
                        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                        alt="profile-img"
                        className="profile-img-card"
                    /> */}
                    <h3 className="display-4 font-weight-light" >Login</h3>

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
                        <button
                            className="btn btn-primary btn-block"
                            onClick={() => this.handleLogin()}
                            disabled={this.state.loading}
                        >
                            {this.state.loading && (
                                <span className="spinner-border spinner-border-sm"></span>
                            )}
                            <span>Login</span>
                        </button>
                    </div>

                    {this.state.message && (
                        <div className="form-group">
                            <div className="alert alert-danger" role="alert">
                                {this.state.message}
                            </div>
                        </div>
                    )}

                    <Link className="text-center" to={"/forgotPassword"}>Forgot Password</Link>

                </div>


            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setAccessToken: (token) => { dispatch({ type: 'SET_TOKEN', token: token }) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
