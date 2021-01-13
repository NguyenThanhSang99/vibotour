import * as React from "react";
import {
  Text,
  View,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import { Ionicons } from "@expo/vector-icons";
import { vh } from "react-native-expo-viewport-units";
import { bookTour } from "../utils/BookTourUtil";
import { getToken } from "../utils/StorageUtil";

export default class ListTour extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      navigate: props.nav,
      data: [],
    };
  }

  async componentDidMount() {
    return fetch(process.env.SERVER_IP + "/api/v1/getCurrentTours")
      .then((response) => response.json())
      .then((responseJson) => {
        var list = [];
        responseJson.forEach((item) => {
          if (!item.rate) {
            item.rate = "4.0";
          }
          item.navigate = this.state.navigate;

          list.push(item);
        });
        this.setState({
          isLoading: false,
          data: list,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  _renderItem({ item, index }) {
    const urlImage = process.env.SERVER_IP + "/vibotour/images/" + item.image;
    const submitSuggestion = () => {
      getToken().then((userId) => {
        if (userId) {
          bookTour(userId, item.tour_id).then((result) => {
            Alert.alert(result);
          });
        } else {
          Alert.alert("Bạn phải đăng nhập để đặt tour");
        }
      });
    };
    return (
      <TouchableOpacity
        onPress={() =>
          item.navigate.navigate("Details", {
            itemId: item.tour_id,
          })
        }
      >
        <View style={styles.itemContainer}>
          <Image source={{ uri: urlImage }} style={styles.imageBackground} />
          <View style={styles.containerInformation}>
            <View style={styles.containerLeft}>
              <Text style={styles.tourName}>{item.tour_name}</Text>
              <Text style={styles.tourPrice}>{item.tour_cost} VND</Text>
              <TouchableHighlight
                style={styles.tourBtn}
                onPress={() => submitSuggestion()}
                underlayColor="#fff"
              >
                <Text style={styles.textBtn}>Đặt Ngay</Text>
              </TouchableHighlight>
            </View>
            <View style={styles.containerRight}>
              <View style={styles.tourTime}>
                <Text style={styles.tourTimeSun}>{item.number_day} Ngày</Text>
                <Text style={styles.tourTimeNight}>
                  {item.number_night} Đêm
                </Text>
              </View>

              <View style={styles.tourRating}>
                <Ionicons
                  name="md-star"
                  size={vh(3)}
                  color="rgb(245,245,245)"
                />
                <Text style={styles.ratting}>{item.rate}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { data, isLoading } = this.state;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <View
            style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}
          >
            <Carousel
              layout={"default"}
              ref={(ref) => (this.carousel = ref)}
              data={data}
              sliderWidth={300}
              itemWidth={300}
              renderItem={this._renderItem}
              onSnapToItem={(index) => this.setState({ activeIndex: index })}
            />
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    width: vh(35),
    marginLeft: vh(2),
    height: vh(53),
  },

  imageBackground: {
    width: "100%",
    height: vh(53),
    borderRadius: 15,
    overflow: "hidden",
  },

  containerInformation: {
    flexDirection: "row",
    backgroundColor: "red",
    height: vh(23),
    top: vh(-23),
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
    backgroundColor: "rgba(17,17,17,0.4)",
  },
  tourName: {
    width: vh(23),
    height: vh(6),
    color: "rgb(245,245,245)",
    fontSize: vh(2.3),
    // fontFamily: 'Roboto-700',
    fontWeight: "bold",
    marginTop: vh(2),
    marginLeft: vh(2),
  },

  tourPrice: {
    width: vh(20),
    color: "white",
    fontSize: vh(2),
    marginTop: vh(1),
    marginLeft: vh(2),
  },

  tourBtn: {
    width: vh(18),
    marginTop: vh(4),
    marginLeft: vh(2),
    backgroundColor: "rgba(17,17,17,0.6)",
    borderWidth: 1,
    borderRadius: vh(9),
    borderColor: "#EECFA1",
    alignItems: "center",
    justifyContent: "center",
  },

  textBtn: {
    color: "rgb(245,245,245)",
    fontSize: vh(2),
    marginBottom: vh(1),
    marginTop: vh(1),
  },

  tourTime: {
    marginTop: vh(3),
    marginLeft: vh(2.5),
  },
  tourTimeSun: {
    color: "rgb(245,245,245)",
    fontSize: vh(2),
  },
  tourTimeNight: {
    color: "rgb(245,245,245)",
    fontSize: vh(2),
  },
  tourRating: {
    flexDirection: "row",
    marginTop: vh(8.8),
    marginLeft: vh(1),
  },
  ratting: {
    marginLeft: vh(1),
    color: "rgb(245,245,245)",
    fontSize: vh(2.5),
  },
});
