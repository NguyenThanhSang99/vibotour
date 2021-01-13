import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ItemHistory from "../components/ItemHistory";
import { getToken } from "../utils/StorageUtil";

export default function PaidHistoryScreen({ navigation }) {
  const [userId, setUserId] = useState();
  const [data, setData] = useState([]);

  useEffect(() => {
    getToken().then((user) => {
      setUserId(user);
      getData(user);
    });
  }, []);

  function getData(user_id) {
    return fetch(process.env.SERVER_IP + "/api/v1/getPaidTour", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify({ user_id }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setData(responseJson);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const renderItem = (element) => {
    return (
      <View>
        <TouchableOpacity>
          <ItemHistory userId={userId} dataFromParent={element} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
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
        <Text style={styles.text_header}>Lịch sử thanh toán</Text>
      </View>
      <SafeAreaView style={styles.scroll}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => {
            return item.booked_tour_id;
          }}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingBottom: 20,
    color: "#fff",
    backgroundColor: "#00b894",
    paddingLeft: 20,
    paddingTop: 20,
    marginTop: 5,
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
  scroll: {
    backgroundColor: "rgba(127, 140, 141,0.1)",
    height: vh(90),
    paddingBottom: vh(3),
  },
  bottomCart: {
    height: vh(15),
    bottom: vh(8),
    backgroundColor: "#ffff",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  price: {
    marginLeft: 5,
    fontSize: 17,
  },
  button: {
    marginTop: vh(1.6),
    marginRight: vh(2),
    height: vh(4),
    width: vw(27),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: vh(1.5),
  },
  buttonText: {
    fontSize: 12,
  },
});
