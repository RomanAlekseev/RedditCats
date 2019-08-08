import React, { Component } from "react";

export default class Video extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      visible: true
    };
  }

  componentDidMount() {
    this.video.play();
    window.addEventListener("scroll", () => {
      if (this.video) {
        this.state.visible ? this.video.play() : this.video.pause();
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ visible: nextProps.isVisible });
  }

  componentDidCatch(error, info) {
    this.setState({
      hasError: true
    });
  }

  render() {
    return this.state.hasError ? (
      <h1 className="mt-5 text-center">Что-то пошло не так</h1>
    ) : (
      <video
        ref={node => {
          this.video = node;
        }}
        controls
        className="pt-4"
        name="media"
        style={{ maxHeight: "80vh" }}
      >
        <source src={this.props.src} type="video/mp4" />
      </video>
    );
  }
}
