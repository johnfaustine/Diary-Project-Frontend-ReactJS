import React, { Component } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';

const api = axios.create({
    baseURL: 'http://localhost:4421/api/account/'
})


export default class ConfirmEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            successful: false,
            message: ""
        };
        this.showMessage();
    }

    showMessage() {
        this.confirmEmail().then(response => {
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
                    message: resMessage,
                    successful: false
                });
            }
        );
    }

    confirmEmail = async () => {
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let userid = params.get('userid');
        let token = params.get('token');
        return await api.get('/confirmemail',
            {
                params:
                {
                    userid: userid,
                    token: token
                }
            })
    }

    render() {
        return (
            <div className="col-md-12">
                <div className="card card-container">

                    <h3 className="display-4 font-weight-light text-center" >Confirm Email</h3>
                  
                    <br/><br/><br/><br/>
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
                    

                    <Link className="text-center" to={"/login"}>Back to Login</Link>

                </div>
            </div>
        );
    }
}
