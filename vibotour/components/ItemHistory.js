import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import { timeSince } from "../utils/DateUtil";
import { AirbnbRating } from "react-native-ratings";

export default function ItemHistory(props) {
  const [bookedTourId, setBookedTourId] = useState();
  const [tourName, setTourName] = useState();
  const [timePaid, setTimePaid] = useState();
  const [tourCost, setTourCost] = useState();
  const [image, setImage] = useState();
  const [count, setCount] = useState();
  const [modalVisible, setModalVisible] = useState("");
  const [rate, setRate] = useState(4);
  const [reviewContent, setReviewContent] = useState("");
  const [canReview, setCanReview] = useState(true);
  const userId = props.userId;

  useEffect(() => {
    setCanReview(props.dataFromParent.item.can_review === "1");
    setBookedTourId(props.dataFromParent.item.booked_tour_id);
    setTourName(props.dataFromParent.item.tour_name);
    setTimePaid(timeSince(props.dataFromParent.item.paid_time));
    setTourCost(props.dataFromParent.item.tour_cost);
    setImage(props.dataFromParent.item.image);
    setCount(props.dataFromParent.item.amount);
  }, [count]);

  function reviewTour() {
    fetch(process.env.SERVER_IP + "/api/v1/reviewTour", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify({ userId, bookedTourId, rate, reviewContent }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data === "success") {
          setCanReview(false);
          setModalVisible(false);
        } else {
          Alert.alert(data);
        }
      })
      .catch((error) => {
        Alert.alert("Có lỗi xảy ra!!!", "Vui lòng đánh giá sau");
        console.error("Error review:", error);
      });
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.text_box_code}>
              <Text style={styles.modalText}>{tourName}</Text>
            </View>
            <AirbnbRating
              defaultRating={rate}
              reviews={[
                "Eyyy... Quá tệ",
                "Hmm... Tạm được",
                "Umm... Khá ổn",
                "Ohhh... Tốt",
                "Okeyyy... Rất tốt",
              ]}
              halfStarEnabled={true}
              onFinishRating={(rating) => setRate(rating)}
            />
            <TextInput
              style={styles.inputCode}
              multiline={true}
              numberOfLines={7}
              placeholder="Đánh giá tour du lịch"
              onChangeText={(review) => setReviewContent(review)}
            ></TextInput>

            <View style={styles.box_button_SendCode}>
              <TouchableOpacity
                style={styles.button_sendMail}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.text_sendMail}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => reviewTour()}
                style={styles.button_sendMail}
              >
                <Text style={styles.text_sendMail}>Đánh giá</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Image
        source={{ uri: process.env.SERVER_IP + `/vibotour/images/${image}` }}
        style={styles.image}
      />
      <View style={styles.informationContain}>
        <Text style={styles.tourName}>{tourName}</Text>
        <View style={styles.itemBottom}>
          <View style={styles.amount}>
            <Text style={styles.priceItem}>
              {tourCost}{" "}
              <Text style={{ textDecorationLine: "underline" }}>đ</Text>
              <Text style={styles.numberAmount}> x {count} vé</Text>
            </Text>
          </View>
        </View>
        <View style={styles.itemBottom}>
          <Text style={styles.priceItem}>{timePaid} </Text>
          <View>
            <TouchableOpacity
              style={[styles.button, { display: canReview ? "flex" : "none" }]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.buttonText}>Đánh giá</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: 10,

    backgroundColor: "#fff",
    height: vh(20),
    width: "95%",
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
  checkBox: {
    position: "absolute",
  },
  informationContain: {
    marginLeft: vh(1),
    marginTop: vh(1),
    flexDirection: "column",
    justifyContent: "space-between",
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
  tourName: {
    fontSize: vh(2.5),
    width: vw(51),
  },
  itemBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priceItem: {
    fontSize: vh(2),
  },
  amount: {
    flexDirection: "row",
  },
  numberAmount: {
    fontSize: vh(2.3),
  },
  button: {
    marginRight: vh(20),
    marginLeft: vw(3),
    width: "35%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: vh(1.5),
  },
  buttonText: {
    fontSize: 15,
  },
  iconCancel: {
    position: "absolute",
    right: 0,
    top: vh(-1.3),
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  text_box_code: {
    alignItems: "center",
    marginBottom: 20,
  },
  modalText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  box_button_SendCode: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    marginTop: 20,
  },
  button_sendMail: {
    marginRight: "6%",
    marginLeft: "6%",
    width: "38%",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    borderRadius: 999,
    alignItems: "center",
    backgroundColor: "#6c5ce7",
  },
  text_sendMail: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    paddingHorizontal: 15,
  },
  inputCode: {
    borderColor: "gray",
    borderWidth: 1,
    textAlign: "left",
    padding: 10,
    textAlignVertical: "top",
  },
});
