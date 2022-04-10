import React, { Component } from "react";
// import authHeader from "../services/auth-header";
import axios from 'axios';
import Button from "react-bootstrap/Button";
import * as moment from 'moment';
import { connect } from 'react-redux';
// import Cookies from 'universal-cookie';

// const cookies = new Cookies();

// const api = axios.create({
//     baseURL: 'http://localhost:4421/api/finances/',
//     headers: authHeader()
// })

class Finances extends Component {


    state = {
        finances: [],
        financeDate: moment(new Date()).format('YYYY-MM-DD'),
        financeTime: moment(new Date()).format('HH:mm'),
        financeName: "",
        financeIncome: 0.0000,
        financeExpense: 0.0000,
        // sortType: 'desc',
        currentPage: 1,
        take: 10,
        totalPage: 0,
        sortOrder: "date_desc",
        filterByDate: true,
        FinanceFilter: "",
        DateFilter: moment(new Date()).format('YYYY-MM-DD'),
        minIncome: null,
        maxIncome: null,
        minExpense: null,
        maxExpense: null,
        beforeEditedFinanceName: "hello",
        editedFinanceName: "",
        editedFinanceIncome: 0.0000,
        editedFinanceExpense: 0.0000,
        editedFinanceDate: moment(new Date()).format('YYYY-MM-DD'),
        editedFinanceTime: moment(new Date()).format('HH:mm'),
        editMode: false,
        filterMessage: '',
        incomeMessage: '',
        expenseMessage: '',
        editIncomeMessage: '',
        editExpenseMessage: '',
        regexp: /^[0-9\b]+$/
    }


    constructor(props) {
        super(props);
        this.getFinances();
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeTime = this.onChangeTime.bind(this);
        this.onChangeFinanceName = this.onChangeFinanceName.bind(this);
        this.onChangeFinanceIncome = this.onChangeFinanceIncome.bind(this);
        this.onChangeFinanceExpense = this.onChangeFinanceExpense.bind(this);
        this.onChangeDateFilter = this.onChangeDateFilter.bind(this);
        this.onChangeDateFilterCheckBox = this.onChangeDateFilterCheckBox.bind(this);
        this.onChangeFinanceFilter = this.onChangeFinanceFilter.bind(this);
        this.onChangeMinIncome = this.onChangeMinIncome.bind(this);
        this.onChangeMaxIncome = this.onChangeMaxIncome.bind(this);
        this.onChangeMinExpense = this.onChangeMinExpense.bind(this);
        this.onChangeMaxExpense = this.onChangeMaxExpense.bind(this);
        this.onChangeEditedFinanceName = this.onChangeEditedFinanceName.bind(this);
        this.onChangeEditedFinanceIncome = this.onChangeEditedFinanceIncome.bind(this);
        this.onChangeEditedFinanceExpense = this.onChangeEditedFinanceExpense.bind(this);
        this.onChangeEditedDate = this.onChangeEditedDate.bind(this);
        this.onChangeEditedTime = this.onChangeEditedTime.bind(this);

        // this.changeSortType = this.changeSortType.bind(this);
    }

    onChangeDate(e) {
        this.setState({
            financeDate: e.target.value
        });
    }

    onChangeTime(e) {
        this.setState({
            financeTime: e.target.value
        });
    }

    onChangeFinanceName(e) {
        this.setState({
            financeName: e.target.value
        });
    }

    onChangeFinanceIncome(e) {
        this.setState({
            financeIncome: e.target.value
        }, function () {
            //console.log(this.state.financeIncome);
            if (this.state.financeIncome !== "" && this.state.financeIncome >= 0 && !isNaN(this.state.financeIncome)) {
                this.setState({
                    incomeMessage: ""
                })
            }
            else {
                this.setState({
                    incomeMessage: "Please enter a valid amount!"
                })
            }
        });

        // this.setState({
        //     financeIncome: e.target.value
        // });
    }

    onChangeFinanceExpense(e) {
        this.setState({
            financeExpense: e.target.value
        }, function () {
            //console.log(this.state.financeExpense);
            if (this.state.financeExpense !== "" && this.state.financeExpense >= 0 && !isNaN(this.state.financeExpense)) {
                this.setState({
                    expenseMessage: ""
                })
            }
            else {
                this.setState({
                    expenseMessage: "Please enter a valid amount!"
                })
            }
        });

        // this.setState({
        //     financeExpense: e.target.value
        // });
    }

    onChangeEditedFinanceName(e) {
        this.setState({
            editedFinanceName: e.target.value
        });
    }

    onChangeEditedFinanceIncome(e) {
        this.setState({
            editedFinanceIncome: e.target.value
        }, function () {
            //console.log(this.state.editedFinanceIncome);
            if (this.state.editedFinanceIncome !== "" && this.state.editedFinanceIncome >= 0 && !isNaN(this.state.editedFinanceIncome)) {
                this.setState({
                    editIncomeMessage: ""
                })
            }
            else {
                this.setState({
                    editIncomeMessage: "Please enter a valid amount!"
                })
            }
        });

        // this.setState({
        //     editedFinanceIncome: parseFloat(e.target.value).toFixed(2)
        // });
        // console.log(this.state.editedFinanceIncome);
    }

    onChangeEditedFinanceExpense(e) {
        this.setState({
            editedFinanceExpense: e.target.value
        }, function () {
            //console.log(this.state.editedFinanceExpense);
            if (this.state.editedFinanceExpense !== "" && this.state.editedFinanceExpense >= 0 && !isNaN(this.state.editedFinanceExpense)) {
                this.setState({
                    editExpenseMessage: ""
                })
            }
            else {
                this.setState({
                    editExpenseMessage: "Please enter a valid amount!"
                })
            }
        });


        // this.setState({
        //     editedFinanceExpense: parseFloat(e.target.value).toFixed(2)
        // });
        // console.log(this.state.editedFinanceExpense);
    }
    onChangeEditedDate(e) {
        this.setState({
            editedFinanceDate: e.target.value
        });
    }

    onChangeEditedTime(e) {
        this.setState({
            editedFinanceTime: e.target.value
        });
    }

    onChangeDateFilter(e) {
        console.log(this.state.DateFilter);
        this.setState({
            DateFilter: moment(new Date(e.target.value)).format('YYYY-MM-DD'),
            financeDate: e.target.value,
            currentPage: 1
        }, function () {
            console.log(this.state.DateFilter);
            this.getFinances();
        });
    }

    onChangeDateFilterCheckBox(e) {
        if (e.target.checked) {
            this.setState({
                DateFilter: moment(new Date()).format('YYYY-MM-DD'),
                filterByDate: true,
                currentPage: 1
            }, function () { this.getFinances(); })
        }
        else
            this.setState({
                DateFilter: "",
                filterByDate: false
            }, function () { this.getFinances(); })
    }

    onChangeFinanceFilter(e) {
        this.setState({
            FinanceFilter: e.target.value,
            currentPage: 1
        }, function () {
            console.log(this.state.FinanceFilter);
            this.getFinances();
        });
    }

    onChangeMinIncome(e) {
        let minIncome = e.target.value;

        if (minIncome >= 0 && !isNaN(minIncome)) {
            this.setState({
                minIncome: minIncome,
                filterMessage: "",
                currentPage: 1
            }, function () {
                console.log(this.state.minIncome);
                this.getFinances();
            });
        }
        else {
            this.setState({
                filterMessage: "Please enter a valid amount!"
            })
        }
    }
    //     let minIncome = e.target.value;
    //     if (minIncome === '' || this.state.regexp.test(minIncome)) {
    //         this.setState({ 
    //             minIncome: e.target.value,
    //             currentPage: 1 
    //         },function () {
    //             console.log(this.state.minIncome);
    //             this.getFinances();
    //         });
    //     }
    // }

    onChangeMaxIncome(e) {
        let maxIncome = e.target.value;

        if (maxIncome >= 0 && !isNaN(maxIncome)) {
            this.setState({
                maxIncome: maxIncome,
                filterMessage: "",
                currentPage: 1
            }, function () {
                console.log(this.state.maxIncome);
                this.getFinances();
            });
        }
        else {
            this.setState({
                filterMessage: "Please enter a valid amount!"
            })
        }
    }

    onChangeMinExpense(e) {
        let minExpense = e.target.value;

        if (minExpense >= 0 && !isNaN(minExpense)) {
            this.setState({
                minExpense: minExpense,
                filterMessage: "",
                currentPage: 1
            }, function () {
                console.log(this.state.minExpense);
                this.getFinances();
            });
        }
        else {
            this.setState({
                filterMessage: "Please enter a valid amount!"
            })
        }
    }
    //     let minIncome = e.target.value;
    //     if (minIncome === '' || this.state.regexp.test(minIncome)) {
    //         this.setState({ 
    //             minIncome: e.target.value,
    //             currentPage: 1 
    //         },function () {
    //             console.log(this.state.minIncome);
    //             this.getFinances();
    //         });
    //     }
    // }

    onChangeMaxExpense(e) {
        let maxExpense = e.target.value;

        if (maxExpense >= 0 && !isNaN(maxExpense)) {
            this.setState({
                maxExpense: maxExpense,
                filterMessage: "",
                currentPage: 1
            }, function () {
                console.log(this.state.maxExpense);
                this.getFinances();
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
            financeDate: moment(this.state.financeDate, "YYYY-MM-DD").subtract(1, 'days').format('YYYY-MM-DD'),
            currentPage: 1
        }, function () {
            console.log(this.state.DateFilter);
            console.log("fd: " + this.state.financeDate);
            this.getFinances();
        });
    }

    nextDay(e) {
        this.setState({
            DateFilter: moment(this.state.DateFilter, "YYYY-MM-DD").add(1, 'days').format('YYYY-MM-DD'),
            financeDate: moment(this.state.financeDate, "YYYY-MM-DD").add(1, 'days').format('YYYY-MM-DD'),
            currentPage: 1
        }, function () {
            console.log(this.state.DateFilter);
            console.log("fd: " + this.state.financeDate);
            this.getFinances();
        });
    }

    // changeSortType(e) {
    //     this.setState({
    //         sortType: this.state.sortType === 'asc'? 'desc' : 'asc'
    //     });

    // }


    getFinances = async () => {
        try {
            let data = await
                axios.create({
                    baseURL: 'http://localhost:4421/api/finances/',
                    headers: { Authorization: 'Bearer ' + this.props.accessToken }
                }).get('/filter',
                    {
                        params: {
                            searchDate: this.state.DateFilter,
                            searchFinance: this.state.FinanceFilter,
                            minIncome: this.state.minIncome,
                            maxIncome: this.state.maxIncome,
                            minExpense: this.state.minExpense,
                            maxExpense: this.state.maxExpense,
                            page: this.state.currentPage,
                            take: this.state.take,
                            sortOrder: this.state.sortOrder
                        },
                        withCredentials: true
                    }).then(({ data }) => data);
            data.data.result.forEach(result => result.editing = false);
            this.setState({ finances: data.data.result, editMode: false, totalPage: data.totalPage });
            console.log(data.totalPage);

        } catch (err) {
            console.log(err)
            window.location.reload();
        }
    }



    createFinance = async (dateTime, name, income, expense) => {
        try {
            if (parseFloat(income) >= 0 && parseFloat(expense) >= 0 && !isNaN(income) && !isNaN(expense)) {
                let res = await
                    axios.create({
                        baseURL: 'http://localhost:4421/api/finances/',
                        headers: { Authorization: 'Bearer ' + this.props.accessToken }
                    }).post('/', {
                        financeDateTime: dateTime,
                        financeName: name,
                        financeIncome: parseFloat(parseFloat(income).toFixed(2)),
                        financeExpense: parseFloat(parseFloat(expense).toFixed(2))
                    },
                        { withCredentials: true })
                console.log(res)
                this.getFinances();
            }
        } catch (err) {
            console.log(err)
            window.location.reload();
        }
    }

    deleteFinance = async (id) => {
        try {
            await
                axios.create({
                    baseURL: 'http://localhost:4421/api/finances/',
                    headers: { Authorization: 'Bearer ' + this.props.accessToken }
                }).delete('/' + id,
                    { withCredentials: true })
            this.getFinances();
        } catch (err) {
            console.log(err)
            window.location.reload();
        }
    }

    updateFinance = async (id, userId, dateTime, name, income, expense) => {
        try {
            if (parseFloat(income) >= 0 && parseFloat(expense) >= 0 && !isNaN(income) && !isNaN(expense)) {
                let res = await
                    axios.create({
                        baseURL: 'http://localhost:4421/api/finances/',
                        headers: { Authorization: 'Bearer ' + this.props.accessToken }
                    }).put('/' + id, {
                        financeId: id,
                        userId: userId,
                        financeDateTime: dateTime,
                        financeName: name,
                        financeIncome: parseFloat(parseFloat(income).toFixed(2)),
                        financeExpense: parseFloat(parseFloat(expense).toFixed(2))
                    },
                        { withCredentials: true })
                console.log(res)
                this.getFinances();
            }
        } catch (err) {
            console.log(err)
            window.location.reload();
        }
    }


    editFinance = (finance, event) => {

        //console.log(food)
        if (this.state.editMode === false) {
            console.log("edit mode");
            finance.editing = true;
            this.setState({
                editMode: true,
                editedFinanceDate: moment(new Date(finance.financeDateTime)).format('YYYY-MM-DD'),
                editedFinanceTime: moment(new Date(finance.financeDateTime)).format('HH:mm'),
                editedFinanceName: finance.financeName,
                editedFinanceIncome: finance.financeIncome,
                editedFinanceExpense: finance.financeExpense,
                editIncomeMessage: '',
                editExpenseMessage: ''
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

    cancelEdit = (finance, event) => {

        console.log(finance);
        finance.editing = false;
        this.setState({ editMode: false });

        console.log(finance);
    }

    doneEdit = (finance, event) => {
        //console.log(food);

        console.log(this.state.editedFinanceDate);
        console.log(this.state.editedFinanceTime);
        console.log(this.state.editedFinanceName);
        console.log(this.state.editedFinanceIncome);
        console.log(this.state.editedFinanceExpense);
        if (this.state.editIncomeMessage === '' && this.state.editExpenseMessage === '') {
            finance.editing = false;

            this.updateFinance(
                finance.financeId,
                finance.userId,
                moment.utc(this.state.editedFinanceDate)
                    .startOf('day')
                    .set('hour', this.state.editedFinanceTime.split(":")[0])
                    .set('minute', this.state.editedFinanceTime.split(":")[1])
                    .toDate(),
                this.state.editedFinanceName,
                this.state.editedFinanceIncome,
                this.state.editedFinanceExpense

            );

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
            this.getFinances();
        })
    }

    prevPage() {
        if (this.state.currentPage > 1) {
            this.setState({
                currentPage: this.state.currentPage - 1
            }, function () {
                this.getFinances();
            })
        }
    }

    nextPage() {
        if (this.state.currentPage < this.state.totalPage) {
            this.setState({
                currentPage: this.state.currentPage + 1
            }, function () {
                this.getFinances();
            })
        }
    }

    sortByDate() {
        this.setState({ sortOrder: this.state.sortOrder === 'date_desc' ? 'date_asc' : 'date_desc' },
            function () {
                console.log(this.state.sortOrder);
                this.getFinances()
            })
    }

    sortByName() {
        this.setState({ sortOrder: this.state.sortOrder === 'name_asc' ? 'name_desc' : 'name_asc' },
            function () {
                console.log(this.state.sortOrder);
                this.getFinances()
            })
    }

    sortByIncome() {
        this.setState({ sortOrder: this.state.sortOrder === 'income_asc' ? 'income_desc' : 'income_asc' },
            function () {
                console.log(this.state.sortOrder);
                this.getFinances()
            })
    }

    sortByExpense() {
        this.setState({ sortOrder: this.state.sortOrder === 'expense_asc' ? 'expense_desc' : 'expense_asc' },
            function () {
                console.log(this.state.sortOrder);
                this.getFinances()
            })
    }


    render() {
        // let count = 1;
        //var curr = new Date();


        // const sorted = this.state.finances.sort((a, b) => {
        //     const isReversed = (this.state.sortType === 'asc') ? 1 : -1;
        //     return isReversed * a.financeDateTime.localeCompare(b.financeDateTime);
        // });

        var sumIncome = this.state.finances.reduce(function (r, a) {
            return r + a.financeIncome;
        }, 0);
        var sumExpense = this.state.finances.reduce(function (r, a) {
            return r + a.financeExpense;
        }, 0);

        return (
            <div className="container">
                {/* {this.props.isAuthenticated.toString()}
                {this.props.accessToken} */}
                <h1 className="display-3 font-weight-bolder text-center">Finance</h1>
                <div className="col-md-12">
                    <div className="card card-container">
                        <div className="form-group">
                            <input type="date" className="form-control" name="Date" value={this.state.financeDate} onChange={this.onChangeDate} required readOnly></input>
                        </div>

                        <div className="form-group">
                            <input type="time" className="form-control" name="Time" value={this.state.financeTime} onChange={this.onChangeTime} required></input>
                        </div>

                        <div className="form-group">
                            <input type="text" className="form-control" name="financeName" onChange={this.onChangeFinanceName}></input>
                        </div>

                        <div className="form-group">
                            <input type="number" min="0.00" step="0.01" className="form-control" defaultValue={parseFloat(this.state.financeIncome).toFixed(2)} name="financeIncome" onChange={this.onChangeFinanceIncome}></input>
                        </div>

                        {this.state.incomeMessage !== '' ?
                            (<div className="error">{this.state.incomeMessage}</div>)
                            : (
                                <div></div>
                            )}

                        <div className="form-group">
                            <input type="number" min="0.00" step="0.01" className="form-control" defaultValue={parseFloat(this.state.financeExpense).toFixed(2)} name="financeExpense" onChange={this.onChangeFinanceExpense}></input>
                        </div>

                        {this.state.expenseMessage !== '' ?
                            (<div className="error">{this.state.expenseMessage}</div>)
                            : (
                                <div></div>
                            )}

                        <div className="form-group">
                            <Button className="btn btn-info btn-block" onClick={() =>
                                this.createFinance(
                                    moment.utc(this.state.financeDate)
                                        .startOf('day')
                                        .set('hour', this.state.financeTime.split(":")[0])
                                        .set('minute', this.state.financeTime.split(":")[1])
                                        .toDate(),
                                    this.state.financeName,
                                    this.state.financeIncome,
                                    this.state.financeExpense
                                )}
                            >Add new finance</Button>
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
                    <input type="text" placeholder="Search Finance" onChange={this.onChangeFinanceFilter}></input>
                    <br />
                    <input type="text" placeholder="Min Income" onChange={this.onChangeMinIncome}></input>
                    <input type="text" placeholder="Max Income" onChange={this.onChangeMaxIncome}></input>
                    <br />
                    <input type="text" placeholder="Min Expense" onChange={this.onChangeMinExpense}></input>
                    <input type="text" placeholder="Max Expense" onChange={this.onChangeMaxExpense}></input>

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
                            {/* <th scope="col" onClick={() => this.setState({ sortType: this.state.sortType === 'asc' ? 'desc' : 'asc' })}>Date Time &#10606;</th> */}
                            <th scope="col" onClick={() => this.sortByDate()}>Date Time &#10606;</th>
                            <th scope="col" onClick={() => this.sortByName()}>Finance Name &#10606;</th>
                            <th scope="col" onClick={() => this.sortByIncome()}>Income ($) &#10606;</th>
                            <th scope="col" onClick={() => this.sortByExpense()}>Expense ($) &#10606;</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* .filter(food => (moment(new Date(food.foodDateTime)).format('YYYY-MM-DD') === this.state.DateFilter)) */}
                        {this.state.finances.map(finance =>
                            // onDoubleClick={(event) => this.editFood(food, event)}
                            <tr key={finance.financeId} >
                                <td>
                                    {!finance.editing ?
                                        <div onDoubleClick={(event) => this.editFinance(finance, event)}>{new Date(finance.financeDateTime).toLocaleString()}</div>
                                        :
                                        <div>
                                            <input type="date" defaultValue={moment(new Date(finance.financeDateTime)).format('YYYY-MM-DD')} onChange={this.onChangeEditedDate}
                                                // onBlur={(event) => this.doneEdit(food, event)} 
                                                onKeyUp={(event) => {
                                                    if (event.key === 'Enter') {
                                                        this.doneEdit(finance, event);
                                                    } else if (event.key === 'Escape') {
                                                        this.cancelEdit(finance, event);
                                                    }
                                                }}
                                            ></input>
                                            <input type="time" defaultValue={moment(new Date(finance.financeDateTime)).format('HH:mm')} onChange={this.onChangeEditedTime}
                                                // onBlur={(event) => this.doneEdit(food, event)} 
                                                onKeyUp={(event) => {
                                                    if (event.key === 'Enter') {
                                                        this.doneEdit(finance, event);
                                                    } else if (event.key === 'Escape') {
                                                        this.cancelEdit(finance, event);
                                                    }
                                                }}
                                            ></input>

                                        </div>
                                    }


                                </td>
                                <td className="highlighted-col" >
                                    {!finance.editing ?
                                        <div onDoubleClick={(event) => this.editFinance(finance, event)}>{finance.financeName}</div>
                                        :
                                        <div>
                                            <input type="text" defaultValue={finance.financeName} onChange={this.onChangeEditedFinanceName}
                                                // onBlur={(event) => this.doneEdit(food, event)} 
                                                onKeyUp={(event) => {
                                                    if (event.key === 'Enter') {
                                                        console.log("enter pressed ")
                                                        this.doneEdit(finance, event);
                                                    } else if (event.key === 'Escape') {
                                                        this.cancelEdit(finance, event);
                                                    }
                                                }}
                                            ></input>
                                        </div>
                                    }
                                </td>
                                <td className="highlighted-col-income" >
                                    {!finance.editing ?
                                        <div onDoubleClick={(event) => this.editFinance(finance, event)}>{parseFloat(finance.financeIncome).toFixed(2)}</div>
                                        :
                                        <div>
                                            <input type="number" min="0.00" step="0.01" defaultValue={parseFloat(finance.financeIncome).toFixed(2)} onInput={this.onChangeEditedFinanceIncome}
                                                // onBlur={(event) => this.doneEdit(food, event)} 
                                                onKeyUp={(event) => {
                                                    if (event.key === 'Enter') {
                                                        console.log("enter pressed ")
                                                        this.doneEdit(finance, event);
                                                    } else if (event.key === 'Escape') {
                                                        this.cancelEdit(finance, event);
                                                    }
                                                }}
                                            ></input>

                                            {this.state.editIncomeMessage !== '' ?
                                                (<div className="error">{this.state.editIncomeMessage}</div>)
                                                : (
                                                    <div></div>
                                                )}
                                        </div>
                                    }
                                </td>
                                <td className="highlighted-col-expense" >
                                    {!finance.editing ?
                                        <div onDoubleClick={(event) => this.editFinance(finance, event)}>{parseFloat(finance.financeExpense).toFixed(2)}</div>
                                        :
                                        <div>
                                            <input type="number" min="0.00" step="0.01" defaultValue={parseFloat(finance.financeExpense).toFixed(2)} onInput={this.onChangeEditedFinanceExpense}
                                                // onBlur={(event) => this.doneEdit(food, event)} 
                                                onKeyUp={(event) => {
                                                    if (event.key === 'Enter') {
                                                        console.log("enter pressed ")
                                                        this.doneEdit(finance, event);
                                                    } else if (event.key === 'Escape') {
                                                        this.cancelEdit(finance, event);
                                                    }
                                                }}
                                            ></input>
                                            {this.state.editExpenseMessage !== '' ?
                                                (<div className="error">{this.state.editExpenseMessage}</div>)
                                                : (
                                                    <div></div>
                                                )}
                                        </div>
                                    }
                                </td>
                                <td>
                                    {!finance.editing ?
                                        <div onDoubleClick={(event) => this.editFinance(finance, event)}>
                                            <Button variant="light" onClick={(event) => this.editFinance(finance, event)}>🖉</Button>
                                            <Button variant="light" onClick={() => this.deleteFinance(finance.financeId)}>✖</Button>
                                        </div>
                                        :
                                        <div>
                                            <Button variant="info" onClick={(event) => this.doneEdit(finance, event)}>&#10003;</Button>
                                            <Button variant="light " onClick={(event) => this.cancelEdit(finance, event)}>&#10005;</Button>
                                        </div>
                                    }
                                </td>
                            </tr>
                        )}
                        <tr className="total">
                            <td>Total: </td>
                            <td></td>
                            <td className="highlighted-col-income" >$ {parseFloat(sumIncome).toFixed(2)}</td>
                            <td className="highlighted-col-expense" >- ($ {parseFloat(sumExpense).toFixed(2)})</td>
                            <td className="highlighted-col-total" >= $ {parseFloat(sumIncome - sumExpense).toFixed(2)}</td>
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

export default connect(mapStateToProps)(Finances)