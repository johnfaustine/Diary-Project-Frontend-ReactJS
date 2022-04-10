import React, { Component } from "react";
// import authHeader from "../services/auth-header";
import axios from 'axios';
import Button from "react-bootstrap/Button";
import * as moment from 'moment';
import { connect } from 'react-redux';
// import Cookies from 'universal-cookie';

// const cookies = new Cookies();

// const api = axios.create({
//     baseURL: 'http://localhost:4421/api/foods/',
//     headers: authHeader()
// })

class Food extends Component {


    state = {
        foods: [],
        foodDate: moment(new Date()).format('YYYY-MM-DD'),
        foodTime: moment(new Date()).format('HH:mm'),
        foodName: "",
        foodCalorie: 0,
        // sortType: 'desc',
        currentPage: 1,
        take: 10,
        totalPage: 0,
        sortOrder: "date_desc",
        filterByDate: true,
        FoodFilter: "",
        DateFilter: moment(new Date()).format('YYYY-MM-DD'),
        minCalorie: null,
        maxCalorie: null,
        beforeEditedFoodName: "hello",
        editedFoodName: "",
        editedFoodCalorie: 0,
        editedFoodDate: moment(new Date()).format('YYYY-MM-DD'),
        editedFoodTime: moment(new Date()).format('HH:mm'),
        editMode: false,
        filterMessage: '',
        message: '',
        editMessage: '',
        regexp: /^[0-9\b]+$/
    }


    constructor(props) {
        super(props);
        this.getFood();
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeTime = this.onChangeTime.bind(this);
        this.onChangeFoodName = this.onChangeFoodName.bind(this);
        this.onChangeFoodCalorie = this.onChangeFoodCalorie.bind(this);
        this.onChangeDateFilter = this.onChangeDateFilter.bind(this);
        this.onChangeDateFilterCheckBox = this.onChangeDateFilterCheckBox.bind(this);
        this.onChangeFoodFilter = this.onChangeFoodFilter.bind(this);
        this.onChangeMinCalorie = this.onChangeMinCalorie.bind(this);
        this.onChangeMaxCalorie = this.onChangeMaxCalorie.bind(this);
        this.onChangeEditedFoodName = this.onChangeEditedFoodName.bind(this);
        this.onChangeEditedFoodCalorie = this.onChangeEditedFoodCalorie.bind(this);
        this.onChangeEditedDate = this.onChangeEditedDate.bind(this);
        this.onChangeEditedTime = this.onChangeEditedTime.bind(this);

        // this.changeSortType = this.changeSortType.bind(this);
    }

    onChangeDate(e) {
        this.setState({
            foodDate: e.target.value
        });
    }

    onChangeTime(e) {
        this.setState({
            foodTime: e.target.value
        });
    }

    onChangeFoodName(e) {
        this.setState({
            foodName: e.target.value
        });
    }

    // onChangeFoodCalorie(e) {
    //     this.setState({
    //         foodCalorie: e.target.value
    //     });
    // }

    onChangeFoodCalorie(e) {
        let foodCalorie = e.target.value;
        if (foodCalorie !== "" && foodCalorie >= 0 && !isNaN(foodCalorie)) {
            this.setState({
                foodCalorie: foodCalorie,
                message: ""
            })
        }
        else {
            this.setState({
                message: "Please enter a valid amount!"
            })
        }
    }

    onChangeEditedFoodName(e) {
        this.setState({
            editedFoodName: e.target.value
        });
    }

    onChangeEditedFoodCalorie(e) {
        let editedFoodCalorie = e.target.value;

        if (editedFoodCalorie !== "" && editedFoodCalorie >= 0 && !isNaN(editedFoodCalorie)) {
            this.setState({
                editedFoodCalorie: editedFoodCalorie,
                editMessage: ""
            })
        }
        else {
            this.setState({
                editMessage: "Please enter a valid amount!"
            })
        }
    }

    // onChangeEditedFoodCalorie(e) {
    //     this.setState({
    //         editedFoodCalorie: parseInt(e.target.value)
    //     });
    //     console.log(this.state.editedFoodCalorie);
    // }

    onChangeEditedDate(e) {
        this.setState({
            editedFoodDate: e.target.value
        });
    }

    onChangeEditedTime(e) {
        this.setState({
            editedFoodTime: e.target.value
        });
    }

    onChangeDateFilter(e) {
        console.log(this.state.DateFilter);
        this.setState({
            DateFilter: moment(new Date(e.target.value)).format('YYYY-MM-DD'),
            foodDate: e.target.value,
            currentPage: 1
        }, function () {
            console.log(this.state.DateFilter);
            this.getFood();
        });
    }

    onChangeDateFilterCheckBox(e) {
        if (e.target.checked) {
            this.setState({
                DateFilter: moment(new Date()).format('YYYY-MM-DD'),
                filterByDate: true,
                currentPage: 1
            }, function () { this.getFood(); })
        }
        else
            this.setState({
                DateFilter: "",
                filterByDate: false
            }, function () { this.getFood(); })
    }

    onChangeFoodFilter(e) {
        this.setState({
            FoodFilter: e.target.value,
            currentPage: 1
        }, function () {
            console.log(this.state.FoodFilter);
            this.getFood();
        });
    }

    onChangeMinCalorie(e) {
        let minCalorie = e.target.value;

        if (minCalorie >= 0 && !isNaN(minCalorie)) {
            this.setState({
                minCalorie: minCalorie,
                filterMessage: "",
                currentPage: 1
            }, function () {
                console.log(this.state.minCalorie);
                this.getFood();
            });
        }
        else {
            this.setState({
                filterMessage: "Please enter a valid amount!"
            })
        }
    }
    //     let minCalorie = e.target.value;
    //     if (minCalorie === '' || this.state.regexp.test(minCalorie)) {
    //         this.setState({ 
    //             minCalorie: e.target.value,
    //             currentPage: 1 
    //         },function () {
    //             console.log(this.state.minCalorie);
    //             this.getFood();
    //         });
    //     }
    // }

    onChangeMaxCalorie(e) {
        let maxCalorie = e.target.value;

        if (maxCalorie >= 0 && !isNaN(maxCalorie)) {
            this.setState({
                maxCalorie: maxCalorie,
                filterMessage: "",
                currentPage: 1
            }, function () {
                console.log(this.state.maxCalorie);
                this.getFood();
            });
        }
        else {
            this.setState({
                filterMessage: "Please enter a valid amount!"
            })
        }
    }


    prevDay(e) {
        this.setState({
            DateFilter: moment(this.state.DateFilter, "YYYY-MM-DD").subtract(1, 'days').format('YYYY-MM-DD'),
            foodDate: moment(this.state.foodDate, "YYYY-MM-DD").subtract(1, 'days').format('YYYY-MM-DD'),
            currentPage: 1
        }, function () {
            console.log(this.state.DateFilter);
            console.log("fd: " + this.state.foodDate);
            this.getFood();
        });
    }

    nextDay(e) {
        this.setState({
            DateFilter: moment(this.state.DateFilter, "YYYY-MM-DD").add(1, 'days').format('YYYY-MM-DD'),
            foodDate: moment(this.state.foodDate, "YYYY-MM-DD").add(1, 'days').format('YYYY-MM-DD'),
            currentPage: 1
        }, function () {
            console.log(this.state.DateFilter);
            console.log("fd: " + this.state.foodDate);
            this.getFood();
        });
    }

    // changeSortType(e) {
    //     this.setState({
    //         sortType: this.state.sortType === 'asc'? 'desc' : 'asc'
    //     });

    // }


    getFood = async () => {
        try {
            let data = await
                axios.create({
                    baseURL: 'http://localhost:4421/api/foods/',
                    headers: { Authorization: 'Bearer ' + this.props.accessToken }
                }).get('/filter',
                    {
                        params: {
                            searchDate: this.state.DateFilter,
                            searchFood: this.state.FoodFilter,
                            minCalorie: this.state.minCalorie,
                            maxCalorie: this.state.maxCalorie,
                            page: this.state.currentPage,
                            take: this.state.take,
                            sortOrder: this.state.sortOrder
                        },
                        withCredentials: true
                    }).then(({ data }) => data);
            data.data.result.forEach(result => result.editing = false);
            this.setState({ foods: data.data.result, editMode: false, totalPage: data.totalPage });
            console.log(data.totalPage);

        } catch (err) {
            console.log(err)
            window.location.reload();
        }
    }



    createFood = async (dateTime, name, calorie) => {
        try {
            if (parseInt(calorie) >= 0 && !isNaN(calorie)) {
                let res = await
                    axios.create({
                        baseURL: 'http://localhost:4421/api/foods/',
                        headers: { Authorization: 'Bearer ' + this.props.accessToken }
                    }).post('/', { foodDateTime: dateTime, foodName: name, foodCalorie: parseInt(calorie) },
                        { withCredentials: true })
                console.log(res);
                this.getFood();
            }
        } catch (err) {
            console.log(err)
            window.location.reload();
        }
    }

    deleteFood = async (id) => {
        try {
            await
                axios.create({
                    baseURL: 'http://localhost:4421/api/foods/',
                    headers: { Authorization: 'Bearer ' + this.props.accessToken }
                }).delete('/' + id,
                    { withCredentials: true })
            this.getFood();
        } catch (err) {
            console.log(err)
            window.location.reload();
        }
    }

    updateFood = async (id, userId, dateTime, name, calorie) => {
        try {
            if (parseInt(calorie) >= 0 && !isNaN(calorie)) {
                let res = await
                    axios.create({
                        baseURL: 'http://localhost:4421/api/foods/',
                        headers: { Authorization: 'Bearer ' + this.props.accessToken }
                    }).put('/' + id, { foodId: id, userId: userId, foodDateTime: dateTime, foodName: name, foodCalorie: parseInt(calorie) },
                        { withCredentials: true })
                console.log(res);
                this.getFood();
            }
        } catch (err) {
            console.log(err)
            window.location.reload();
        }
    }


    editFood = (food, event) => {

        //console.log(food)
        if (this.state.editMode === false) {
            console.log("edit mode");
            food.editing = true;
            this.setState({
                editMode: true,
                editedFoodDate: moment(new Date(food.foodDateTime)).format('YYYY-MM-DD'),
                editedFoodTime: moment(new Date(food.foodDateTime)).format('HH:mm'),
                editedFoodName: food.foodName,
                editedFoodCalorie: food.foodCalorie,
                editMessage: ''
            });
        }
        else {
            console.log("currently editing");
        }

        //console.log(this.state.editedFoodDate);
        //console.log(this.state.editedFoodTime);
        //console.log(this.state.editedFoodName);
        //console.log(this.state.editedFoodCalorie);
    }

    cancelEdit = (food, event) => {

        console.log(food);
        food.editing = false;
        this.setState({ editMode: false });

        console.log(food);
    }

    doneEdit = (food, event) => {
        //console.log(food);

        console.log(this.state.editedFoodDate);
        console.log(this.state.editedFoodTime);
        console.log(this.state.editedFoodName);
        console.log(this.state.editedFoodCalorie);

        if (this.state.editMessage === '') {
            food.editing = false;

            this.updateFood(
                food.foodId,
                food.userId,
                moment.utc(this.state.editedFoodDate)
                    .startOf('day')
                    .set('hour', this.state.editedFoodTime.split(":")[0])
                    .set('minute', this.state.editedFoodTime.split(":")[1])
                    .toDate(),
                this.state.editedFoodName,
                this.state.editedFoodCalorie);

            // console.log(this.state.editedFoodDate);
            //console.log(this.state.editedFoodTime);
            //console.log(this.state.editedFoodName);
            // console.log(this.state.editedFoodCalorie);
            this.setState({ editMode: false });
        }
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
            this.getFood();
        })
    }

    prevPage() {
        if (this.state.currentPage > 1) {
            this.setState({
                currentPage: this.state.currentPage - 1
            }, function () {
                this.getFood();
            })
        }
    }

    nextPage() {
        if (this.state.currentPage < this.state.totalPage) {
            this.setState({
                currentPage: this.state.currentPage + 1
            }, function () {
                this.getFood();
            })
        }
    }

    sortByDate() {
        this.setState({ sortOrder: this.state.sortOrder === 'date_desc' ? 'date_asc' : 'date_desc' },
            function () {
                console.log(this.state.sortOrder);
                this.getFood()
            })
    }

    sortByName() {
        this.setState({ sortOrder: this.state.sortOrder === 'name_asc' ? 'name_desc' : 'name_asc' },
            function () {
                console.log(this.state.sortOrder);
                this.getFood()
            })
    }

    sortByCalorie() {
        this.setState({ sortOrder: this.state.sortOrder === 'calorie_asc' ? 'calorie_desc' : 'calorie_asc' },
            function () {
                console.log(this.state.sortOrder);
                this.getFood()
            })
    }


    render() {
        // let count = 1;
        //var curr = new Date();
        // const sorted = this.state.foods.sort((a, b) => {
        //     const isReversed = (this.state.sortType === 'asc') ? 1 : -1;
        //     return isReversed * a.foodDateTime.localeCompare(b.foodDateTime);
        // });

        var sum = this.state.foods.reduce(function (r, a) {
            return r + a.foodCalorie;
        }, 0);

        return (
            <div className="container">
                {/* {this.props.isAuthenticated.toString()}
                {this.props.accessToken} */}
                <h1 className="display-3 font-weight-bolder text-center">Food</h1>
                <div className="col-md-12">
                    <div className="card card-container">
                        <div className="form-group">
                            <input type="date" className="form-control" name="Date" value={this.state.foodDate} onChange={this.onChangeDate} required readOnly></input>
                        </div>

                        <div className="form-group">
                            <input type="time" className="form-control" name="Time" value={this.state.foodTime} onChange={this.onChangeTime} required></input>
                        </div>

                        <div className="form-group">
                            <input type="text" className="form-control" name="foodName" onChange={this.onChangeFoodName}></input>
                        </div>

                        <div className="form-group">
                            <input type="number" min="0" className="form-control" defaultValue={this.state.foodCalorie} name="foodCalorie" onChange={this.onChangeFoodCalorie}></input>
                        </div>

                        {this.state.message !== '' ?
                            (<div className="error">{this.state.message}</div>)
                            : (
                                <div></div>
                            )}

                        <div className="form-group">
                            <Button className="btn btn-info btn-block" onClick={() =>
                                this.createFood(
                                    moment.utc(this.state.foodDate)
                                        .startOf('day')
                                        .set('hour', this.state.foodTime.split(":")[0])
                                        .set('minute', this.state.foodTime.split(":")[1])
                                        .toDate(),
                                    this.state.foodName,
                                    this.state.foodCalorie)}
                            >Add new food</Button>
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
                    <input type="text" placeholder="Search Food" onChange={this.onChangeFoodFilter}></input>
                    <br />
                    <input type="text" placeholder="Min Calorie" onChange={this.onChangeMinCalorie}></input>
                    <input type="text" placeholder="Max Calorie" onChange={this.onChangeMaxCalorie}></input>

                    {this.state.filterMessage !== '' ?
                        (<div className="error">{this.state.filterMessage}</div>)
                        : (
                            <div></div>
                        )}

                </div>
                <br />

                {this.state.totalPage > 1 ? this.pageButton() : <div></div>}
                <br />
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col" onClick={() => this.sortByDate()}>Date Time &#10606;</th>
                            <th scope="col" onClick={() => this.sortByName()}>Food Name &#10606;</th>
                            <th scope="col" onClick={() => this.sortByCalorie()}>Food Calorie &#10606;</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* .filter(food => (moment(new Date(food.foodDateTime)).format('YYYY-MM-DD') === this.state.DateFilter)) */}
                        {this.state.foods.map(food =>
                            // onDoubleClick={(event) => this.editFood(food, event)}
                            <tr key={food.foodId} >
                                <td>
                                    {!food.editing ?
                                        <div onDoubleClick={(event) => this.editFood(food, event)}>{new Date(food.foodDateTime).toLocaleString()}</div>
                                        :
                                        <div>
                                            <input type="date" defaultValue={moment(new Date(food.foodDateTime)).format('YYYY-MM-DD')} onChange={this.onChangeEditedDate}
                                                // onBlur={(event) => this.doneEdit(food, event)} 
                                                onKeyUp={(event) => {
                                                    if (event.key === 'Enter') {
                                                        this.doneEdit(food, event);
                                                    } else if (event.key === 'Escape') {
                                                        this.cancelEdit(food, event);
                                                    }
                                                }}
                                            ></input>
                                            <input type="time" defaultValue={moment(new Date(food.foodDateTime)).format('HH:mm')} onChange={this.onChangeEditedTime}
                                                // onBlur={(event) => this.doneEdit(food, event)} 
                                                onKeyUp={(event) => {
                                                    if (event.key === 'Enter') {
                                                        this.doneEdit(food, event);
                                                    } else if (event.key === 'Escape') {
                                                        this.cancelEdit(food, event);
                                                    }
                                                }}
                                            ></input>

                                        </div>
                                    }


                                </td>
                                <td className="highlighted-col" >
                                    {!food.editing ?
                                        <div onDoubleClick={(event) => this.editFood(food, event)}>{food.foodName}</div>
                                        :
                                        <div>
                                            <input type="text" defaultValue={food.foodName} onChange={this.onChangeEditedFoodName}
                                                // onBlur={(event) => this.doneEdit(food, event)} 
                                                onKeyUp={(event) => {
                                                    if (event.key === 'Enter') {
                                                        console.log("enter pressed ")
                                                        this.doneEdit(food, event);
                                                    } else if (event.key === 'Escape') {
                                                        this.cancelEdit(food, event);
                                                    }
                                                }}
                                            ></input>
                                        </div>
                                    }
                                </td>
                                <td className="highlighted-col-calorie" >
                                    {!food.editing ?
                                        <div onDoubleClick={(event) => this.editFood(food, event)}>{food.foodCalorie}</div>
                                        :
                                        <div>
                                            <input type="number" min="0" defaultValue={food.foodCalorie} onInput={this.onChangeEditedFoodCalorie}
                                                // onBlur={(event) => this.doneEdit(food, event)} 
                                                onKeyUp={(event) => {
                                                    if (event.key === 'Enter') {
                                                        console.log("enter pressed ")
                                                        this.doneEdit(food, event);
                                                    } else if (event.key === 'Escape') {
                                                        this.cancelEdit(food, event);
                                                    }
                                                }}
                                            ></input>
                                            {this.state.editMessage !== '' ?
                                                (<div className="error">{this.state.editMessage}</div>)
                                                : (
                                                    <div></div>
                                                )}
                                        </div>
                                    }
                                </td>
                                <td>
                                    {!food.editing ?
                                        <div onDoubleClick={(event) => this.editFood(food, event)}>
                                            <Button variant="light" onClick={(event) => this.editFood(food, event)}>🖉</Button>
                                            <Button variant="light" onClick={() => this.deleteFood(food.foodId)}>✖</Button>
                                        </div>
                                        :
                                        <div>
                                            <Button variant="info" onClick={(event) => this.doneEdit(food, event)}>&#10003;</Button>
                                            <Button variant="light " onClick={(event) => this.cancelEdit(food, event)}>&#10005;</Button>
                                        </div>
                                    }
                                </td>
                            </tr>
                        )}
                        <tr className="total">
                            <td>Total: </td>
                            <td></td>
                            <td className="highlighted-col-calorie" >{sum} calories</td>
                            <td></td>
                        </tr>



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

export default connect(mapStateToProps)(Food)