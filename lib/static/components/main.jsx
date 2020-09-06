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
    this.childKey = 0;
    this.state = {
      showLogin: true,
      currentTweets: [],
    };
  }

  componentDidMount() {
    socket.emit("connect");

    socket.on("session", (key) => {
      this.popup.close();
      this.setState({ session: { key }, showLogin: false });
      this.getUserTimeline();
    });

    socket.on("newtweets", (data) => {
      const toUpdate =
        data.filter((d) => {
          const toAdd = !this.state.currentTweets.some(
            (t) => t.key === d.id_str
          );
          const message = toAdd
            ? `Adding new tweet ${d.id_str}`
            : `Ignoring tweet ${d.id_str} since it is duplicate`;
          console.log(message);
          return toAdd;
        }) || [];
      if (toUpdate && toUpdate.length > 0) {
        const tweets = data.map((t) => <Tweet key={t.id_str} id={t.id_str} />);
        this.setState((prevState) => {
          let state = Object.assign({}, prevState);
          state.currentTweets.unshift(...tweets);
          return state;
        });
      }
    });
  }

  getUserTimeline() {
    return axios
      .get("/api/twitter-feed-service/v0/user-timeline")
      .then(({ data }) => {
        const tweets = data.map((t) => <Tweet key={t.id_str} id={t.id_str} />);
        this.setState((prevState) => {
          let state = Object.assign({}, prevState);
          state.currentTweets = tweets;
          return state;
        });
      })
      .catch((error) => {
        console.log("======error fetching timeline======", error);
      });
  }

  startAuth() {
    this.popup = this.openPopup();
  }

  openPopup() {
    const width = 600;
    const height = 600;
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
        <div id="home-timeline">{this.state.currentTweets}</div>
      </div>
    );
  }
}

export default Main;
