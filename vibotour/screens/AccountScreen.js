import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";
import { getToken, clearAll } from "../utils/StorageUtil";
import { requestLogin, getUserData } from "../utils/AccountUtil";

const AccountScreen = ({ navigation }) => {
  const [checkLogin, setCheckLogin] = useState(false);
  const [lastName, setLastName] = useState();
  const [firstName, setFirstName] = useState();
  const [image, setImage] = useState();
  useFocusEffect(
    React.useCallback(() => {
      handleLogin();
    }, [])
  );

  function handleLogin() {
    getToken().then((userId) => {
      if (userId) {
        setCheckLogin(true);
        getUserData(userId).then((user) => {
          if (!user) {
            requestLogin(navigation);
          } else {
            if (user.first_name) {
              setFirstName(user.first_name.trim());
            }
            if (user.last_name) {
              setLastName(user.last_name.trim());
            }
            if (user.image) {
              setImage(user.image.trim());
            }
          }
        });
      } else {
        setCheckLogin(false);
      }
    });
  }

  let [fontsLoaded] = useFonts({
    "openSans-600": require("../assets/fonts/OpenSans-SemiBold.ttf"),
    "openSans-700": require("../assets/fonts/OpenSans-Bold.ttf"),
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.info, { display: checkLogin ? "flex" : "none" }]}
        onPress={() => {
          navigation.navigate("Profile");
        }}
      >
        <View style={styles.imageBox}>
          <View style={styles.imageArea}>
            <Image source={{ uri: image }} style={styles.image} />
          </View>
          <View style={styles.boxText}>
            <Text style={styles.textName}>
              {lastName} {firstName}
            </Text>
            <Text>Thông tin tài khoản</Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.menuAction}>
        <TouchableOpacity
          style={[styles.action, { display: checkLogin ? "none" : "flex" }]}
          onPress={() => navigation.navigate("Login", {})}
        >
          <View>
            <Text>Đăng nhập</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.action}
          onPress={() => navigation.navigate("Signup", {})}
        >
          <View>
            <Text>Đăng ký</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.action}
          onPress={() => navigation.navigate("ForgotPass", {})}
        >
          <View>
            <Text>Quên mật khẩu</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.action, { display: checkLogin ? "flex" : "none" }]}
          onPress={() => {
            navigation.navigate("PaidHistory");
          }}
        >
          <View>
            <Text>Lịch sử thanh toán</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.action, { display: checkLogin ? "flex" : "none" }]}
          onPress={() => {
            clearAll();
            setCheckLogin(false);
          }}
        >
          <View>
            <Text>Đăng xuất</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: "#000",
    padding: "10%",
    backgroundColor: "#eee",
  },
  menuAction: {
    display: "flex",
    marginTop: 10,
    width: "100%",
    textAlign: "left",
  },
  action: {
    width: "100%",
    alignSelf: "stretch",
    padding: 10,
    marginBottom: 5,
    backgroundColor: "#fff",
  },
  info: {
    backgroundColor: "#fff",
  },
  imageBox: {
    margin: 5,
    width: "90%",
    flexDirection: "row",
  },
  imageArea: {
    backgroundColor: "#bdc3c7",
    shadowOpacity: 0.2,
    width: 50,
    overflow: "hidden",
    borderRadius: 50,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  boxText: {
    marginLeft: 20,
    width: "60%",
    flexDirection: "column",
  },
  textName: {
    marginBottom: 10,
    fontWeight: "bold",
  },
});

export default AccountScreen;
