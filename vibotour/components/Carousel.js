import React, { Component } from "react";
import { StyleSheet, View } from "react-native";

import { SliderBox } from "react-native-image-slider-box";
import { vh, vw } from "react-native-expo-viewport-units";

export default class PlaceSlide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [
        require("../assets/image/slide/sl1.jpg"),
        require("../assets/image/slide/sl2.jpg"),
        require("../assets/image/slide/sl3.jpg"),
        require("../assets/image/slide/sl9.jpg"),
      ],
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <SliderBox
          images={this.state.images}
          sliderBoxHeight={vh(32)}
          dotColor="#FFEE58"
          inactiveDotColor="#90A4AE"
          paginationBoxVerticalPadding={20}
          autoplay
          circleLoop
          parentWidth={vw(90)}
          ImageComponentStyle={{
            borderRadius: 20,
          }}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    // margin: 20,
    marginTop: vh(6),
  },
});
