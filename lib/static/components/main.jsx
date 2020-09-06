import axios from "axios";
import React from "react";
import ReactDOM from "react-dom";
import io from "socket.io-client";
import "../css/style.css";
import Tweet from "./tweets.jsx";
import { TwitterLoginButton } from "react-social-login-buttons";
const socket = io("http://127.0.0.1:8000");

class Main extends React.Component {
  constructor() {
    super();
    this.state = {
      showLogin: true,
    };
  }

  componentDidMount() {
    socket.emit('connect')
    socket.on("session", (key) => {
      this.popup.close();
      this.setState({ session: { key }, showLogin: false });
      this.getUserTimeline();
    });
  }

  getUserTimeline() {
    return axios
      .get("/api/twitter-feed-service/v0/user-timeline")
      .then(({ data }) => {
        const tweets = data.map((t) => <Tweet id={t.id_str} />);
        return ReactDOM.render(
          tweets,
          document.getElementById("home-timeline")
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  startAuth() {
    this.popup = this.openPopup();
  }

  openPopup() {
    const width = 600,
      height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;

    const url = `/api/twitter-feed-service/v0/twitter-login?socketId=${socket.id}`;

    return window.open(
      url,
      "",
      `toolbar=no, location=no, directories=no, status=no, menubar=no, 
      scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
      height=${height}, top=${top}, left=${left}`
    );
  }

  render() {
    return (
      <div className="content">
        <TwitterLoginButton
          onClick={this.startAuth.bind(this)}
          style={{
            display: this.state.showLogin ? "block" : "none",
          }}
        />
        <div id="home-timeline"></div>
      </div>
    );
  }
}

export default Main;
