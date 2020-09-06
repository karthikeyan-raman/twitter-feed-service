import React from "react";
import { Tweet as TweetWidget } from "react-twitter-widgets";
import Popup from "reactjs-popup";
import ClipLoader from "react-spinners/ClipLoader";
import "../css/style.css";
import PopUpContent from "./popup.jsx";

class Tweet extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      showPopup: false,
    };
  }

  saveOption(id) {
    console.log("========Save button clicked=======", id);
    this.togglePopUp();
  }

  displayTweet() {
    this.setState({ loading: false });
  }

  shouldComponentUpdate(_, nextState) {
    return this.state.loading != nextState.loading;
  }

  togglePopUp() {
    this.setState({ showPopup: !this.state.showPopup });
  }

  render() {
    return (
      <div id={"tweet-" + this.props.id} className={"tweet-container"} key={this.props.id}>
        <ClipLoader size={150} color={"#123abc"} loading={this.state.loading} />
        <TweetWidget
          tweetId={this.props.id}
          options={{
            style: { display: this.state.loading ? "none" : "block" },
          }}
          onLoad={this.displayTweet.bind(this)}
        />
        <Popup
          trigger={
            <div
              class="container"
              id={"btn-" + this.props.id}
              onClick={this.saveOption.bind(this)}
              style={{
                display: this.state.loading ? "none" : "block",
              }}
            >
              <div className={"bar1"}></div>
              <div className={"bar2"}></div>
              <div className={"bar3"}></div>
            </div>
          }
          position="right center"
        >
          <PopUpContent tweetId={this.props.id} />
        </Popup>
      </div>
    );
  }
}

export default Tweet;
