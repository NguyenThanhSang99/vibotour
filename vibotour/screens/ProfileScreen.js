import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import PhoneInput from "react-native-phone-number-input";
import Icon from "react-native-vector-icons/FontAwesome";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";
import { getToken } from "../utils/StorageUtil";
import { requestLogin, getUserData } from "../utils/AccountUtil";
import ButtonUploadImage from "../components/ButtonUploadImage";
import { Picker } from "@react-native-community/picker";

const ProfileScreen = ({ route, navigation }) => {
  const [userId, setUserId] = useState();
  const [lastName, setLastName] = useState();
  const [firstName, setFirstName] = useState();
  const [email, setEmail] = useState();
  const [errorUserMess, setErrorUserMess] = useState("");
  const [errorPhoneMess, setErrorPhoneMess] = useState("");
  const [errorAddressMess, setErrorAddressMess] = useState("");
  const [address, setAddress] = useState();
  const [phone, setPhone] = useState();
  const [phoneCode, setPhoneCode] = useState("+");
  const [gender, setGender] = useState();
  const [image, setImage] = useState();

  useEffect(() => {
    getToken().then((userId) => {
      if (userId) {
        setUserData(userId);
        setUserId(userId);
      } else {
        requestLogin(navigation);
      }
    });
  }, []);
  let [fontsLoaded] = useFonts({
    "openSans-600": require("../assets/fonts/OpenSans-SemiBold.ttf"),
    "openSans-700": require("../assets/fonts/OpenSans-Bold.ttf"),
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  function setUserData(userId) {
    getUserData(userId)
      .then((user) => {
        if (!user) {
          requestLogin(navigation);
        } else {
          setEmail(user.email.trim());
          if (user.first_name) {
            setFirstName(user.first_name.trim());
          }
          if (user.last_name) {
            setLastName(user.last_name.trim());
          }
          if (user.image) {
            setImage(user.image.trim());
          }
          if (user.address) {
            setAddress(user.address.trim());
          }
          if (user.phone) {
            setPhone(user.phone.trim());
          }
          if (user.gender) {
            setGender(user.gender.trim());
          }
        }
      })
      .catch((error) => {
        console.log("Profile Screen: " + error);
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

      if (regNote.test(address)) {
        setErrorAddressMess("Địa chỉ không được chứa một số ký tự sau: <>=%$");
        resolve(false);
      } else {
        setErrorAddressMess(null);
      }
      resolve(true);
    });
  }
  async function updateProfile() {
    const check = await validate();
    if (check) {
      const user = {
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        address: address,
        phone: phone,
        gender: gender,
        image: image,
      };
      fetch(process.env.SERVER_IP + "/api/v1/updateUser", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          user: user,
        }),
      })
        .then((res) => res.text())
        .then((result) => {
          Alert.alert(result);
        })
        .catch((error) => {
          console.error("AccountUtil: " + error);
          Alert.alert("Đã có lỗi xảy ra!", "Vui lòng thử lại sau.");
        });
    }
  }

  return (
    <SafeAreaView>
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.navigate("Account", {
              image: image,
            })
          }
        >
          <Icon name="arrow-left" style={styles.backButton} />
        </TouchableOpacity>
        <View style={styles.container}>
          <View style={styles.avatar}>
            <ButtonUploadImage
              email={email}
              image={image}
              setImage={setImage}
            />
          </View>
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
                    value={firstName}
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
                    value={lastName}
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
            <Text style={styles.text_title}>Số điện thoại</Text>
            <View style={styles.box_input}>
              <PhoneInput
                style={[styles.text_input, styles.input_nomal]}
                defaultValue={phone}
                ref={(ref) =>
                  ref ? setPhoneCode("+" + ref.state.code) : setPhoneCode("+84")
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

            <Text style={[styles.text_title, { marginTop: 20 }]}>Địa chỉ</Text>
            <View style={styles.box_input}>
              <TextInput
                value={address}
                multiline={true}
                numberOfLines={20}
                placeholder="Your address"
                onChangeText={(address) => setAddress(address)}
                text={address}
                style={[styles.text_input, styles.input_note]}
              />
            </View>
            <Text style={styles.errorMess}>{errorAddressMess}</Text>
            <View style={{ margin: 20 }}>
              <TouchableWithoutFeedback onPress={() => updateProfile()}>
                <View style={[styles.button, { backgroundColor: "#3498db" }]}>
                  <Text style={{ color: "white", fontSize: 16 }}>Cập nhật</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#eee",
    alignItems: "center",
    fontFamily: "openSans-600",
  },
  backButton: {
    fontSize: 20,
    color: "#6646ee",
    paddingHorizontal: 10,
    paddingBottom: 5,
    marginTop: 15,
  },
  text_title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    fontFamily: "openSans-600",
  },
  input_nomal: {
    height: 50,
  },
  avatar: {
    height: 330,
  },
  footer: {
    width: "100%",
    height: "60%",
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
  input_note: {
    textAlignVertical: "top",
    paddingLeft: -10,
    height: 100,
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
  errorMess: {
    color: "red",
  },
});
export default ProfileScreen;
