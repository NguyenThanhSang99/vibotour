import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import { MaterialIcons } from "@expo/vector-icons";

export default class TouristAttractionDetail extends Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      touristAttraction: props.tour,
      modalVisible: false,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({ modalVisible: false });
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.iconCancel}
                onPress={() => this.setState({ modalVisible: false })}
              >
                <MaterialIcons name="close" size={29} color="red" />
              </TouchableOpacity>
              <Image
                source={{
                  uri:
                    process.env.SERVER_IP +
                    `/vibotour/images/${this.state.touristAttraction.image}`,
                }}
                style={styles.modalImage}
              />
              <View style={styles.text_box}>
                <Text style={styles.modalTextTiltle}>
                  {this.state.touristAttraction.tourist_attraction_name}
                </Text>
                <Text style={styles.modalText}>
                  {this.state.touristAttraction.description}
                </Text>
                <Text style={styles.address}>
                  {this.state.touristAttraction.address}
                </Text>
              </View>
            </View>
          </View>
        </Modal>
        <TouchableOpacity onPress={() => this.setState({ modalVisible: true })}>
          <View style={styles.place}>
            <Image
              source={{
                uri:
                  process.env.SERVER_IP +
                  `/vibotour/images/${this.state.touristAttraction.image}`,
              }}
              style={styles.image}
            />
            <View style={styles.informationContain}>
              <Text style={styles.tourName}>
                {this.state.touristAttraction.tourist_attraction_name}
              </Text>
              <Text style={styles.description}>
                {this.state.touristAttraction.description.length > 90
                  ? this.state.touristAttraction.description.substring(
                      0,
                      90 - 3
                    ) + "..."
                  : this.state.touristAttraction.description}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  place: {
    flexDirection: "row",
    margin: 10,
    marginLeft: 0,

    backgroundColor: "#fff",
    height: vh(20),
    width: "100%",
    borderWidth: 0,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  informationContain: {
    marginLeft: vh(1),
    marginTop: vh(1),
    flexDirection: "column",
    height: vh(16),
  },
  image: {
    marginLeft: vh(1.5),
    marginRight: vh(1.5),
    marginTop: vh(1.5),
    width: vw(35),
    height: vh(17),
    borderRadius: 10,
  },
  modalImage: {
    marginTop: vh(1.5),
    width: vw(80),
    height: vh(30),
    borderRadius: 10,
  },
  tourName: {
    fontSize: vh(2.5),
    width: vw(40),
    fontWeight: "bold",
  },
  priceItem: {
    fontSize: vh(2),
  },
  iconCancel: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: vw(90),
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  text_box: {
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  modalText: {
    textAlign: "center",
    width: "100%",
    flexDirection: "row",
    marginTop: vh(2),
  },
  modalTextTiltle: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 24,
    marginTop: vh(2),
  },
  address: {
    fontStyle: "italic",
    marginTop: vh(2),
  },
  description: {
    width: vw(40),
  },
});
