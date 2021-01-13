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
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { checkEmailExist } from "../utils/AccountUtil";
import { storeToken } from "../utils/StorageUtil";

const SignupScreen = ({ navigation }) => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [errorUserMess, setErrorUserMess] = useState("");
  const [errorEmailMess, setErrorEmailMess] = useState("");
  const [errorPassMess, setErrorPassMess] = useState("");
  const [modalVisible, setModalVisible] = useState("");
  const [codeinput, setCodeInput] = useState("");
  const [codesend, setCodeSend] = useState("");
  const [time, setTime] = useState(2);
  const [timeNotice, setTimeNotice] = useState("");
  const [timeId, setTimeId] = useState();

  function validate() {
    //check input username
    let VIETNAMESE_DIACRITIC_CHARACTERS = process.env.VIETNAMESE_CHARACTER;

    let regName = new RegExp(
      "^[" + VIETNAMESE_DIACRITIC_CHARACTERS + " A-Z]{1,30}$"
    );
    if (
      regName.test(firstname.toUpperCase()) === false ||
      regName.test(lastname.toUpperCase()) === false
    ) {
      setErrorUserMess(
        "Họ và tên không chứa ký tự đặc biệt và có độ dài tối đa 30!!!"
      );
      return false;
    } else {
      setErrorUserMess(null);
    }
    //check input email
    let regEmail = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    if (regEmail.test(email) === false) {
      setErrorEmailMess("Email không đúng định dạng");
      return false;
    } else {
      setErrorEmailMess(null);
    }
    //check input pass
    let regPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    if (regPass.test(pass) === false) {
      setErrorPassMess(
        "Mật khẩu phải chứa chữ hoa, chữ thường, ký tự số và nhiều hơn 8 ký tự!!!"
      );
      return false;
    } else {
      setErrorPassMess(null);
    }
    return true;
  }

  function sendMail() {
    let code = Math.floor(100000 + Math.random() * 900000);
    setCodeSend(code);
    console.log(process.env.SERVER_IP);
    fetch(process.env.SERVER_IP + "/api/v1/sendCode", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        codeSend: code,
        email: email,
        firstName: firstname,
        lastName: lastname,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (!result) {
          console.log("Khong co ket qua");
        } else {
          console.log(result);
        }
      })
      .catch((error) => console.log(error));
  }
  function openDialog() {
    setModalVisible(true);
    setTimeId(
      setTimeout(function () {
        setModalVisible(false);
      }, 60000)
    );
  }

  function register() {
    if (validate()) {
      checkEmailExist(email).then((check) => {
        console.log(check);
        if (check === false) {
          openDialog();
          sendMail();
          setErrorEmailMess(null);
        } else {
          setErrorEmailMess(
            "Email đã được đăng ký bởi một tài khoản. \nVui lòng đăng ký email khác!!!"
          );
        }
      });
    }
  }
  function confirm() {
    if (codeinput != codesend) {
      console.log(codesend);
      setTime(time - 1);
      setTimeNotice("Số lần nhập còn lại: " + time);
    } else {
      fetch(process.env.SERVER_IP + "/api/v1/register", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: pass,
          firstName: firstname,
          lastName: lastname,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (result === "error" || result === "failed") {
            Alert.alert("Đăng ký thất bại!", "Vui lòng thử lại sau");
          } else {
            storeToken(result);
            Alert.alert(
              "Đăng ký thành công!!!",
              "Quay lại trang tài khoản",
              [{ text: "OK", onPress: () => navigation.navigate("Account") }],
              { cancelable: false }
            );
          }
        })
        .catch((error) =>
          Alert.alert("Đã có lỗi xảy ra!!!", "Vui lòng thử lại sau")
        );
    }
    if (time == 0) {
      cancel();
    }
  }
  function cancel() {
    setModalVisible(false);
    setTimeNotice(null);
    setTime(3);
    clearTimeout(timeId);
  }

  return (
    <Modal animationType="fade" transparent={true} visible={true}>
      <View style={styles.container}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.text_box_code}>
                <Text style={styles.modalText}>
                  Kiểm tra email của bạn để nhận mã code:
                </Text>
                <Text style={([styles.modalText], { fontWeight: "bold" })}>
                  {email}
                </Text>
              </View>

              <TextInput
                style={styles.inputCode}
                placeholder="Input your code"
                onChangeText={(code) => setCodeInput(code)}
              ></TextInput>
              <Text style={styles.errorMess}>{timeNotice}</Text>

              <View style={styles.box_button_SendCode}>
                <TouchableOpacity
                  style={styles.button_sendMail}
                  onPress={() => cancel()}
                >
                  <Text style={styles.text_sendMail}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => confirm()}
                  style={styles.button_sendMail}
                >
                  <Text style={styles.text_sendMail}>Comfirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
        <Text style={styles.text_header}>Tạo tài khoản,</Text>
        <Text style={styles.text_header_dec}>Tham gia cùng chúng tôi!</Text>
        <View style={styles.footer}>
          <View style={styles.areaName}>
            <View style={styles.name}>
              <Text style={styles.text_title}>Họ lót</Text>
              <View style={styles.box_input}>
                <Icon name="user-o" style={styles.icon} />
                <TextInput
                  onChangeText={(firstname) => setFirstName(firstname)}
                  placeholder="Your first name"
                  style={styles.text_input}
                />
              </View>
            </View>
            <View style={styles.name}>
              <Text style={styles.text_title}>Tên</Text>
              <View style={styles.box_input}>
                <TextInput
                  onChangeText={(lastname) => setLastName(lastname)}
                  placeholder="Your last name"
                  style={styles.text_input}
                />
              </View>
            </View>
          </View>
          <Text style={styles.errorMess}>{errorUserMess}</Text>

          <Text style={[styles.text_title, { marginTop: 20 }]}>Email</Text>
          <View style={styles.box_input}>
            <Icon name="envelope" style={styles.icon} />
            <TextInput
              placeholder="Your email"
              style={styles.text_input}
              keyboardType="email-address"
              onChangeText={(email) => setEmail(email)}
            />
          </View>
          <Text style={styles.errorMess}>{errorEmailMess}</Text>

          <Text style={[styles.text_title, { marginTop: 20 }]}>Mật khẩu</Text>
          <View style={styles.box_input}>
            <Icon name="lock" style={styles.icon} />
            <TextInput
              onChangeText={(pass) => setPass(pass)}
              placeholder="Your password"
              style={styles.text_input}
              secureTextEntry={true}
            />
          </View>
          <Text style={styles.errorMess}>{errorPassMess}</Text>

          <TouchableOpacity onPress={() => register()}>
            <View style={styles.button}>
              <Text style={styles.text_register}>Register</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.text_signIn}>
            <Text>Bạn đã có tài khoản.</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login", {})}>
              <Text style={{ color: "blue" }}> Sign In</Text>
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
    paddingBottom: 0,
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
  areaName: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  name: {
    width: "45%",
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
    marginTop: 50,
    borderRadius: 100,
  },
  text_register: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  text_signIn: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 50,
  },
  errorMess: {
    color: "red",
  },
  box_button_SendCode: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    marginTop: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  text_box_code: {
    alignItems: "center",
    marginBottom: 20,
  },
  modalText: {
    textAlign: "center",
  },
  button_sendMail: {
    width: "49%",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    borderRadius: 999,
    alignItems: "center",
    backgroundColor: "#F194FF",
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
    textAlign: "center",
  },
});

export default SignupScreen;
