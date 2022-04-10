
import * as jwtDecode from 'jwt-decode';

class checkexpireService {

checkTokenExpire() {
    const token = JSON.parse(localStorage.getItem('token'));
    if (jwtDecode(token).exp < Date.now() / 1000) {
      localStorage.clear();
    };
}

}

export default new checkexpireService();
