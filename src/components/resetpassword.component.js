import React, { Component } from "react";
import axios from 'axios';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { Link } from 'react-router-dom';

const api = axios.create({
    baseURL: 'http://localhost:4421/api/account/'
})

const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

const vpassword = value => {
    if (value.length < 6 || value.length > 40) {
        return (
            <div className="alert alert-danger" role="alert">
                The password must be between 6 and 40 characters.
            </div>
        );
    }
};

const vconfirmpassword = value => {
    if (value.length < 6 || value.length > 40) {
        return (
            <div className="alert alert-danger" role="alert">
                The confirm password must be between 6 and 40 characters.
            </div>
        );
    }
};


export default class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.handleForgotPassword = this.handleForgotPassword.bind(this);
        this.onChangeNewPassword = this.onChangeNewPassword.bind(this);
        this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);

        this.state = {
            password: "",
            confirmpassword: "",
            successful: false,
            message: ""
        };
    }

    onChangeNewPassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    onChangeConfirmPassword(e) {
        this.setState({
            confirmpassword: e.target.value
        });
    }


    handleForgotPassword(e) {
        e.preventDefault();

        this.setState({
            message: "",
            successful: false
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            this.resetPassword().then(
                response => {
                    this.setState({
                        message: response.data,
                        successful: true
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
                        successful: false,
                        message: resMessage
                    });

                    //console.log(error)
                }

            );
        }
    }


    resetPassword = async () => {
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let email = params.get('email');
        let token = params.get('token');
        return await api.post('/ResetPassword',
            {
                newpassword: this.state.password,
                confirmpassword: this.state.confirmpassword
            },
            {
                params:
                {
                    email: email,
                    token: token
                }
            })
    }

    render() {
        return (
            <div className="col-md-12">
                <div className="card card-container">

                    <h3 className="display-4 font-weight-light" >Reset Password</h3>

                    <Form
                        onSubmit={this.handleForgotPassword}
                        ref={c => {
                            this.form = c;
                        }}
                    >
                        {!this.state.successful && (
                            <div>

                                <div className="form-group">
                                    <label htmlFor="password">New Password</label>
                                    <Input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        value={this.state.password}
                                        onChange={this.onChangeNewPassword}
                                        validations={[required, vpassword]}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmpassword">Confirm Password</label>
                                    <Input
                                        type="password"
                                        className="form-control"
                                        name="confirmpassword"
                                        value={this.state.confirmpassword}
                                        onChange={this.onChangeConfirmPassword}
                                        validations={[required, vconfirmpassword]}
                                    />
                                </div>


                                <div className="form-group">
                                    <button className="btn btn-primary btn-block">Reset Password</button>
                                </div>
                            </div>
                        )}

                        {this.state.message && (
                            <div className="form-group">
                                <div
                                    className={
                                        this.state.successful
                                            ? "alert alert-success"
                                            : "alert alert-danger"
                                    }
                                    role="alert"
                                >
                                    {this.state.message}
                                </div>
                            </div>
                        )}
                        <CheckButton
                            style={{ display: "none" }}
                            ref={c => {
                                this.checkBtn = c;
                            }}
                        />
                    </Form>

                    <Link className="text-center" to={"/login"}>Back to Login</Link>

                </div>
            </div>
        );
    }
}
