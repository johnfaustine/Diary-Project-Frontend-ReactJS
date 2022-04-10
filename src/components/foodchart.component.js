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
//   baseURL: 'http://localhost:4421/api/foods/',
//   headers: { Authorization: 'Bearer ' + this.props.accessToken }
// })

class FoodChart extends Component {


  state = {
    foods: [],
    monthFilter: moment(new Date()).format('M'),
    yearFilter: moment(new Date()).format('YYYY'),
    message: ""
    // DateFilter: moment(new Date()).format('YYYY-MM-DD')
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
    console.log(props.token);
    this.getFood();
    this.canvasRef = React.createRef();
    this.canvasAxisRef = React.createRef();
    this.onChangeMonthFilter = this.onChangeMonthFilter.bind(this);
    this.onChangeYearFilter = this.onChangeYearFilter.bind(this);
    // this.onChangeDateFilter = this.onChangeDateFilter.bind(this);
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
      dateList.push({ foodDateTime: moment(new Date(date)).format('YYYY-MM-DD'), foodCalorie: 0 });
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
        labels: this.state.foods.map(food => moment(new Date(food.Date)).format('D MMM')),
        datasets: [{
          label: "Calories",
          data: this.state.foods.map(food => food.Calorie),
          backgroundColor: '#00A39F'
        }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: true,
        scales: {
          xAxes: [{
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
              min: 0
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
              return `${tooltipItem.value} Calories`
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
        // {

        //   onProgress: function () {
        //     var sourceCanvas = myBarChart.chart.canvas;
        //     var copyWidth = myBarChart.scales['y-axis-0'].width - 0;
        //     var copyHeight = myBarChart.scales['y-axis-0'].height + myBarChart.scales['y-axis-0'].top + 10;
        //     var targetCtx = myChartAxisRef;
        //     targetCtx.canvas.width = copyWidth;
        //     targetCtx.drawImage(sourceCanvas, 0, 0, copyWidth, copyHeight, 0, 0, copyWidth, copyHeight);
        //   }
        // }
      }
    });

  }

  getFood = async () => {
    try {
      console.log(this.state.token);
      let data = await axios.create({
        baseURL: 'http://localhost:4421/api/foods/',
        headers: { Authorization: 'Bearer ' + this.props.accessToken }
      }).get('/filterMonthYear',
        {
          params: {
            month: this.state.monthFilter,
            year: this.state.yearFilter
          },
          withCredentials: true
        }).then(({ data }) => data);

      const dayCalorie = this.getDaysInMonthUTC(this.state.monthFilter, this.state.yearFilter);

      data = data.concat(dayCalorie);
      //console.log(data);

      const mapper = m => {
        let d = moment(new Date(m.foodDateTime)).format('YYYY-MM-DD');
        let c = Number(m.foodCalorie);
        return { Date: d, Calorie: c };
      }

      const reducer = (group, current) => {
        let i = group.findIndex(m => (m.Date === current.Date));
        if (i === -1) {
          return [...group, current];
        }

        group[i].Calorie += current.Calorie;
        return group;
      };

      const sorted = data.sort((a, b) => {
        return a.foodDateTime.localeCompare(b.foodDateTime);
      });

      const foodChartData = sorted.map(mapper).reduce(reducer, []);

      this.setState({ foods: foodChartData });

      console.log(this.state.foods)

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
      if (this.state.monthFilter !== "" && !isNaN(this.state.monthFilter)) {
        this.setState({
          message: ""
        })
        this.getFood();
      }
      else
        this.setState({
          monthFilter: '',
          message: "Please enter a valid month!",
          foods: []
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
        this.getFood();
      }
      else
        this.setState({
          message: "Please enter a valid year!",
          foods: []
        })
    });
  }

  // onChangeMonthFilter(e) {
  //   console.log(this.state.monthFilter);
  //   this.setState({
  //     monthFilter: e.target.value
  //   }, function () {
  //     console.log(this.state.monthFilter);
  //     this.getFood();
  //   });
  // }

  // onChangeYearFilter(e) {
  //   console.log(this.state.yearFilter);
  //   this.setState({
  //       yearFilter: e.target.value
  //   }, function () {
  //     console.log(this.state.yearFilter);
  //     this.getFood();
  //   });
  // }

  prevMonth(e) {
    if (parseInt(this.state.monthFilter) === 1) {
      console.log('yes');
      this.setState({
        monthFilter: moment(this.state.monthFilter, "M").subtract(1, 'months').format('M'),
        yearFilter: moment(this.state.yearFilter, "YYYY").subtract(1, 'years').format('YYYY')
      }, function () {


        console.log(this.state.monthFilter);
        console.log(this.state.yearFilter);
        this.getFood();
      })
    }
    else
      this.setState({
        monthFilter: moment(this.state.monthFilter, "M").subtract(1, 'months').format('M')
      }, function () {
        console.log(this.state.monthFilter);
        this.getFood();
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
        this.getFood();
      })
    }
    else
      this.setState({
        monthFilter: moment(this.state.monthFilter, "M").add(1, 'months').format('M')
      }, function () {


        console.log(this.state.monthFilter);
        console.log(this.state.yearFilter);
        this.getFood();
      });
  }

  // onChangeDateFilter(e) {
  //   console.log(this.state.DateFilter);
  //   this.setState({
  //     DateFilter: moment(new Date(e.target.value)).format('YYYY-MM-DD')
  //   }, function () {
  //     console.log(this.state.DateFilter);
  //     this.getFood();
  //   });
  // }  

  // prevMonth(e) {
  //   this.setState({
  //     DateFilter: moment(this.state.DateFilter, "YYYY-MM-DD").subtract(1, 'months').format('YYYY-MM-DD')
  //   }, function () {
  //     console.log(this.state.DateFilter);
  //     this.getFood();
  //   });
  // }

  // nextMonth(e) {
  //   this.setState({
  //     DateFilter: moment(this.state.DateFilter, "YYYY-MM-DD").add(1, 'months').format('YYYY-MM-DD')
  //   }, function () {
  //     console.log(this.state.DateFilter);
  //     this.getFood();
  //   });
  // }

  render() {
    var sumCalorie = this.state.foods.reduce(function (r, a) {
      return r + a.Calorie;
    }, 0);
    var averageCalorie = Math.round(sumCalorie / this.state.foods.length);

    return (
      // <div>
      <div className="container">
        {/* {this.props.isAuthenticated.toString()}
        {this.props.accessToken} */}
        <h1 className="display-3 font-weight-bolder text-center">Food</h1>
        <br />
        <div className="col-md-12 text-center">
          <h4>Filter by Month & Year: </h4>

          <Button variant="light" onClick={(e) => this.prevMonth(e)}>←</Button>
          <input className="inputMonth" type="number" min="1" max="12" name="Month" value={this.state.monthFilter} onChange={this.onChangeMonthFilter} required></input>
          <input className="inputYear" type="number" min="1" name="Year" value={this.state.yearFilter} onChange={this.onChangeYearFilter} required></input>

          {/* <input type="date" name="Date" value={this.state.DateFilter} onChange={this.onChangeDateFilter} required></input> */}

          <Button variant="light" onClick={(e) => this.nextMonth(e)}>→</Button>


          {this.state.message !== '' ?
            (<div className="alert alert-danger inputMessage" role="alert">{this.state.message}</div>)
            : (
              <div></div>
            )}

          <br />

          <h3 className="font-weight-bolder text-center">Daily Calorie for {moment(this.state.monthFilter, 'M').format("MMMM")} {this.state.yearFilter} </h3>
          <br />
          <h5 className="font-weight-bolder text-center">Average Calorie in {moment(this.state.monthFilter, 'M').format("MMMM")} {this.state.yearFilter}:  <br /> {averageCalorie} Calories</h5>
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



export default connect(mapStateToProps)(FoodChart)