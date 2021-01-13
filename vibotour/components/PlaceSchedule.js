import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import { getDay } from "../utils/DateUtil";

class PlaceSchedule extends Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      touristAttraction: props.tour,
      duration: "",
    };
  }

  componentDidMount() {
    this.setState({
      duration: getDay(
        this.state.touristAttraction.number_day,
        this.state.touristAttraction.number_night
      ),
    });
  }

  render() {
    return (
      <View style={styles.ticket}>
        <View style={styles.triangle} />
        <View>
          <Text style={styles.touristAttractionName}>
            {this.state.touristAttraction.tourist_attraction_name}
          </Text>
        </View>
        <View>
          <Text style={styles.touristAttractionDescription}>
            Thời gian: {this.state.duration}
          </Text>
          <Text style={styles.touristAttractionDescription}>
            Chi tiết:{"\n"} {this.state.touristAttraction.schedule_detail}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ticket: {
    paddingLeft: 10,
    borderLeftColor: "blue",
    borderLeftWidth: 1,
    marginLeft: 10,
    marginTop: 10,
    position: "relative",
  },
  triangle: {
    width: 10,
    height: 10,
    position: "absolute",
    top: 0,
    left: -10,
    borderLeftWidth: 10,
    borderLeftColor: "transparent",
    borderRightWidth: 10,
    borderRightColor: "transparent",
    borderTopWidth: 10,
    borderTopColor: "blue",
  },
  touristAttractionName: {
    fontWeight: "bold",
    marginTop: 10,
    fontSize: 18,
  },
  touristAttractionDescription: {
    fontSize: 18,
  },
});

export default PlaceSchedule;
