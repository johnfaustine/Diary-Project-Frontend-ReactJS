import React, { Component } from "react";
// import authHeader from "../services/auth-header";
import axios from 'axios';
import Button from "react-bootstrap/Button";
import * as moment from 'moment';
import Chart from 'chart.js';
import { connect } from 'react-redux';
let myBarChart;
// Chart.defaults.global.elements.line.tension = 0;
// import Cookies from 'universal-cookie';

// const cookies = new Cookies();

// const api = axios.create({
//   baseURL: 'http://localhost:4421/api/finances/',
//   headers: authHeader()
// })

class FinanceDailyChart extends Component {


  state = {
    finances: [],
    monthFilter: moment(new Date()).format('M'),
    yearFilter: moment(new Date()).format('YYYY'),
    message: ""
    // foodDate: moment(new Date()).format('YYYY-MM-DD'),
    // foodTime: moment(new Date()).format('HH:mm'),
    // foodName: "",
    // foodCalorie: 0,
    // sortType: 'desc',
    // beforeEditedFoodName: "hello",
    // editedFoodName: "",
    // editedFoodCalorie: 0,
    // editedFoodDate: moment(new Date()).format('YYYY-MM-DD'),
    // editedFoodTime: moment(new Date()).format('HH:mm'),
    // editMode: false
  }


  constructor(props) {
    super(props);
    this.getFinances();
    this.canvasRef = React.createRef();
    this.canvasAxisRef = React.createRef();
    this.onChangeMonthFilter = this.onChangeMonthFilter.bind(this);
    this.onChangeYearFilter = this.onChangeYearFilter.bind(this);
  }


  componentDidMount() {
    this.buildChart();
  }

  componentDidUpdate() {
    this.buildChart();
  }

  getDaysInMonthUTC(month, year) {
    var date = new Date(Date.UTC(year, month - 1, 1));
    var dateList = [];
    while (date.getUTCMonth() === month - 1) {
      dateList.push({
        financeDateTime: moment(new Date(date)).format('YYYY-MM-DD'),
        financeIncome: 0,
        financeExpense: 0
      });
      date.setUTCDate(date.getUTCDate() + 1);
    }
    return dateList;
  }

  buildChart = () => {
    const myChartRef = this.canvasRef.current.getContext("2d");
    const myChartAxisRef = this.canvasAxisRef.current.getContext("2d");
    // const { data, average, labels } = this.props;

    if (typeof myBarChart !== "undefined") myBarChart.destroy();

    myBarChart = new Chart(myChartRef, {
      type: "bar",
      data: {
        labels: this.state.finances.map(finance => moment(new Date(finance.Date)).format('D MMM')),
        datasets: [{
          label: "Income ($)",
          data: this.state.finances.map(finance => finance.Income),
          backgroundColor: '#abebc6',
          order: 3
        },
        {
          label: "Expense ($)",
          data: this.state.finances.map(finance => -finance.Expense),
          backgroundColor: '#fc9e79',
          order: 2
        },
        {
          label: "Daily Total ($)",
          data: this.state.finances.map(finance => finance.Income - finance.Expense),
          backgroundColor: '#00A39F',
          order: 1 //this is most front
        }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: true,
        scales: {
          xAxes: [{
            stacked: true,
            ticks: { display: true },
            gridLines: {
              display: true,
              drawBorder: true
            }
          }],
          yAxes: [{
            ticks: {
              display: true,
              precision: 0,
              //min: 0
            },
            gridLines: {
              display: true,
              drawBorder: true
            }
          }]
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              return `$ ${parseFloat(tooltipItem.value).toFixed(2)}`
            }
          }
        },
        animation: {
          onComplete: function () {
            var scale = window.devicePixelRatio;

            var sourceCanvas = myBarChart.chart.canvas;
            var copyWidth = myBarChart.scales['y-axis-0'].width - 5;
            var copyHeight = myBarChart.scales['y-axis-0'].height + myBarChart.scales['y-axis-0'].top + 10;

            var targetCtx = myChartAxisRef

            targetCtx.scale(scale, scale);
            targetCtx.canvas.width = copyWidth * scale;
            targetCtx.canvas.height = copyHeight * scale;

            targetCtx.canvas.style.width = `${copyWidth}px`;
            targetCtx.canvas.style.height = `${copyHeight}px`;
            targetCtx.drawImage(sourceCanvas, 0, 0, copyWidth * scale, copyHeight * scale, 0, 0, copyWidth * scale, copyHeight * scale);

            var sourceCtx = myChartRef;
            sourceCtx.clearRect(0, 0, copyWidth - 0.1 * scale, copyHeight * scale);
          }
        }
      }
    });

  }

  getFinances = async () => {
    try {
      let data = await axios.create({
        baseURL: 'http://localhost:4421/api/finances/',
        headers: { Authorization: 'Bearer ' + this.props.accessToken }
      }).get('/filterMonthYear',
        {
          params: {
            month: this.state.monthFilter,
            year: this.state.yearFilter
          },
          withCredentials: true
        }).then(({ data }) => data);

      const dayIncomeExpense = this.getDaysInMonthUTC(this.state.monthFilter, this.state.yearFilter)

      data = data.concat(dayIncomeExpense);
      //console.log(data);

      const mapper = m => {
        let d = moment(new Date(m.financeDateTime)).format('YYYY-MM-DD');
        let i = Number(m.financeIncome);
        let e = Number(m.financeExpense);
        return { Date: d, Income: i, Expense: e };
      }

      const reducer = (group, current) => {
        let i = group.findIndex(m => (m.Date === current.Date));
        if (i === -1) {
          return [...group, current];
        }

        group[i].Income += current.Income;
        group[i].Expense += current.Expense;
        return group;
      };

      const sorted = data.sort((a, b) => {
        return a.financeDateTime.localeCompare(b.financeDateTime);
      });

      const financeChartData = sorted.map(mapper).reduce(reducer, []);

      this.setState({ finances: financeChartData });

      console.log(this.state.finances)

    } catch (err) {
      console.log(err)
      window.location.reload();
    }
  }

  onChangeMonthFilter(e) {
    //console.log(this.state.yearFilter);
    this.setState({
      monthFilter: e.target.value
    }, function () {
      console.log(this.state.monthFilter);
      if (this.state.monthFilter !== "" && !isNaN(this.state.yearFilter)) {
        this.setState({
          message: ""
        })
        this.getFinances();
      }
      else
        this.setState({
          message: "Please enter a valid month!",
          finances: []
        })
    });
  }

  onChangeYearFilter(e) {
    //console.log(this.state.yearFilter);
    this.setState({
      yearFilter: e.target.value
    }, function () {
      console.log(this.state.yearFilter);
      if (this.state.yearFilter !== "" && !isNaN(this.state.yearFilter)) {
        this.setState({
          message: ""
        })
        this.getFinances();
      }
      else
        this.setState({
          message: "Please enter a valid year!",
          finances: []
        })
    });
  }

  prevMonth(e) {
    if (parseInt(this.state.monthFilter) === 1) {
      console.log('yes');
      this.setState({
        monthFilter: moment(this.state.monthFilter, "M").subtract(1, 'months').format('M'),
        yearFilter: moment(this.state.yearFilter, "YYYY").subtract(1, 'years').format('YYYY')
      }, function () {


        console.log(this.state.monthFilter);
        console.log(this.state.yearFilter);
        this.getFinances();
      })
    }
    else
      this.setState({
        monthFilter: moment(this.state.monthFilter, "M").subtract(1, 'months').format('M')
      }, function () {
        console.log(this.state.monthFilter);
        this.getFinances();
      });
  }

  nextMonth(e) {
    if (parseInt(this.state.monthFilter) === 12) {
      console.log('yes');
      this.setState({
        monthFilter: moment(this.state.monthFilter, "M").add(1, 'months').format('M'),
        yearFilter: moment(this.state.yearFilter, "YYYY").add(1, 'years').format('YYYY')
      }, function () {


        console.log(this.state.monthFilter);
        console.log(this.state.yearFilter);
        this.getFinances();
      })
    }
    else
      this.setState({
        monthFilter: moment(this.state.monthFilter, "M").add(1, 'months').format('M')
      }, function () {


        console.log(this.state.monthFilter);
        console.log(this.state.yearFilter);
        this.getFinances();
      });
  }

  render() {
    var sumIncome = this.state.finances.reduce(function (r, a) {
      return r + a.Income;
    }, 0);
    var sumExpense = this.state.finances.reduce(function (r, a) {
      return r + a.Expense;
    }, 0);
    var monthTotal = sumIncome - sumExpense;

    return (
      // <div>
      <div className="container">
        {/* {this.props.isAuthenticated.toString()}
        {this.props.accessToken} */}
        <h1 className="display-3 font-weight-bolder text-center">Finance</h1>
        <br />
        <div className="col-md-12 text-center">
          <h4>Filter by Month & Year: </h4>

          <Button variant="light" onClick={(e) => this.prevMonth(e)}>←</Button>
          <input className="inputMonth" type="number" min="1" max="12" name="Month" value={this.state.monthFilter} onChange={this.onChangeMonthFilter} required></input>
          <input className="inputYear" type="number" min="1" name="Year" value={this.state.yearFilter} onChange={this.onChangeYearFilter} required></input>
          <Button variant="light" onClick={(e) => this.nextMonth(e)}>→</Button>


          {this.state.message !== '' ?
            (<div className="alert alert-danger inputMessage" role="alert">{this.state.message}</div>)
            : (
              <div></div>
            )}

          <br />

          <h3 className="font-weight-bolder text-center">Daily Income and Expense for {moment(this.state.monthFilter, 'M').format("MMMM")} {this.state.yearFilter} </h3>
          <br />
          <h5 className="font-weight-bolder text-center ">Income in {moment(this.state.monthFilter, 'M').format("MMMM")}: ${parseFloat(sumIncome).toFixed(2)} </h5>
          <h5 className="font-weight-bolder text-center">Expense in {moment(this.state.monthFilter, 'M').format("MMMM")}: ${parseFloat(sumExpense).toFixed(2)} </h5>
          <h5 className="font-weight-bolder text-center">Total in {moment(this.state.monthFilter, 'M').format("MMMM")}: ${parseFloat(monthTotal).toFixed(2)} </h5>
          <br />
        </div>


        <div className="chartWrapper ">
          <div className="chartAreaWrapper">
            <div className="chartAreaWrapper2">
              <canvas height="400" width="1600" ref={this.canvasRef} />
            </div>
          </div>
          <canvas height="400" width="0" ref={this.canvasAxisRef} />
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

export default connect(mapStateToProps)(FinanceDailyChart)