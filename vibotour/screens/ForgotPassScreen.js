import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { checkEmailExist } from "../utils/AccountUtil";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const ForgotPassScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [errorEmailMess, setErrorEmailMess] = useState("");
  const [errorPassMess, setErrorPassMess] = useState("");
  const [ModalComfirmVisible, setModalComfirmVisible] = useState(false);
  const [ModalPassVisible, setModalPassVisible] = useState(false);
  const [codeinput, setCodeInput] = useState("");
  const [codesend, setCodeSend] = useState("");
  const [time, setTime] = useState(3);
  const [timeNotice, setTimeNotice] = useState("");
  const [timeId, setTimeId] = useState();

  function validateEmail() {
    //check input email
    let regEmail = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    if (regEmail.test(email) === false) {
      setErrorEmailMess("Email is Not Correct");
      return false;
    } else {
      setErrorEmailMess(null);
      return true;
    }
  }
  function validatePass() {
    //check input pass
    let regPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    if (regPass.test(pass) === false) {
      setErrorPassMess("Upcase, Lowcase, Number and more than 8 chacracter");
      return false;
    } else {
      setErrorPassMess(null);
      return true;
    }
  }

  function sendMail() {
    let code = Math.floor(100000 + Math.random() * 900000);
    console.log(code);
    setCodeSend(code);
    fetch(process.env.SERVER_IP + "/api/v1/sendCode", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        codeSend: code.toString(),
        email: email,
      }),
    }).catch((error) => console.log(error));
  }
  function send() {
    if (validateEmail()) {
      checkEmailExist(email).then((check) => {
        console.log(check);
        if (check === true) {
          sendMail();
          setModalComfirmVisible(true);
          setTimeId(
            setTimeout(
              function () {
                setModalComfirmVisible(false);
              }.bind(this),
              60000
            )
          );
          setErrorEmailMess(null);
        } else {
          setErrorEmailMess("Chưa tạo tài khoản này!");
        }
      });
    }
  }

  function comfirm() {
    if (codeinput != codesend) {
      setTime(time - 1);
      setTimeNotice("Số lần nhập còn lại: " + time);
    } else {
      setModalComfirmVisible(false);
      setModalPassVisible(true);
    }
    if (time == 0) {
      setModalComfirmVisible(false);
    }
  }
  function cancelComfirm() {
    clearTimeout(timeId);
    setModalComfirmVisible(false);
    setTimeNotice(null);
  }
  function changePass() {
    fetch(process.env.SERVER_IP + "/api/v1/changePass", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        pass: pass,
      }),
    }).catch((error) => console.log(error));
  }
  function reset() {
    if (validatePass()) {
      console.log(pass);
      changePass();
      setModalPassVisible(false);
      navigation.navigate("Account");
    }
  }
  function cancelReset() {
    setErrorPassMess(null);
    setModalPassVisible(false);
    setModalComfirmVisible(false);
  }
  return (
    <Modal animationType="fade" transparent={true} visible={true}>
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={ModalComfirmVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.text_box_code}>
                <Text style={styles.modalText}>
                  Kiểm tra email để nhận mã code:
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
                  onPress={() => cancelComfirm()}
                >
                  <Text style={styles.text_sendMail}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => comfirm()}
                  style={styles.button_sendMail}
                >
                  <Text style={styles.text_sendMail}>Comfirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={ModalPassVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.text_box_code}>
                <Text style={styles.modalText}>Nhập mật khẩu mới:</Text>
              </View>

              <TextInput
                style={styles.inputCode}
                secureTextEntry={true}
                placeholder="Input your new Password"
                onChangeText={(pass) => setPass(pass)}
              ></TextInput>
              <Text style={styles.errorMess}>{errorPassMess}</Text>

              <View style={styles.box_button_SendCode}>
                <TouchableOpacity
                  style={styles.button_sendMail}
                  onPress={() => cancelReset()}
                >
                  <Text style={styles.text_sendMail}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => reset()}
                  style={styles.button_sendMail}
                >
                  <Text style={styles.text_sendMail}>Reset</Text>
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
        <Text style={styles.text_header}>Quên mật khẩu,</Text>
        <Text style={styles.text_header_dec}>
          Bạn sẽ được tạo lại một mật khẩu mới
        </Text>
        <View style={styles.footer}>
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

          <TouchableOpacity onPress={() => send()}>
            <View style={styles.button}>
              <Text style={styles.text_register}>Send</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.text_signIn}>
            <Text>Bạn đã có thông tin tài khoản.</Text>
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

export default ForgotPassScreen;
