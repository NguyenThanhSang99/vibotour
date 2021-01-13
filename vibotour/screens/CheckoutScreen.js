import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  Alert,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Picker } from "@react-native-community/picker";
import { getTouristData } from "../utils/AccountUtil";
import { getToken } from "../utils/StorageUtil";
import PhoneInput from "react-native-phone-number-input";
import { vh, vw } from "react-native-expo-viewport-units";
import * as WebBrowser from "expo-web-browser";
import { CommonActions } from "@react-navigation/native";
import axios from "axios";
import CheckoutWebViewScreen from "./CheckoutWebViewScreen";
import RecaptchaFirebaseComponent from "../components/RecaptchaFirebaseComponent";
import { requestLogin } from "../utils/AccountUtil";
import { cancelTicket } from "../utils/BookTourUtil";

const CheckoutScreen = ({ route, navigation }) => {
  const { item_list } = route.params;
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [errorUserMess, setErrorUserMess] = useState("");
  const [errorPhoneMess, setErrorPhoneMess] = useState("");
  const [errorNoteMess, setErrorNoteMess] = useState("");
  const [timeId, setTimeId] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [phoneCode, setPhoneCode] = useState("+");
  const [confirmPhone, setConfirmPhone] = useState(false);

  useEffect(() => {
    calculateTotal(item_list).then((total) => {
      setAmount(total);
    });
    getToken().then((token) => {
      if (token) {
        setUserId(token);
      } else {
        requestLogin(navigation);
      }
    });
    setTouristData();
  }, []);

  function calculateTotal(items) {
    return new Promise((resolve) => {
      let total = 0;
      items.map((item) => {
        total += item.count * item.cost;
      });
      resolve(total);
    });
  }

  function setTouristData() {
    getTouristData(item_list[0].bookedTourId)
      .then((tourist) => {
        if (!tourist) {
          requestLogin(navigation);
        } else {
          setEmail(tourist.tourist_email.trim());
          if (tourist.tourist_first_name) {
            setFirstName(tourist.tourist_first_name.trim());
          }
          if (tourist.tourist_last_name) {
            setLastName(tourist.tourist_last_name.trim());
          }
          if (tourist.tourist_phone) {
            setPhone(tourist.tourist_phone.trim());
          }
          if (tourist.tourist_gender) {
            setGender(tourist.tourist_gender.trim());
          }
        }
      })
      .catch((error) => {
        console.log("CheckoutScreen: " + error);
        if (!error) {
          requestLogin(navigation);
        } else {
          Alert.alert(
            "Đã có sự cố xảy ra",
            "Vui lòng thử lại sau!",
            [
              {
                text: "OK",
                onPress: () => {
                  navigation.goBack();
                },
              },
            ],
            { cancelable: false }
          );
        }
      });
  }

  function validate() {
    return new Promise((resolve) => {
      //check input name
      let VIETNAMESE_DIACRITIC_CHARACTERS = process.env.VIETNAMESE_CHARACTER;

      let regName = new RegExp(
        "^[" + VIETNAMESE_DIACRITIC_CHARACTERS + " A-Z]{1,30}$"
      );

      let regNote = new RegExp("[<>=%$]");
      let regPhone = /^[0]?\d{9}$/;
      if (
        regName.test(firstName.toUpperCase()) === false ||
        regName.test(lastName.toUpperCase()) === false
      ) {
        setErrorUserMess(
          "Họ và tên không chứa ký tự đặc biệt và tối đa 30 ký tự!!!"
        );
        resolve(false);
      } else {
        setErrorUserMess(null);
      }
      if (regPhone.test(phone) === false) {
        setErrorPhoneMess("Số điện thoại không đúng!!!");
        resolve(false);
      }
      if (!confirmPhone) {
        setErrorPhoneMess("Bạn chưa xác nhận số điện thoại!!!");
        resolve(false);
      } else {
        setErrorPhoneMess(null);
      }
      if (regNote.test(note)) {
        setErrorNoteMess("Ghi chú không được chứa một số ký tự sau: <>=%$");
        resolve(false);
      } else {
        setErrorNoteMess(null);
      }
      resolve(true);
    });
  }
  async function checkout() {
    const check = await validate();
    if (check) {
      setLoading(true);
      fetch(process.env.SERVER_IP + "/api/v1/saveTicket", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          itemList: item_list,
          userId: userId,
          phone: phone,
          email: email,
          gender: gender,
          firstName: firstName,
          lastName: lastName,
          note: note,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          if (typeof result === "string") {
            Alert.alert(result);
            cancelTickets();
          } else {
            handleCheckout();
          }
        })
        .catch((error) => {
          console.error("AccountUtil: " + error);
          Alert.alert("Đã có lỗi xảy ra!", "Vui lòng thử lại sau.");
        });
    }
  }
  function openDialog() {
    setModalVisible(true);
    setTimeId(
      setTimeout(function () {
        cancelTickets();
        setModalVisible(false);
      }, 300000)
    );
  }
  function cancel() {
    setModalVisible(false);
    clearTimeout(timeId);
  }

  function handleCheckout() {
    axios
      .post(`${process.env.SERVER_IP}/api/v1/checkout`, {
        items: item_list,
        email: email,
        userId: userId,
        platform: Platform.OS,
      })
      .then(async (res) => {
        setLoading(false);
        setSessionId(res.data.sessionId);
        if (Platform.OS === "web") {
          let result = await WebBrowser.openAuthSessionAsync(
            `${process.env.SERVER_IP}/api/v1/web/checkout/redirect?sessionId=${res.data.sessionId}`
          );
          if (result.type === "dismiss") {
            navigation.dispatch(
              CommonActions.navigate("Bag", {
                orderId: res.data.orderId,
                amount: amount,
              })
            );
          }
        } else {
          openDialog();
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log("CheckoutScreen: " + error.message);
        Alert.alert("Đã có lỗi xảy ra, vui lòng thử lại sau!");
        cancelTickets();
      });
  }

  function cancelTickets() {
    cancelTicket(item_list, userId)
      .then((result) => {
        console.log("Checkout Screen: cancel ticket success");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <Modal animationType="fade" transparent={true} visible={true}>
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            cancel();
          }}
        >
          <CheckoutWebViewScreen
            sessionId={sessionId}
            items={item_list}
            firstName={firstName}
            lastName={lastName}
            email={email}
            userId={userId}
            navigation={navigation}
            timeId={timeId}
          />
        </Modal>

        <SafeAreaView style={styles.container}>
          <ScrollView style={styles.scrollView}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-left" style={styles.backButton} />
            </TouchableOpacity>
            <Text style={styles.text_header}>Thông tin giao dịch,</Text>
            <Text style={styles.text_header_dec}>
              Chúng tôi sẽ liên hệ với bạn bằng những thông tin này!
            </Text>
            <View style={styles.footer}>
              <View style={styles.areaName}>
                <View style={styles.name}>
                  <Text style={styles.text_title}>Họ tên lót</Text>
                  <View style={styles.box_input}>
                    <Icon name="user-o" style={styles.icon} />
                    <TextInput
                      value={firstName}
                      onChangeText={(firstname) => setFirstName(firstname)}
                      placeholder="Your first name"
                      style={[styles.text_input, styles.input_nomal]}
                      autoFocus
                    />
                  </View>
                </View>
                <View style={styles.name}>
                  <Text style={styles.text_title}>Tên</Text>
                  <View style={styles.box_input}>
                    <TextInput
                      value={lastName}
                      onChangeText={(lastname) => setLastName(lastname)}
                      placeholder="Your last name"
                      style={[styles.text_input, styles.input_nomal]}
                    />
                  </View>
                </View>
              </View>
              <Text style={styles.errorMess}>{errorUserMess}</Text>
              <Text style={styles.text_title}>Giới tính</Text>
              <View style={styles.box_input}>
                <Icon name="transgender" style={styles.icon} />
                <Picker
                  selectedValue={gender}
                  style={[styles.text_input, styles.input_nomal]}
                  onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
                  autoFocus
                >
                  <Picker.Item label="Nam" value="Male" />
                  <Picker.Item label="Nữ" value="Female" />
                </Picker>
              </View>
              <Text style={[styles.email_text]}>Địa chỉ email: {email}</Text>
              <Text style={styles.text_title}>Số điện thoại</Text>
              <View style={styles.box_input}>
                <PhoneInput
                  style={[styles.text_input, styles.input_nomal]}
                  defaultValue={phone}
                  ref={(ref) =>
                    ref
                      ? setPhoneCode("+" + ref.state.code)
                      : setPhoneCode("+84")
                  }
                  defaultCode="VN"
                  onChangeFormattedText={(text) => {
                    setErrorPhoneMess("");
                    setPhone(text.substr(phoneCode.length));
                  }}
                  withDarkTheme
                  withShadow
                />
              </View>
              <Text style={styles.errorMess}>{errorPhoneMess}</Text>
              <RecaptchaFirebaseComponent
                phoneNumber={phoneCode + phone}
                setConfirmPhone={setConfirmPhone}
              />

              <View>
                <Text style={styles.text_title}>Ghi chú</Text>
                <View style={styles.box_input}>
                  <TextInput
                    value={note}
                    multiline={true}
                    numberOfLines={20}
                    onChangeText={(note) => setNote(note)}
                    placeholder="Additional information"
                    style={[styles.text_input, styles.input_note]}
                  />
                </View>
              </View>
              <Text style={styles.errorMess}>{errorNoteMess}</Text>
              <View style={{ margin: 20 }}>
                <TouchableWithoutFeedback
                  onPress={loading ? () => {} : () => checkout()}
                >
                  <View
                    style={[
                      styles.button,
                      { backgroundColor: loading ? "#93ACF8" : "#2ecc71" },
                    ]}
                  >
                    <Text style={{ color: "white", fontSize: 16 }}>
                      {loading
                        ? "Redirecting You to Checkout..."
                        : `Thanh toán ${amount} đồng`}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1464",
    paddingTop: 5,
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
    marginBottom: 5,
  },
  footer: {
    width: "100%",
    height: "90%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingBottom: 40,
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
  },
  icon: {
    color: "#05375a",
    fontSize: 20,
    paddingTop: 15,
  },
  text_input: {
    flex: 1,
    paddingBottom: 5,
    paddingLeft: 10,
    color: "gray",
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },
  input_nomal: {
    height: 50,
  },
  input_note: {
    textAlignVertical: "top",
    paddingLeft: -10,
    height: 100,
  },
  email_text: {
    flex: 1,
    paddingTop: 15,
    height: 50,
    color: "black",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0097e6",
    paddingVertical: 10,
    marginBottom: 50,
    borderRadius: 100,
    borderColor: "transparent",
    width: "100%",
  },
  text_register: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorMess: {
    color: "red",
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
  button_sendMail: {
    width: "49%",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    borderRadius: 999,
    alignItems: "center",
    backgroundColor: "#0097e6",
  },
  text_sendMail: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    paddingHorizontal: 15,
  },
  checkout: {
    width: vw(100),
    height: vh(50),
  },
});
export default CheckoutScreen;
