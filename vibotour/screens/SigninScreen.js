import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  Alert,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Google from "expo-google-app-auth";
import { storeToken } from "../utils/StorageUtil";

const SigninScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //sign in Google
  async function signInWithGoogle() {
    try {
      const result = await Google.logInAsync({
        iosClientId: process.env.iosClientId,
        androidClientId: process.env.androidClientId,
        iosStandaloneAppClientId: process.env.iosStandaloneAppClientId,
        androidStandaloneAppClientId: process.env.androidStandaloneAppClientId,
        scopes: ["profile", "email"],
      });

      if (result.type === "success") {
        var info = result.user;
        fetchUser(info.familyName, info.givenName, info.email, info.photoUrl);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (error) {
      console.log("Error: ", error);
      return { error: true };
    }
  }

  function fetchUser(fn, ln, e, p) {
    fetch(process.env.SERVER_IP + "/api/v1/loginGoogle", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        firstName: fn,
        lastName: ln,
        email: e,
        photoURL: p,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result) {
          if (result === "error" || result === "failed") {
            Alert.alert("Đăng nhập thất bại!", "Vui lòng thử lại sau");
          } else {
            handleLoginSuccess(result);
          }
        } else {
          Alert.alert("Đăng nhập thất bại!!!");
        }
      })
      .catch((error) => console.log(error));
  }

  function loginAccount() {
    fetch(process.env.SERVER_IP + "/api/v1/checkLogin", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result === "failed") {
          Alert.alert("Đăng nhập thất bại!", "Vui lòng thử lại sau");
        } else if (Object.keys(result).length === 0) {
          Alert.alert("Tài khoản không tồn tại!");
        } else {
          handleLoginSuccess(result[0].user_id);
        }
      })
      .catch((error) => console.log(error));
  }

  function handleLoginSuccess(userId) {
    storeToken(userId);
    Alert.alert("Thông báo", "Đăng nhập thành công!", [
      {
        text: "OK",
        onPress: () => {
          navigation.goBack();
        },
      },
    ]);
  }

  return (
    <Modal animationType="fade" transparent={true} visible={true}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons
            name="keyboard-backspace"
            color={"#fff"}
            size={30}
            onPress={() => navigation.goBack()}
          />
        </TouchableOpacity>
        <Text style={styles.text_header}>Chào bạn,</Text>
        <Text style={styles.text_header_dec}>
          Đăng nhập để mở rộng thêm chức năng!
        </Text>
        <View style={styles.footer}>
          <Text style={[styles.text_title, { marginTop: 40 }]}>Email</Text>
          <View style={styles.box_input}>
            <Icon name="user-o" style={styles.icon} />
            <TextInput
              placeholder="Your email"
              style={styles.text_input}
              keyboardType="email-address"
              onChangeText={(email) => setEmail(email)}
              value={email}
            />
          </View>
          <Text style={[styles.text_title, { marginTop: 20 }]}>Mật khẩu</Text>
          <View style={styles.box_input}>
            <Icon name="lock" style={styles.icon} />
            <TextInput
              placeholder="Your password"
              style={styles.text_input}
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
              value={password}
            />
          </View>
          <TouchableOpacity onPress={() => loginAccount()}>
            <View style={styles.button}>
              <Text style={styles.text_login}>Login</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.area_forgot}
            onPress={() => navigation.navigate("ForgotPass")}
          >
            <Text style={{ color: "rgb(94, 111, 238)" }}>Quên mật khẩu?</Text>
          </TouchableOpacity>
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              style={styles.button_GG}
              onPress={() => signInWithGoogle()}
            >
              <Icon name="google-plus" style={styles.icon_GG} />
              <Text style={styles.text_GG}>Google Plus</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.text_signUp}>
            <Text>Bạn chưa tạo một tài khoản?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={{ color: "blue" }}> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgb(94, 111, 238)",
  },
  backButton: {
    fontSize: 20,
    color: "#fff",
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  text_header: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    paddingHorizontal: 20,
    paddingBottom: 5,
  },
  text_header_dec: {
    fontSize: 20,
    color: "#f9f9f9",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  text_title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  footer: {
    width: "100%",
    height: "75%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  box_input: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },
  icon: {
    color: "#05375a",
    fontSize: 20,
    paddingTop: 10,
  },
  text_input: {
    flex: 1,
    marginTop: 10,
    paddingBottom: 5,
    paddingLeft: 10,
    color: "gray",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(94, 111, 238)",
    paddingVertical: 10,
    marginTop: 30,
    borderRadius: 100,
  },
  text_login: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  area_forgot: {
    margin: 40,
    alignItems: "center",
  },
  text_signUp: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
  },
  button_GG: {
    width: "50%",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text_GG: {
    color: "red",
    fontSize: 14,
    fontWeight: "bold",
    paddingHorizontal: 15,
  },
  icon_GG: {
    color: "red",
    fontSize: 22,
  },
});

export default SigninScreen;
