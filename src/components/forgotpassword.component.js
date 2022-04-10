import React, { Component } from "react";
import axios from 'axios';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
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

const email = value => {
    if (!isEmail(value)) {
        return (
            <div className="alert alert-danger" role="alert">
                This is not a valid email.
            </div>
        );
    }
};


export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.handleForgotPassword = this.handleForgotPassword.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);

        this.state = {
            email: "",
            successful: false,
            message: ""
        };
    }

    onChangeEmail(e) {
        this.setState({
            email: e.target.value
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
            this.forgotPassword().then(
                response => {
                    this.setState({
                        message: response.data,
                        successful: true
                    });

                    console.log(response)
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


    forgotPassword = async () => {
        return await api.post('/ForgetPassword', null, { params: { email: this.state.email } })
    }

    render() {
        return (
            <div className="col-md-12">
                <div className="card card-container">

                    <h3 className="display-4 font-weight-light" >Forgot Password</h3>

                    <Form
                        onSubmit={this.handleForgotPassword}
                        ref={c => {
                            this.form = c;
                        }}
                    >
                        {!this.state.successful && (
                            <div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        name="email"
                                        value={this.state.email}
                                        onChange={this.onChangeEmail}
                                        validations={[required, email]}
                                    />
                                </div>

                                <div className="form-group">
                                    <button className="btn btn-primary btn-block">Forgot Password</button>
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
