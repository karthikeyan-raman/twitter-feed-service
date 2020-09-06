import axios from "axios";
import React from "react";

class PopUpContent extends React.Component {
  constructor() {
    super();
    this.state = {
      optionId: null,
    };
  }

  componentWillMount() {
    return axios
    .get(
      `/api/twitter-feed-service/v0/user-option?tweetId=${this.props.tweetId}`
    )
    .then(({ data }) => {
      this.setState({ optionId: data.optionId || null });
    })
    .catch((err) => {
      console.log(err);
    });
  }

  saveUserOption(e) {
    const { tweetId } = this.props;
    return axios
      .post("/api/twitter-feed-service/v0/user-option", {
        tweetId,
        optionId: e.target.id,
      })
      .then(({ data }) => {
        this.setState({ optionId: data.optionId });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div>
        {this.state.optionId ? (
          <button id={this.state.optionId} className="btn-twitter">
            {this.state.optionId}
          </button>
        ) : (
          <div>
            <button
              id="option-1"
              className="btn-twitter"
              onClick={this.saveUserOption.bind(this)}
            >
              {" "}
              Option 1{" "}
            </button>
            <button
              id="option-2"
              className="btn-twitter"
              onClick={this.saveUserOption.bind(this)}
            >
              {" "}
              Option 2{" "}
            </button>
            <button
              id="option-3"
              className="btn-twitter"
              onClick={this.saveUserOption.bind(this)}
            >
              {" "}
              Option 3{" "}
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default PopUpContent;
