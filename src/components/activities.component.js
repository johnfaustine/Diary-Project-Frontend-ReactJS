import React, { Component } from "react";
// import authHeader from "../services/auth-header";
import axios from 'axios';
import Button from "react-bootstrap/Button";
import * as moment from 'moment';
import { connect } from 'react-redux';
// import Cookies from 'universal-cookie';

// const cookies = new Cookies();

// const api = axios.create({
//     baseURL: 'http://localhost:4421/api/activities/',
//     headers: authHeader.getHeader()
// })



class Activities extends Component {


    state = {
        activities: [],
        activityDate: moment(new Date()).format('YYYY-MM-DD'),
        activityTime: moment(new Date()).format('HH:mm'),
        activityName: "",
        // sortType: 'desc',
        currentPage: 1,
        take: 10,
        totalPage: 0,
        sortOrder: "date_desc",
        filterByDate: true,
        ActivityFilter: "",
        DateFilter: moment(new Date()).format('YYYY-MM-DD'),
        beforeEditedActivityName: "hello",
        editedActivityName: "",
        editedActivityDate: moment(new Date()).format('YYYY-MM-DD'),
        editedActivityTime: moment(new Date()).format('HH:mm'),
        editMode: false
    }


    constructor(props) {
        super(props);
        this.getActivities();
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeTime = this.onChangeTime.bind(this);
        this.onChangeActivityName = this.onChangeActivityName.bind(this);
        this.onChangeDateFilter = this.onChangeDateFilter.bind(this);
        this.onChangeDateFilterCheckBox = this.onChangeDateFilterCheckBox.bind(this);
        this.onChangeActivityFilter = this.onChangeActivityFilter.bind(this);
        this.onChangeEditedActivityName = this.onChangeEditedActivityName.bind(this);
        this.onChangeEditedDate = this.onChangeEditedDate.bind(this);
        this.onChangeEditedTime = this.onChangeEditedTime.bind(this);

        // this.changeSortType = this.changeSortType.bind(this);
    }

    onChangeDateFilterCheckBox(e) {
        if (e.target.checked) {
            this.setState({
                DateFilter: moment(new Date()).format('YYYY-MM-DD'),
                filterByDate: true,
                currentPage: 1
            }, function () { this.getActivities(); })
        }
        else
            this.setState({
                DateFilter: "",
                filterByDate: false
            }, function () { this.getActivities(); })
    }

    onChangeDate(e) {
        this.setState({
            activityDate: e.target.value
        });
    }

    onChangeTime(e) {
        this.setState({
            activityTime: e.target.value
        });
    }

    onChangeActivityName(e) {
        this.setState({
            activityName: e.target.value
        });
    }

    onChangeEditedActivityName(e) {
        this.setState({
            editedActivityName: e.target.value
        });
    }
    onChangeEditedDate(e) {
        this.setState({
            editedActivityDate: e.target.value
        });
    }

    onChangeEditedTime(e) {
        this.setState({
            editedActivityTime: e.target.value
        });
    }

    onChangeDateFilter(e) {
        console.log(this.state.DateFilter);
        this.setState({
            DateFilter: moment(new Date(e.target.value)).format('YYYY-MM-DD'),
            activityDate: e.target.value,
            currentPage: 1
        }, function () {
            console.log(this.state.DateFilter);
            this.getActivities();
        });
    }

    onChangeActivityFilter(e) {
        this.setState({
            ActivityFilter: e.target.value,
            currentPage: 1
        }, function () {
            console.log(this.state.ActivityFilter);
            this.getActivities();
        });
    }

    prevDay(e) {
        this.setState({
            DateFilter: moment(this.state.DateFilter, "YYYY-MM-DD").subtract(1, 'days').format('YYYY-MM-DD'),
            activityDate: moment(this.state.activityDate, "YYYY-MM-DD").subtract(1, 'days').format('YYYY-MM-DD'),
            currentPage: 1
        }, function () {
            console.log(this.state.DateFilter);
            console.log("ad: " + this.state.activityDate);
            this.getActivities();
        });
    }

    nextDay(e) {
        this.setState({
            DateFilter: moment(this.state.DateFilter, "YYYY-MM-DD").add(1, 'days').format('YYYY-MM-DD'),
            activityDate: moment(this.state.activityDate, "YYYY-MM-DD").add(1, 'days').format('YYYY-MM-DD'),
            currentPage: 1
        }, function () {
            console.log(this.state.DateFilter);
            console.log("ad: " + this.state.activityDate);
            this.getActivities();
        });
    }

    // changeSortType(e) {
    //     this.setState({
    //         sortType: this.state.sortType === 'asc'? 'desc' : 'asc'
    //     });

    // }


    getActivities = async () => {
        try {
            let data = await
                axios.create({
                    baseURL: 'http://localhost:4421/api/activities/',
                    headers: { Authorization: 'Bearer ' + this.props.accessToken }
                }).get('/filter',
                    {
                        params: {
                            searchDate: this.state.DateFilter,
                            searchActivity: this.state.ActivityFilter,
                            page: this.state.currentPage,
                            take: this.state.take,
                            sortOrder: this.state.sortOrder
                        },
                        withCredentials: true
                    }).then(({ data }) => data);
            data.data.result.forEach(result => result.editing = false);
            this.setState({ activities: data.data.result, editMode: false, totalPage: data.totalPage });
            console.log(data.totalPage);

        } catch (err) {
            console.log(err)
            window.location.reload();
        }
    }

    // getActivities = async () => {
    //     try {
    //         let data = await api.get('/').then(({ data }) => data);
    //         data.forEach(data => data.editing = false);
    //         this.setState({ activities: data });

    //     } catch (err) {
    //         console.log(err)
    //     }
    // }


    createActivity = async (dateTime, name) => {
        try {
            let res = await
                axios.create({
                    baseURL: 'http://localhost:4421/api/activities/',
                    headers: { Authorization: 'Bearer ' + this.props.accessToken }
                }).post('/', { activityDateTime: dateTime, activityName: name },
                    { withCredentials: true })
            console.log(res)
            this.getActivities();
        } catch (err) {
            console.log(err)
            window.location.reload();
            // if (err.response.status === 401) {

            //     var tokenParam = JSON.parse(localStorage.getItem('token'));
            //     var refreshtokenParam = cookies.get('refreshToken', { path: '/' });
            //     localStorage.removeItem("token");
            //     cookies.remove('refreshToken', { path: '/' })
            //     await axios.post('http://localhost:4421/api/token', null, {
            //         params: {
            //             token: tokenParam,
            //             refreshToken: refreshtokenParam
            //         }
            //     })
            //         .then(function (response) {
            //             localStorage.setItem("token", JSON.stringify(response.data.token));
            //             cookies.set('refreshToken', JSON.stringify(response.data.refreshToken), { path: '/' });
            //         })
            //         .catch(function (error) {
            //             console.log(error);
            //         })
            // }
        }
    }

    deleteActivity = async (id) => {
        try {
            await
                axios.create({
                    baseURL: 'http://localhost:4421/api/activities/',
                    headers: { Authorization: 'Bearer ' + this.props.accessToken }
                }).delete('/' + id,
                    { withCredentials: true })
            this.getActivities();
        } catch (err) {
            console.log(err)
            window.location.reload();
            // if (err.response.status === 401) {
            //     await axios.post('http://localhost:4421/api/token', null, {
            //         withCredentials: true,
            //         params: {
            //             token: JSON.parse(localStorage.getItem('token'))
            //         }
            //     })
            //         .then(async function (response) {
            //             localStorage.setItem("token", JSON.stringify(response.data.token)); 
            //             try {
            //                 let data = await api.delete('/' + id)
            //                 this.getActivities();
            //             } catch (err) {
            //                 console.log(err)
            //             }                        
            //         })
            //         .catch(function (error) {
            //             console.log(error);
            //         })
            // }
        }
    }

    updateActivity = async (id, userId, dateTime, name) => {
        try {
            await
                axios.create({
                    baseURL: 'http://localhost:4421/api/activities/',
                    headers: { Authorization: 'Bearer ' + this.props.accessToken }
                }).put('/' + id, { activityId: id, userId: userId, activityDateTime: dateTime, activityName: name },
                    { withCredentials: true })
            this.getActivities();
        } catch (err) {
            console.log(err)
            window.location.reload();
            // if (err.response.status === 401) {

            //     var tokenParam = JSON.parse(localStorage.getItem('token'));
            //     var refreshtokenParam = cookies.get('refreshToken', { path: '/' });
            //     localStorage.removeItem("token");
            //     cookies.remove('refreshToken', { path: '/' })
            //     await axios.post('http://localhost:4421/api/token', null, {
            //         params: {
            //             token: tokenParam,
            //             refreshToken: refreshtokenParam
            //         }
            //     })
            //         .then(function (response) {
            //             localStorage.setItem("token", JSON.stringify(response.data.token));
            //             cookies.set('refreshToken', JSON.stringify(response.data.refreshToken), { path: '/' });
            //         })
            //         .catch(function (error) {
            //             console.log(error);
            //         })
            // }
        }
    }


    editActivity = (activity, event) => {

        if (this.state.editMode === false) {
            console.log(activity)
            activity.editing = true;
            this.setState({
                editMode: true,
                editedActivityDate: moment(new Date(activity.activityDateTime)).format('YYYY-MM-DD'),
                editedActivityTime: moment(new Date(activity.activityDateTime)).format('HH:mm'),
                editedActivityName: activity.activityName
            });
            // this.state.editedActivityDate = moment(new Date(activity.activityDateTime)).format('YYYY-MM-DD');
            // this.state.editedActivityTime = moment(new Date(activity.activityDateTime)).format('HH:mm');
            // this.state.editedActivityName = activity.activityName;
            console.log(this.state.editedActivityDate);
            console.log(this.state.editedActivityTime);
            console.log(this.state.editedActivityName);
        }
        else {
            console.log("Currently in edit mode!");
        }
        //this.state.beforeEditedActivityName = activity.activityName;
        //console.log(this.state.beforeEditedActivityName);        
        //this.setState({ activity });
    }

    cancelEdit = (activity, event) => {
        //activity.activityName = this.state.beforeEditedActivityName;

        console.log(activity);
        activity.editing = false;
        this.setState({ editMode: false });

        console.log(activity);
    }

    doneEdit = (activity, event) => {
        console.log(activity);

        console.log(this.state.editedActivityDate);
        console.log(this.state.editedActivityTime);
        console.log(this.state.editedActivityName);
        activity.editing = false;
        // if (this.state.editedActivityName.length != 0) 
        // {
        this.updateActivity(
            activity.activityId,
            activity.userId,
            moment.utc(this.state.editedActivityDate)
                .startOf('day')
                .set('hour', this.state.editedActivityTime.split(":")[0])
                .set('minute', this.state.editedActivityTime.split(":")[1])
                .toDate(),
            this.state.editedActivityName);
        // }
        // else
        // {
        //      console.log(this.state.beforeEditedActivityName);
        //     this.updateActivity(activity.activityId, activity.userId, activity.activityDateTime, this.state.beforeEditedActivityName)
        // }
        console.log(this.state.editedActivityDate);
        console.log(this.state.editedActivityTime);
        console.log(this.state.editedActivityName);
        this.setState({ editMode: false });

    }

    pageButton() {
        const pageButtons = [];
        for (let page = 1; page <= this.state.totalPage; page++) {
            let variant = this.state.currentPage === page ? "info" : "light"

            if (this.state.currentPage - 2 <= page && page <= this.state.currentPage + 2) {
                pageButtons.push(<Button onClick={() => this.changePage(page)} key={page} variant={variant} >{page}</Button>);
            }
        }
        return (
            <div>
                <Button onClick={() => this.changePage(1)} variant="light" >First</Button>
                <Button onClick={() => this.prevPage()} variant="light" >Previous</Button>
                {pageButtons}
                <Button onClick={() => this.nextPage()} variant="light" >Next</Button>
                <Button onClick={() => this.changePage(this.state.totalPage)} variant="light" >Last</Button>
            </div>

            // <Button onClick={() => this.changePage(1)} className="page-item" >&laquo;</Button>
            // <Button onClick={() => this.prevPage()} className="page-item" >&#8249;</Button>
            // {pageButtons}
            // <Button onClick={() => this.nextPage()} className="page-item" >&#8250;</Button>
            // <Button onClick={() => this.changePage(this.state.totalPage)} className="page-item" >&raquo;</Button>

        );
    }

    changePage(page) {
        this.setState({
            currentPage: page
        }, function () {
            this.getActivities();
        })
    }

    prevPage() {
        if (this.state.currentPage > 1) {
            this.setState({
                currentPage: this.state.currentPage - 1
            }, function () {
                this.getActivities();
            })
        }
    }

    nextPage() {
        if (this.state.currentPage < this.state.totalPage) {
            this.setState({
                currentPage: this.state.currentPage + 1
            }, function () {
                this.getActivities();
            })
        }
    }

    sortByDate() {
        this.setState({ sortOrder: this.state.sortOrder === 'date_desc' ? 'date_asc' : 'date_desc' },
            function () {
                console.log(this.state.sortOrder);
                this.getActivities()
            })
    }

    sortByName() {
        this.setState({ sortOrder: this.state.sortOrder === 'name_asc' ? 'name_desc' : 'name_asc' },
            function () {
                console.log(this.state.sortOrder);
                this.getActivities()
            })
    }
    render() {
        // let count = 1;
        //var curr = new Date();

        // const sorted = this.state.activities.sort((a, b) => {
        //     const isReversed = (this.state.sortType === 'asc') ? 1 : -1;
        //     return isReversed * a.activityDateTime.localeCompare(b.activityDateTime);
        // });

        return (
            <div className="container">
                {/* {this.props.isAuthenticated.toString()}
                {this.props.accessToken} */}
                <h1 className="display-3 font-weight-bolder text-center">Activities</h1>

                <div className="col-md-12">
                    <div className="card card-container">
                        <div className="form-group">
                            <input type="date" className="form-control" name="Date" value={this.state.activityDate} onChange={this.onChangeDate} required readOnly></input>
                        </div>

                        <div className="form-group">
                            <input type="time" className="form-control" name="Time" value={this.state.activityTime} onChange={this.onChangeTime} required></input>
                        </div>

                        <div className="form-group">
                            <input type="text" className="form-control" name="activityName" onChange={this.onChangeActivityName}></input>
                        </div>

                        <div className="form-group">
                            <Button className="btn btn-info btn-block" onClick={() =>
                                this.createActivity(
                                    moment.utc(this.state.activityDate)
                                        .startOf('day')
                                        .set('hour', this.state.activityTime.split(":")[0])
                                        .set('minute', this.state.activityTime.split(":")[1])
                                        .toDate()
                                    , this.state.activityName)}>Add new activity</Button>
                        </div>
                    </div>
                </div>

                <div className="col-md-12 text-center">
                    <br />
                    <label>Filter by date: &nbsp;</label>
                    <input type="checkbox" onChange={this.onChangeDateFilterCheckBox} defaultChecked={this.state.filterByDate} />
                    {this.state.filterByDate ?
                        <div>
                            <Button variant="light" onClick={(e) => this.prevDay(e)}>←</Button>
                            <input type="date" name="Date" value={this.state.DateFilter} onChange={this.onChangeDateFilter} required></input>
                            <Button variant="light" onClick={(e) => this.nextDay(e)}>→</Button>
                        </div>
                        :
                        <div></div>
                    }
                    <input type="text" placeholder="Search Activity" onChange={this.onChangeActivityFilter}></input>
                </div>
                <br />

                {this.state.totalPage > 1 ? this.pageButton() : <div></div>}
                <br />
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col" onClick={() => this.sortByDate()}>Date Time &#10606;</th>
                            <th scope="col" onClick={() => this.sortByName()}>Activity Name &#10606;</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* .filter(activity => (moment(new Date(activity.activityDateTime)).format('YYYY-MM-DD') === this.state.DateFilter)) */}
                        {this.state.activities.map(activity =>
                            // onDoubleClick={(event) => this.editActivity(activity, event)}
                            <tr key={activity.activityId} >
                                <td>
                                    {!activity.editing ?
                                        <div onDoubleClick={(event) => this.editActivity(activity, event)}>{new Date(activity.activityDateTime).toLocaleString()}</div>
                                        :
                                        <div>
                                            <input type="date" defaultValue={moment(new Date(activity.activityDateTime)).format('YYYY-MM-DD')} onChange={this.onChangeEditedDate}
                                                // onBlur={(event) => this.doneEdit(activity, event)} 
                                                onKeyUp={(event) => {
                                                    if (event.key === 'Enter') {
                                                        this.doneEdit(activity, event);
                                                    } else if (event.key === 'Escape') {
                                                        this.cancelEdit(activity, event);
                                                    }
                                                }}
                                            ></input>
                                            <input type="time" defaultValue={moment(new Date(activity.activityDateTime)).format('HH:mm')} onChange={this.onChangeEditedTime}
                                                // onBlur={(event) => this.doneEdit(activity, event)} 
                                                onKeyUp={(event) => {
                                                    if (event.key === 'Enter') {
                                                        this.doneEdit(activity, event);
                                                    } else if (event.key === 'Escape') {
                                                        this.cancelEdit(activity, event);
                                                    }
                                                }}
                                            ></input>

                                        </div>
                                    }


                                </td>
                                <td className="highlighted-col" >
                                    {/* onDoubleClick={() => this.updateActivity(activity.activityId, activity.userId, activity.activityDateTime, "edited activity")} */}
                                    {!activity.editing ?
                                        <div onDoubleClick={(event) => this.editActivity(activity, event)}>{activity.activityName}</div>
                                        :
                                        <div>
                                            <input type="text" defaultValue={activity.activityName} onChange={this.onChangeEditedActivityName}
                                                // onBlur={(event) => this.doneEdit(activity, event)} 
                                                onKeyUp={(event) => {
                                                    if (event.key === 'Enter') {
                                                        console.log("enter pressed ")
                                                        this.doneEdit(activity, event);
                                                    } else if (event.key === 'Escape') {
                                                        this.cancelEdit(activity, event);
                                                    }
                                                }}
                                            ></input>
                                        </div>
                                    }
                                </td>
                                <td>
                                    {!activity.editing ?
                                        <div onDoubleClick={(event) => this.editActivity(activity, event)}>
                                            <Button variant="light" onClick={(event) => this.editActivity(activity, event)}>🖉</Button>
                                            <Button variant="light" onClick={() => this.deleteActivity(activity.activityId)}>✖</Button>
                                        </div>
                                        :
                                        <div>
                                            <Button variant="info" onClick={(event) => this.doneEdit(activity, event)}>&#10003;</Button>
                                            <Button variant="light " onClick={(event) => this.cancelEdit(activity, event)}>&#10005;</Button>
                                        </div>
                                    }
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table >

                {this.state.totalPage > 1 ? this.pageButton() : <div></div>}

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

export default connect(mapStateToProps)(Activities)