import React, { Component } from "react";
import { StyleSheet, View } from "react-native";

import { SliderBox } from "react-native-image-slider-box";
import { vh } from "react-native-expo-viewport-units";

export default class PlaceSlide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tourId: this.props.key,
      places: this.props.places,
      images: [
        process.env.SERVER_IP + "/vibotour/images/vibotour.jpg", // Local image
      ],
    };
  }
  componentDidMount() {
    this.state.places.map((tour) => {
      var newImages = this.state.images;
      if (tour.image) {
        var img = process.env.SERVER_IP + "/vibotour/images/" + tour.image;
        newImages.push(img);
        this.setState({
          images: newImages,
        });
      }
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <SliderBox
          images={this.state.images}
          sliderBoxHeight={vh(42)}
          dotColor="#FFEE58"
          inactiveDotColor="#90A4AE"
          paginationBoxVerticalPadding={20}
          autoplay
          circleLoop
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
