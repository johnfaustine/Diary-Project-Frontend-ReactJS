import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './App.css';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import Login from "./components/login.component";
import Register from "./components/register.component";
import ConfirmEmail from "./components/confirmemail.component";
import ForgotPassword from "./components/forgotpassword.component";
import ResetPassword from "./components/resetpassword.component";
import Activities from "./components/activities.component";
import Finances from "./components/finances.component";
import FinanceDailyChart from "./components/financedailychart.component";
import FinanceMonthlyChart from "./components/financemonthlychart.component";
import Food from "./components/food.component";
import FoodChart from "./components/foodchart.component";
import searchActivity from "./components/searchactivity.component";
import NotFound from "./components/notfound.component";
// import { PublicRoute } from "./components/publicroute.component";
// import { ProtectedRoute } from "./components/protectedroute.component";
import { connect } from 'react-redux';
import authService from './services/auth-service';
// import axios from 'axios';

// import checkexpireService from "./services/checkexpire-servce";
// import Cookies from 'universal-cookie';

// const cookies = new Cookies();

const ProtectedRoute = ({ isAllowed, ...props }) =>
  isAllowed
    ? <Route {...props} />
    : <Redirect to="/login" />;

const PublicRoute = ({ isAllowed, ...props }) =>
  isAllowed
    ? <Route {...props} />
    : <Redirect to="/" />;

class App extends React.Component {

  constructor(props) {
    super(props);
    this.handleSuccessfulAuth = this.handleSuccessfulAuth.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {
      token: undefined,
      home: {
        title: 'Diary',
        subTitle: 'Keep track on your activities, finance and food calories'
      }

    }
  }

  //get data from successful login
  handleSuccessfulAuth(data) {
    this.setState({
      token: data
    });
  }

  //when logout button is clicked
  handleLogoutClick = async () => {
    console.log("logout clicked");
    authService.logout(this.props.accessToken).then(
      () => {
        console.log(this.props.token);
        this.props.removeAccessToken();
      },
      error => {
        console.log(error);
        window.location.reload();
      }
    );
  }



  componentDidMount() {

    // if (this.props.isAuthenticated === true) {
    //   setInterval(() => {
    //     console.log("interval refresh token after authenticated");
    //     authService.refreshToken().then(
    //       response => {
    //         this.props.setAccessToken(response.token);
    //       },
    //       error => {
    //         console.log(error);
    //         console.log("interval refresh failed")
    //         //if refresh token error refresh window
    //        // window.location.reload();
    //       }
    //     );
    //   }, 5000) //5 seconds
    // }


    // for now when component update call interval but when its called component update detected so its in infinite loop
    // if(this.props.isAuthenticated){
    //       //refresh token every 4 minutes
    //       setInterval(() => {
    //         console.log("interval refresh token");
    //         authService.refreshToken().then(
    //           response => {
    //             this.props.setAccessToken(response.token);
    //           },
    //           error => {
    //             console.log(error);
    //            // this.props.removeAccessToken();
    //           }
    //         );
    //       }, 5000) //5 seconds
    //     }

    // else

    // //silent refresh token 
    // setTimeout(() => {
    //   console.log("silent refresh token")
    //   authService.refreshToken().then(
    //     response => {
    //       this.props.setAccessToken(response.token);
    //     },
    //     error => {
    //       console.log(error);
    //       // this.props.removeAccessToken();
    //     }
    //   );
    // }, 0);


    //silent refresh token 
    console.log("silent refresh token")
    authService.refreshToken().then(
      response => {
        this.props.setAccessToken(response.token);
        this.props.doneFetch();

        //if silent refresh is success start interval refresh
        setInterval(() => {
          console.log("interval refresh after silent");
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
      },
      error => {
        console.log(error);
        this.props.doneFetch();
        // this.props.removeAccessToken();
      }
    );

  }

  render() {
    if (this.props.isFetching) {
      return (
        <div>Loading...</div>
      )
    }
    else
      return (
        <Router>
          <Container className="p-0" fluid={true}>
            <Navbar className="border-bottom" bg="transparent" expand="md">
              <Link to={"/"} className="navbar-brand">
                Diary
            </Link>
              <Navbar.Toggle className="border-0" aria-controls="Navbar-toggle" />
              <Navbar.Collapse id="navbar-toggle">
                {this.props.isAuthenticated ? (
                  <div className="navbar-nav ml-auto">
                    <li className="nav-item">
                      <Link className="nav-link" to="/activities">Activities</Link>
                    </li>
                    <NavDropdown title="Food">
                      <Link className="dropdown-item" to="/food">Daily</Link>
                      <Link className="dropdown-item" to="/foodChart">Chart</Link>
                    </NavDropdown>

                    <NavDropdown title="Finances">
                      <Link className="dropdown-item" to="/finances">Daily</Link>
                      <Link className="dropdown-item" to="/financeDailyChart">Daily Chart</Link>
                      <Link className="dropdown-item" to="/financeMonthlyChart">Monthly Chart</Link>
                    </NavDropdown>

                    <li className="nav-item">
                      <button className="nav-link logout" onClick={() => this.handleLogoutClick()}>
                        Logout
                    </button>
                    </li>
                  </div>
                ) :
                  (
                    <div className="navbar-nav ml-auto">
                      <li className="nav-item">
                        <Link className="nav-link" to="/">Home</Link>
                      </li>

                      <li className="nav-item">
                        <Link to={"/login"} className="nav-link">
                          Login
                      </Link>
                      </li>

                      <li className="nav-item">
                        <Link to={"/register"} className="nav-link">
                          Sign Up
                      </Link>
                      </li>
                    </div>
                  )}
              </Navbar.Collapse>
            </Navbar>
            {/* {this.props.isAuthenticated.toString()}          {this.props.accessToken} */}
            <Switch>
              {/* //try localstorage */}
              <Route exact path="/" render={props => (<HomePage  {...props} title={this.state.home.title} subTitle={this.state.home.subTitle} />)} />
              <PublicRoute isAllowed={!this.props.isAuthenticated} exact path="/login" component={props => (<Login  {...props} handleSuccessfulAuth={this.handleSuccessfulAuth} />)} />
              <PublicRoute isAllowed={!this.props.isAuthenticated} exact path="/register" component={Register} />
              <PublicRoute isAllowed={!this.props.isAuthenticated} exact path="/confirmEmail" component={ConfirmEmail} />
              <PublicRoute isAllowed={!this.props.isAuthenticated} exact path="/forgotPassword" component={ForgotPassword} />
              <PublicRoute isAllowed={!this.props.isAuthenticated} exact path="/resetPassword" component={ResetPassword} />
              <ProtectedRoute isAllowed={this.props.isAuthenticated} path="/activities" component={Activities} />
              <ProtectedRoute isAllowed={this.props.isAuthenticated} path="/finances" component={Finances} />
              <ProtectedRoute isAllowed={this.props.isAuthenticated} path="/financeDailyChart" component={FinanceDailyChart} />
              <ProtectedRoute isAllowed={this.props.isAuthenticated} path="/financeMonthlyChart" component={FinanceMonthlyChart} />
              <ProtectedRoute isAllowed={this.props.isAuthenticated} path="/food" component={Food} />
              <ProtectedRoute isAllowed={this.props.isAuthenticated} path="/foodChart" component={FoodChart} />
              <ProtectedRoute isAllowed={this.props.isAuthenticated} path="/searchActivity" component={searchActivity} />
              <Route path="" component={NotFound} />
            </Switch>
            <Footer />

          </Container>
        </Router >
      );
  }

}

const mapStateToProps = (state) => {
  return {
    accessToken: state.accessToken,
    isAuthenticated: state.isAuthenticated,
    isFetching: state.isFetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setAccessToken: (token) => { console.log("set token success"); dispatch({ type: 'SET_TOKEN', token: token }) },
    removeAccessToken: () => { console.log("remove token success"); dispatch({ type: 'REMOVE_TOKEN' }) },
    doneFetch: () => { console.log("fetching done"); dispatch({ type: 'DONE_FETCH' }) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
