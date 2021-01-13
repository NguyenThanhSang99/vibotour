import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import ItemBag from "../components/ItemBag";
import UserLogin from "../components/UserLogin";
import { getToken } from "../utils/StorageUtil";

export default function CartScreen({ navigation }) {
  function getUserId() {
    getToken().then((result) => {
      setUserId(result);
    });
  }

  const [userId, setUserId] = useState();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [pay, setPay] = useState([]);
  const [checkShowPay, setCheckLogin] = useState(false);

  useEffect(() => {
    getUserId();
    getData(userId);
  }, [data]);

  function getData(user_id) {
    return fetch(process.env.SERVER_IP + "/api/v1/getBookedTour", {
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
        if (responseJson.length > 0) {
          setCheckLogin(true);
        } else {
          setCheckLogin(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function checkPay(item) {
    if (item.value == true) {
      let payTour = {
        bookedTourId: item.idBooked,
        tourId: item.idTour,
        tourName: item.tourName,
        timeStart: item.timeStart,
        departureLocation: item.departureLocation,
        count: item.count,
        cost: item.cost,
      };
      if (pay.length == 0) {
        pay.push(payTour);
        setPay(pay);
        setTotal(payTour.cost * payTour.count);
      } else {
        let tick = false;
        pay.forEach((elm) => {
          if (elm.bookedTourId == payTour.bookedTourId) {
            let getTotal = total;
            getTotal = getTotal + (payTour.count - elm.count) * payTour.cost;
            setTotal(getTotal);
            pay.splice(pay.indexOf(elm), 1);
            tick = true;
            return;
          }
        });
        if (tick == false) {
          setTotal(total + payTour.count * payTour.cost);
        }
        pay.push(payTour);
        setPay(pay);
      }
    } else {
      let sum = 0;
      for (let i = 0; i < pay.length; i++) {
        sum = sum + pay[i].count * pay[i].cost;
        if (pay[i].bookedTourId == item.idBooked) {
          sum = sum - pay[i].cost * pay[i].count;
          pay.splice(i, 1);
          setPay(pay);
          i--;
        }
      }
      setTotal(sum);
    }
  }

  function onPay() {
    if (Object.keys(pay).length === 0) {
      Alert.alert("Vui lòng chọn tour để thanh toán!!!");
    } else {
      navigation.navigate("Checkout", {
        item_list: pay,
        totalCost: total,
      });
      setPay([]);
      setData([]);
    }
  }

  const renderItem = (element) => {
    return (
      <View>
        <TouchableOpacity>
          <ItemBag
            dataFromParent={element}
            navigation={navigation}
            data={{ checkPay: checkPay.bind(this) }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text_header}>Thanh toán các hành trình</Text>
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
      {checkShowPay ? (
        <View style={styles.bottomCart}>
          <View style={styles.totalPrice}>
            <Text style={styles.total}>Tổng cộng: </Text>
            <Text style={styles.price}>
              {total == null || isNaN(total) || total < 0 ? 0 : total}
              <Text style={{ textDecorationLine: "underline" }}>đ</Text>
            </Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={() => onPay()}>
            <Text style={styles.buttonText}>Thanh Toán</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {!userId ? (
        <View style={styles.loginView}>
          <UserLogin navigation={navigation} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: vh(3),
    flex: 1,
  },
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginTop: 5,
  },
  text_header: {
    fontWeight: "bold",
    fontSize: 22,
    width: vw(75),
    color: "#000",
    marginLeft: 10,
  },
  title: {
    fontSize: 30,
    marginTop: vh(2),
    marginLeft: vh(3),
  },
  scroll: {
    height: vh(78),
  },
  bottomCart: {
    height: vh(15),
    backgroundColor: "#ffff",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalPrice: {
    margin: "auto",
    marginLeft: vw(5),
    marginTop: vh(2.5),
    flexDirection: "row",
  },
  total: {
    fontSize: 17,
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
  loginView: {
    width: vw(100),
    marginTop: -vh(50),
  },
});
