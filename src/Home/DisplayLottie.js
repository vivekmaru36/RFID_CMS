import React, {Component} from "react";
import Lottie from "lottie-react";



export default class DisplayLottie extends Component {
  render() {
    const animationData = this.props.animationData;
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData
    };


    return (

      <Lottie
        animationData={defaultOptions.animationData}
        loop={defaultOptions.loop}
      />


    );
  }
}