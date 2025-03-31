import { makeAutoObservable } from "mobx";
import axios from "axios";
import notification from "./NotificationStore";
class SessionStore {
  user = null;
  isLoggedIn = false;

  constructor() {
    makeAutoObservable(this);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.isLoggedIn = true;
    }
  }

  login(user) {
    this.user = user;
    localStorage.setItem("user", JSON.stringify(user));
    this.isLoggedIn = true;
  }

  async logout() {
    await axios.post('/accounts/logout/', { 'refresh': this.user.refresh }).then(res => {
      if (res.error) {
        window.location.href = '/'
      }
    }).catch(err => {
      notification.addNotification({
        open: true,
        message: 'Logout Failed!'
      })
    }).finally(() => {
      this.user = null;
      this.isLoggedIn = false;
      localStorage.removeItem("user");
    })
  }

  async refreshToken() {
    await axios.post('/accounts/token/refresh/', { 'refresh': this.user.refresh }).then(res => {
      if (res.error) {
        window.location.href = '/'
      } else {
        var info = { ...this.user, 'access': res.data.access }
        this.user = info;
        localStorage.setItem("user", JSON.stringify(info));
        this.isLoggedIn = true;
      }
    }).catch(err => {
      notification.addNotification({
        open: true,
        message: 'Failed to fetch refresh token!'
      })
      this.user = null;
      this.isLoggedIn = false;
      localStorage.removeItem("user");
      window.location.href = '/'
    })
  }
}

const sessionStore = new SessionStore();
export default sessionStore;
