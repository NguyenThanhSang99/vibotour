import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { vw, vh } from "react-native-expo-viewport-units";
import { formatDateTime } from "../utils/DateUtil";
import { Rating } from "react-native-ratings";

const ListReviewScreen = ({ navigation, route }) => {
  const { itemId, tourName } = route.params;
  const [data, setData] = useState([]);
  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    fetch(process.env.SERVER_IP + "/api/v1/getReviewsTour?tourId=" + itemId, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then(
        (result) => {
          setData(result);
        },
        (error) => {
          console.log(error);
          Alert.alert("Đã có lỗi xảy ra", "Vui lòng thử lại sau");
        }
      );
  };
  const list = data.map((element) => {
    return (
      <View style={styles.item} key={element.reviewid}>
        <View style={styles.reviewer}>
          <Image style={styles.person} source={{ uri: element.img }} />

          <Text style={styles.name}>
            {element.lastname} {element.firstname}
          </Text>
          <Rating
            readonly
            startingValue={element.star}
            imageSize={25}
            style={styles.star}
          />
        </View>
        <View style={styles.message}>
          <Text style={styles.content}>{element.content}</Text>
          <Text style={styles.time}>{formatDateTime(element.reviewdate)}</Text>
        </View>
      </View>
    );
  });
  return (
    <Modal animationType="fade" transparent={true} visible={true}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <MaterialCommunityIcons
              name="keyboard-backspace"
              color={"#fff"}
              size={30}
              onPress={() => navigation.goBack()}
            />
          </TouchableOpacity>
          <Text style={styles.text_header}>Đánh giá chuyến đi {tourName}</Text>
        </View>
        <ScrollView>
          <SafeAreaView style={styles.scroll}>{list}</SafeAreaView>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingBottom: 20,
    color: "#fff",
    backgroundColor: "#3B3B98",
    paddingLeft: 20,
    paddingTop: 20,
  },
  scroll: {
    padding: 20,
    backgroundColor: "#CAD3C8",
    minHeight: vh(88),
  },
  backButton: {
    fontSize: 20,
    color: "#000",
    paddingBottom: 5,
  },
  text_header: {
    fontWeight: "bold",
    fontSize: 20,
    width: vw(75),
    textAlign: "center",
    color: "#fff",
    marginLeft: 10,
  },
  item: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  person: {
    width: vw(7),
    height: vw(7),
    borderRadius: 50,
    backgroundColor: "#ccc",
    borderWidth: 1,
    borderColor: "#20232a",
  },
  name: {
    fontWeight: "bold",
    marginLeft: vw(3),
    width: "80%",
  },
  star: { alignItems: "center", marginTop: 10 },
  reviewer: {
    flexDirection: "row",
    flexWrap: "wrap",
    height: vh(9),
    alignItems: "center",
  },
  message: {
    backgroundColor: "rgba(127, 140, 141,0.1)",
    padding: 10,
  },
  content: {
    fontStyle: "italic",
    paddingBottom: 10,
  },
  time: {
    fontStyle: "italic",
    fontSize: 12,
    color: "#B33771",
    textAlign: "right",
  },
});

export default ListReviewScreen;
