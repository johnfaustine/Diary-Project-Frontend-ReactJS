import React, { Component } from "react";
import axios from 'axios';
// import Button from "react-bootstrap/Button";
import { connect } from 'react-redux';

class searchActivity extends Component {


    state = {
        activities: [],
        searchActivityPhrase: null,
        sortType: 'desc'
    }


    constructor(props) {
        super(props);
        this.getActivities();
        this.onChangeSearchActivityPhrase = this.onChangeSearchActivityPhrase.bind(this);
    }

    getActivities = async () => {
        try {
            let data = await
                axios.create({
                    baseURL: 'http://localhost:4421/api/Activities/',
                    headers: { Authorization: 'Bearer ' + this.props.accessToken }
                }).get('/Search',
                    {
                        params: {
                            activityName: this.state.searchActivityPhrase
                        },
                        withCredentials: true
                    }).then(({ data }) => data);
            this.setState({
                activities: data
            });
            console.log(this.state.activities);

        } catch (err) {
            console.log(err)
            window.location.reload();
        }
    }
    
    onChangeSearchActivityPhrase(e) {
        this.setState({
            searchActivityPhrase: e.target.value
        },function(){
            console.log(this.state.searchActivityPhrase);
            this.getActivities();
        });
    }

    sort(array) {
        array.sort((a, b) => {
            const isReversed = (this.state.sortType === 'asc') ? 1 : -1;
            return isReversed * a.activityDateTime.localeCompare(b.activityDateTime);
        });
        return array;
    }

    render() {
        //  const sorted = this.state.activities.sort((a, b) => {
        //      const isReversed = (this.state.sortType === 'asc') ? 1 : -1;
        //      return isReversed * a.activityDateTime.localeCompare(b.activityDateTime);
        //  });

        return (
            <div className="container">
                {/* {this.props.isAuthenticated.toString()}
                {this.props.accessToken} */}
                <br/><br/>
                <h1 className="display-4 font-weight-bolder text-center">Search Activity</h1>
                <br/><br/>
                <div className="text-center">
                <input type="text" placeholder="Search Activity" onChange={this.onChangeSearchActivityPhrase}></input>
                
                </div>
                <br/><br/>
                
                { this.state.activities ?
                <div>
                <h1 className="display-5">Results:</h1>
                <br/>
                </div>:
                <div></div>}
                
                { this.state.activities ?
                this.sort(this.state.activities).map(activity =>
                            <div className="" key={activity.activityId} >
                                <div>
                                    {new Date(activity.activityDateTime).toLocaleString()}
                                </div>
                                <div>
                                    {activity.activityName}
                                </div>
                                <br/><br/>
                            </div>
                        ) 
                        :
                        <div></div>}
            </div >
        );
    }
}

const mapStateToProps = (state) => {
    return {
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated
    }
}

export default connect(mapStateToProps)(searchActivity)