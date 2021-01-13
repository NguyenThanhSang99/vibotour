import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { vh } from "react-native-expo-viewport-units";

const UserLogin = (props) => {
  const navigation = props.navigation;
  function handleClick() {
    navigation.navigate("Login");
  }
  return (
    <View style={styles.container}>
      <Icon name="user-circle-o" style={styles.icon} />

      <TouchableOpacity onPress={() => handleClick()}>
        <View style={styles.button}>
          <Text style={styles.text_login}>Đăng nhập</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    textAlign: "center",
    alignItems: "center",
    width: "100%",
  },
  icon: {
    color: "#05375a",
    fontSize: vh(20),
    paddingTop: 10,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(94, 111, 238)",
    paddingVertical: 10,

    marginTop: 10,
    borderRadius: 100,
    height: vh(5),
    width: vh(14),
  },
  text_login: {
    color: "#fff",
  },
});

export default UserLogin;
