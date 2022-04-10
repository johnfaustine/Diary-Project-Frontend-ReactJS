import axios from "axios";

// import Cookies from 'universal-cookie';
// import * as jwt_decode from "jwt-decode";

// const cookies = new Cookies();

const API_URL = "http://localhost:4421/api/account/";
// const api = axios.create({
//   baseURL: 'http://localhost:4421/api/account/',
//   headers: { Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token')) }
// })

class Auth {

  login(email, password) {
    return axios
      .post(API_URL + "login", {
        email,
        password
      }, { withCredentials: true })
      .then(response => {
        if (response.data.token) {
          //localStorage.setItem("token", JSON.stringify(response.data.token));
        }

        return response.data;
      });
  }

  // logout = async () => {
  //   try {
  //     console.log("logout clicked")
  //     let res = await api.get(API_URL + "logout", { withCredentials: true })
  //     console.log(res);
  //     //localStorage.removeItem("token");
  //     // this.props.history.push("/login");
  //     //window.location.reload();
  //   }
  //   catch (err) {
  //     console.log(err)
  //   }
  // }

  logout = async (token) => {
    return await axios.create({
      baseURL: 'http://localhost:4421/api/account/',
      headers: { Authorization: 'Bearer ' + token }
    }).get("logout", { withCredentials: true })
      .then(response => {
        //localStorage.removeItem("token");
        return response.data;
      });
  }

  register(email, password, confirmpassword) {
    return axios.post(API_URL + "register", {
      email,
      password,
      confirmpassword
    });
  }

  refreshToken() {
    return axios.post('http://localhost:4421/api/token', null, {
      withCredentials: true
    })
      .then(response => {
        if (response.data.token) {
          //localStorage.setItem("token", JSON.stringify(response.data.token));
        }

        return response.data;
      });
  }

  getTokenfromLocalStorage() {
    return JSON.parse(localStorage.getItem('token'));;
  }

}

export default new Auth();
