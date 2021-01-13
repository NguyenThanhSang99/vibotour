import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import { MaterialIcons } from "@expo/vector-icons";
import CheckBox from "@react-native-community/checkbox";

export default function ItemBag(props) {
  const [bookedTourId, setBookedTourId] = useState();
  const [tourId, setTourId] = useState();
  const [tourName, setTourName] = useState();
  const [timeStart, setTimeStart] = useState();
  const [departureLocation, setDepartureLocation] = useState();
  const [tourCost, setTourCost] = useState();
  const [image, setImage] = useState();
  const [count, setCount] = useState(1);
  const [idBooked, setIdBooked] = useState();
  const [isChecked, setIsChecked] = useState(false);
  const [ticketRemaining, setTicketRemaining] = useState();

  useEffect(() => {
    setBookedTourId(props.dataFromParent.item.booked_tour_id);
    setTourName(props.dataFromParent.item.tour_name);
    setTimeStart(props.dataFromParent.item.time_start);
    setDepartureLocation(props.dataFromParent.item.departure_location);
    setTourCost(props.dataFromParent.item.tour_cost);
    setImage(props.dataFromParent.item.image);
    setIdBooked(props.dataFromParent.item.booked_tour_id);
    setTourId(props.dataFromParent.item.tour_id);
    setTicketRemaining(props.dataFromParent.item.number_ticket_remaining);
    checkPay(isChecked);
  }, [count]);

  function onPlus() {
    if (count < ticketRemaining) {
      setCount(count + 1);
    } else {
      setCount(ticketRemaining);
    }
    if (isChecked == true) {
      checkPay(isChecked);
    }
  }

  function onSub() {
    if (count > 1) {
      setCount(count - 1);
    } else {
      setCount(1);
    }
    if (isChecked == true) {
      checkPay(isChecked);
    }
  }

  function checkPay(newValue) {
    setIsChecked(newValue);
    const item = {
      value: newValue,
      idBooked: idBooked,
      idTour: tourId,
      tourName: tourName,
      timeStart: timeStart,
      departureLocation: departureLocation,
      count: count,
      cost: tourCost,
    };
    props.data.checkPay(item);
  }

  function deleteBookedTour(booked_tour_id) {
    console.log(JSON.stringify({ booked_tour_id }));
    return fetch(process.env.SERVER_IP + "/api/v1/deleteBookedTour", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain",
        "Content-type": "application/json",
      },
      body: JSON.stringify({ booked_tour_id }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        checkPay(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconCancel}
        onPress={() => deleteBookedTour(bookedTourId)}
      >
        <MaterialIcons name="cancel" size={29} color="#0c2461" />
      </TouchableOpacity>

      <CheckBox
        style={styles.checkBox}
        // disabled={false}
        value={isChecked}
        onValueChange={(newValue) => checkPay(newValue)}
      />
      <TouchableOpacity
        style={styles.detail}
        onPress={() => props.navigation.navigate("Details", { itemId: tourId })}
      >
        <Image
          source={{ uri: process.env.SERVER_IP + `/vibotour/images/${image}` }}
          style={styles.image}
        />
      </TouchableOpacity>
      <View style={styles.informationContain}>
        <Text style={styles.tourName}>{tourName}</Text>
        <View style={styles.itemBottom}>
          <Text style={styles.priceItem}>
            {tourCost}{" "}
            <Text style={{ textDecorationLine: "underline" }}>đ</Text>
          </Text>
          <View style={styles.amount}>
            <TouchableOpacity style={styles.button} onPress={() => onSub()}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.numberAmount}>{count}</Text>
            <TouchableOpacity style={styles.button} onPress={() => onPlus()}>
              <Text style={styles.buttonText}>+</Text>
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
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,

    backgroundColor: "#fff",
    height: vh(23),
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
  detail: {
    marginTop: vh(4),
    height: vh(17),
  },
  informationContain: {
    marginLeft: vh(1),
    marginTop: vh(4.5),
    flexDirection: "column",
    justifyContent: "space-between",
    height: vh(16),
  },
  image: {
    marginLeft: vh(1.5),
    marginRight: vh(1.5),
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
    marginRight: vh(1.3),
    marginLeft: vh(1.3),
    width: vh(3),
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
});
