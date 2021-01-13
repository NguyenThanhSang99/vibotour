import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  AppRegistry,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  YellowBox,
  Text,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { vw, vh } from "react-native-expo-viewport-units";
import {
  GiftedChat,
  InputToolbar,
  Bubble,
  Send,
  Message,
} from "react-native-gifted-chat";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as Speech from "expo-speech";
import MusicPlayer from "../utils/MusicPlayer";
import { getToken } from "../utils/StorageUtil";
import { requestLogin } from "../utils/AccountUtil";
import { bookTour } from "../utils/BookTourUtil";
import { handleArray } from "../utils/Array2D";
import { getRandom, replyArray } from "../utils/ArrayUtil";
import STTButton from "../components/STTButton";
import DataPlaces from "../utils/DataPlaces";
import Suggest from "../utils/Suggest";
import { placeArray } from "../utils/ScheduleUtil";
import { checkTime } from "../utils/ChatbotScheduleUtil";
import ChooseDateTime from "../components/ChooseDateTime";
import {
  formatDateTime,
  addHours,
  calculateNumberSessions,
} from "../utils/DateUtil";
import { createRandomId } from "../utils/RandomUtil";

import { list } from "../config/list";
YellowBox.ignoreWarnings([
  "Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`",
  "Animated.event now requires a second argument for options",
]);

const ChatbotScreen = ({ navigation }) => {
  const BOT = {
    _id: 2,
    name: "vi Bot",
    avatar: require("../assets/image/chatbot.png"),
  };
  const [isSpeech, setIsSpeech] = useState(false);
  const [botImage, setBotImage] = useState(process.env.BOT_HEAR);
  const DEFAULT_REPLY = replyArray;
  const [messages, setMessages] = useState([
    createReply(getRandom(DEFAULT_REPLY, 4)),
    {
      _id: 1,
      text: `Hi! Tôi là vibo 🤖 đến từ Việt Nam.\n\nTôi có thể giúp gì cho bạn?`,
      createdAt: new Date(),
      user: BOT,
    },
  ]);

  const [places, setPlaces] = useState([]);

  const [isTimeModal, setIsTimeModal] = useState(false);

  const [playing, setPlaying] = useState(false);

  const [music, setMusic] = useState(new MusicPlayer(list));

  var axios = require("axios");
  var qs = require("qs");
  var data = qs.stringify({
    user_id: "aee23fd0-8aa1-4267-9e71-170b5c206981",
  });
  const [timeStart, setTimeStart] = useState();
  const [timeFinish, setTimeFinish] = useState();

  const startPlay = () => {
    if (playing === true) {
      music.stopMusic().then(() => {
        music.startPlay().then(() => {
          setPlaying(true);
        });
      });
    } else {
      music.startPlay().then(() => {
        setPlaying(true);
      });
    }
  };

  const customtInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: "white",
          borderRadius: 10,
        }}
      />
    );
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: "white",
          },
        }}
        wrapperStyle={{
          left: {
            backgroundColor: "#f1f0f0",
          },
          right: {
            margin: 10,
          },
        }}
      />
    );
  };

  const customMessage = (props) => {
    return (
      <Message
        {...props}
        containerStyle={{
          left: {
            borderRadius: 20,
          },
          right: {
            flexDirection: "row-reverse",
          },
        }}
      />
    );
  };

  function createReply(reply) {
    return {
      _id: createRandomId(),
      user: { _id: 1 },
      quickReplies: {
        type: "radio", // or 'checkbox',
        keepIt: false,
        values: reply,
      },
    };
  }

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={{ marginRight: 10, marginBottom: 5 }}>
          <Ionicons name="md-send" size={30} color="gray" />
        </View>
      </Send>
    );
  };

  function scrollToBottomComponent() {
    return (
      <View style={styles.bottomComponentContainer}>
        <MaterialCommunityIcons
          name="chevron-double-down"
          color={"#6646ee"}
          size={30}
        />
      </View>
    );
  }

  function onSend(newMessages) {
    setMessages((prevMessages) => [...newMessages, ...prevMessages]);
    let text = newMessages[0].text;
    fetch(process.env.CHATBOT_SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
      }),
    })
      .then((response) => response.text())
      .then((result) => {
        sendBotResponse(result);
      })
      .catch((error) => {
        console.log("error", error);
        sendError();
      });
  }

  function sendError() {
    const text =
      "Sorry, Some errors happen. Please context us to be supported.";
    sendBotResponse(text);
  }

  function getWeather(lat, lon, suitable) {
    var config = {
      method: "get",
      url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&lang=vi&exclude=hourly,current,minutely,alerts&appid=16829317f5606c1a0e3d680cf3972cac`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        let text = `Thời tiết ở đây hôm nay: ${response.data.daily[0].weather[0].description} \nNhiệt độ cao nhất: ${response.data.daily[0].temp.max}℃ \nNhiệt độ thấp nhất: ${response.data.daily[0].temp.min}℃`;
        responseBotMessage(text);
        if (isSpeech) {
          speechText(text);
        }
        if (response.data.daily[0].weather[0].main == "Thunderstorm") {
          let alert =
            "Trời đang bão!! \nHôm nay không thích hợp cho chuyến đi chơi chút nào bạn nghĩ sao về việc nhâm nhi một tách trà nóng, ngồi xem một bộ phim hay \n Giữ an toàn bạn nhé";
          responseBotMessage(alert);
        } else {
          if (lat != 16.0471574) {
            if (
              response.data.daily[0].weather[0].main == "Rain" ||
              (response.data.daily[0].weather[0].main == "Drizzle" &&
                suitable == "out_side")
            ) {
              let alerts = `Hôm nay không phải là một ngày tốt để tham quan nơi này`;
              responseBotMessage(alerts);
            }
          } else {
            let suggest;
            if (
              response.data.daily[0].weather[0].main == "Rain" ||
              response.data.daily[0].weather[0].main == "Drizzle"
            ) {
              suggest =
                Suggest[0].suggests[
                  Math.floor(Math.random() * Suggest[0].suggests.length)
                ];
            } else if (response.data.daily[0].weather[0].main == "Clear") {
              suggest =
                Suggest[1].suggests[
                  Math.floor(Math.random() * Suggest[0].suggests.length)
                ];
            }
            responseBotMessage(suggest);
          }
          replyOnBot(getRandom(DEFAULT_REPLY, 4));
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function sendBotResponse(message) {
    var text = message;
    var res = text.split(" ");
    var index = text.charAt(text.length - 1);

    if (res[0] === "9") {
      getWeather(16.0471574, 108.1366648);
    } else if (res[0] === "1") {
      responseBotMessage(res[1]);
    } else if (res[0] === "2") {
      searchTourOnBot(message.substring(2));
    } else if (res[0] === "5") {
      setSchedule();
    } else {
      let count = 0;
      DataPlaces.forEach((elm) => {
        if (elm.signal == index) {
          count++;
          getWeather(elm.lat, elm.lon, elm.suitable);
          text = text.slice(0, text.length - 1);
          responseBotMessage(text);
        }
      });
      if (count == 0) {
        responseBotMessage(text);
        replyOnBot(getRandom(DEFAULT_REPLY, 4));
      }
    }

    if (isSpeech === true) {
      if (res[0] === "1") {
        changeEmotion(res[1]);
      } else if (res[0] === "2" || res[0] === "3" || res[0] === "5") {
        speechText(
          "Thông tin này không được hỗ trợ giọng nói. Bạn vui lòng xem ở phần chat bạn nhé."
        );
      } else {
        speechText(text);
      }
    }
  }

  function changeEmotion(text) {
    switch (text.toLowerCase()) {
      case "sing":
        startMusic();
        break;
      case "love":
        speechText("He he, love you.").then(() => {
          setBotImage(process.env.BOT_LOVE);
        });
        break;
      case "angry":
        setBotImage(process.env.BOT_ANGRY);
        break;
      case "cry":
        setBotImage(process.env.BOT_CRY);
        break;
      case "like":
        setBotImage(process.env.BOT_LIKE);
        break;
      case "food":
        setBotImage(process.env.BOT_FOOD);
        break;
      case "rich":
        setBotImage(process.env.BOT_RICH);
        break;
      case "smile":
        setBotImage(process.env.BOT_HAPPY);
        break;
      case "stop":
        stopMusic();
        break;
      default:
      // code block
    }
  }

  function startMusic() {
    speechText("Okey, music.").then(() => {
      let number = Math.floor(Math.random() * 2);
      if (number === 0) {
        setBotImage(process.env.BOT_SING);
      } else {
        setBotImage(process.env.BOT_DRUM);
      }
      startPlay();
    });
  }

  function stopMusic() {
    if (playing === true) {
      music.stopMusic().then(() => {
        setPlaying(false);
      });
    }
    speechText("All right, stop music.");
  }

  function responseBotMessage(text) {
    let newMessages = [
      {
        _id: createRandomId(),
        text,
        createdAt: new Date(),
        user: BOT,
      },
    ];
    setMessages((prevMessages) => [...newMessages, ...prevMessages]);
  }

  function responseUserMessage(text) {
    let newMessages = [
      {
        _id: createRandomId(),
        text,
        createdAt: new Date(),
        user: {
          _id: 1,
        },
      },
    ];
    setMessages((prevMessages) => [...newMessages, ...prevMessages]);
  }

  function sendImageOnBot(text, image) {
    let newMessages = [
      {
        _id: createRandomId(),
        createdAt: new Date(),
        text,
        user: BOT,
        image: process.env.SERVER_IP + "/vibotour/images/" + image,
        // Mark the message as sent, using one tick
        sent: true,
        // Mark the message as received, using two tick
        received: true,
        // Mark the message as pending with a clock loader
        pending: true,
      },
    ];
    setMessages((prevMessages) => [...newMessages, ...prevMessages]);
  }

  function replyOnBot(reply) {
    let newMessages = [createReply(reply)];
    setMessages((prevMessages) => [...newMessages, ...prevMessages]);
  }

  async function searchTourOnBot(name) {
    let url = process.env.SERVER_IP + "/api/v1/searchTour?searchString=" + name;
    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        if (Object.keys(responseJson).length === 0) {
          responseBotMessage(
            "Xin lỗi bạn, hiện tại chúng tôi đã hết tour đến " +
              name +
              " rồi!!! 😅😅. Bạn có thể thử tìm tour khác nhé! 🤔😇"
          );
        } else {
          responseBotMessage(
            "Bạn có thể tham khảo một số tour đến " +
              name +
              " của chúng tôi ở bên dưới 🤔😘"
          );
          let promise = new Promise((resolve) => {
            let reply = [];
            responseJson.map((item) => {
              let text =
                "Tên tour: " +
                item.tourname +
                "\nThời gian: " +
                item.numberday +
                " ngày " +
                item.numbernight +
                " đêm" +
                "\nGiá: " +
                item.tourcost +
                " đồng\nĐánh giá: " +
                item.rating +
                " ⭐";
              //sendBotResponse(text, item.tourid);
              sendImageOnBot(text, item.img);
              reply.push({
                title: "Đặt tour " + item.tourname + " 😘",
                value: "book " + item.tourid,
              });
            });
            resolve(reply);
          });
          promise.then((reply) => {
            reply.push({
              title: "Địa điểm du lịch khác 😘",
              value: "Địa điểm du lịch khác",
            });
            replyOnBot(reply);
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function speechText(text) {
    return new Promise((resolve) => {
      Speech.stop();
      var start = () => {
        setBotImage(process.env.BOT_SAY);
      };
      var complete = () => {
        setBotImage(process.env.BOT_HEAR);
        resolve();
      };
      if (playing === true) {
        music.stopMusic().then(() => {
          setPlaying(false);
        });
      }
      Speech.speak(text.split("  ")[0], {
        rate: 1.0,
        onStart: start,
        onDone: complete,
      });
    });
  }

  function changeSpeechBot() {
    if (isSpeech) {
      stopVoice();
    }
    setIsSpeech(!isSpeech);
  }

  function stopVoice() {
    setBotImage(process.env.BOT_HEAR);
    music.stopMusic();
    Speech.stop();
  }

  function sendNormalUserMessage(text) {
    let newMessages = [
      {
        _id: createRandomId(),
        text,
        createdAt: new Date(),
        user: {
          _id: 1,
        },
      },
    ];
    onSend(newMessages);
  }

  function sendSpeech(text) {
    if (text) {
      sendNormalUserMessage(text);
    }
  }

  function handleReplyBook(quickReply, rep) {
    responseUserMessage(quickReply[0].title);
    getToken().then((userId) => {
      var promise = new Promise((resolve) => {
        if (userId) {
          try {
            bookTour(userId, rep[1]).then((result) => {
              if (result === "Đặt tour thành công!") {
                responseBotMessage(
                  "Đặt tour thành công, bạn có thể kiểm tra giỏ hàng của mình để xem nó. 😘😘😘"
                );
              } else {
                responseBotMessage(result + ". 😅");
              }
              resolve();
            });
          } catch {
            responseBotMessage(
              "Có lỗi xảy ra, bạn vui lòng thử lại sau nhé. 😅"
            );
            resolve();
          }
        } else {
          responseBotMessage(
            "Bạn phải đăng nhập vào ứng dụng để đặt tour bạn nhé. 🤔🤔"
          );
          requestLogin(navigation);
          resolve();
        }
      });
      promise.then(() => {
        replyOnBot(getRandom(DEFAULT_REPLY, 4));
      });
    });
  }

  function handleReplyChoosePlace(quickReply) {
    // Xử lý chọn địa điểm
    var promise = new Promise(function (resolve) {
      placeArray.forEach(function (value, index) {
        if (placeArray[index].value === quickReply[0].value) {
          placeArray.splice(index, 1);
        }
      });
      resolve();
    });
    promise.then(() => {
      calculateNumberSessions(timeStart, timeFinish).then((value) => {
        responseUserMessage(quickReply[0].title);
        setPlaces((prevPlaces) => [...prevPlaces, quickReply[0]]);
        checkTime(places, value).then((value) => {
          let rep = [];
          if (value) {
            responseBotMessage("Bạn có chọn thêm địa điểm nào không: ");
            let length = placeArray.length >= 4 ? 4 : placeArray.length;
            rep = getRandom(placeArray, length);
          } else {
            responseUserMessage(
              "Lưu ý: thời gian cho chuyến đi của bạn không đảm bảo.\nBạn có thể thay đổi nó lại hoặc giảm số địa điểm."
            );
          }
          rep.push(
            {
              title: "Chuyển sang chọn thời gian 🤓",
              value: "Time update",
            },
            {
              title:
                "Hoàn thành lịch trình sơ cấp, bạn có thể chỉnh sửa lại nó sau 🤓",
              value: "Complete Schedule",
            }
          );
          replyOnBot(rep);
        });
      });
    });
  }

  async function onQuickReply(quickReply) {
    let rep = quickReply[0].value.split(" ");
    switch (rep[0]) {
      case "book":
        handleReplyBook(quickReply, rep);
        return;
      case "Choose":
        handleReplyChoosePlace(quickReply);
        break;
      case "Add":
        choosePlaces();
        break;
      case "Delete":
        await removePlace(quickReply);
        await generateSchedule();
        replyAfterGenerate();
        break;
      case "Time":
        responseUserMessage(quickReply[0].title);
        replyTime(rep[1]);
        break;
      case "Complete":
        completeSchedule();
        break;
      case "Final":
        generateFinalSchedule();
        break;
      default:
        sendNormalUserMessage(quickReply[0].value);
    }
  }
  function removePlace(quickReply) {
    return new Promise((resolve) => {
      places.forEach(function (value, index) {
        if (places[index].id === quickReply[0].id) {
          placeArray.push(places[index]);
          places.splice(index, 1);
        }
      });
      resolve();
    });
  }
  function generateSchedule() {
    return new Promise((resolve) => {
      handleArray(places).then((arrResult) => {
        setPlaces(arrResult);
        responseBotMessage("Lịch trình của bạn đây:");
        arrResult.forEach((item, index) => {
          let text =
            "Thứ tự ghé chơi: " +
            (index + 1) +
            "\n-> Đến " +
            item.title +
            "\n-> Thỏa sức vui chơi " +
            item.time +
            " tại đây" +
            "\n-> Ghé ăn uống tại " +
            item.food;
          sendImageOnBot(text, item.image);
        });
        resolve();
      });
    });
  }
  async function completeSchedule() {
    await generateSchedule();
    replyAfterGenerate();
  }

  async function generateFinalSchedule() {
    await generateSchedule();
    responseUserMessage("Hoàn thành lịch trình!");
  }

  function replyAfterGenerate() {
    let rep = [];
    places.forEach((item) => {
      rep.push({
        id: item.id,
        title: "Xóa " + item.title,
        value: "Delete " + item.value,
      });
    });
    rep.push(
      {
        title: "Chọn thêm địa điểm",
        value: "Add place",
      },
      {
        title: "Kết thúc tạo lịch trình chính thức",
        value: "Final schedule",
      }
    );
    replyOnBot(rep);
  }

  function replyTime(type) {
    if (type === "cancel") {
      responseBotMessage(
        "Okey, bạn có thể tham khảo các tour có sẵn của chúng tôi"
      );
    } else if (type === "update") {
      chooseTime();
    } else {
      choosePlaces();
    }
  }

  function setSchedule() {
    responseBotMessage(
      "Okey, tôi sẽ giúp bạn thiết lập một lịch trình du lịch tuyệt với nhé! 😇😇"
    );
    chooseTime();
  }

  function chooseTime() {
    responseBotMessage("Bạn hãy chọn thời gian cho chuyến du lịch nào");
    setTimeout(function () {
      setIsTimeModal(true);
    }, 1500);
  }

  function closeTimeModal() {
    setIsTimeModal(false);
    if (!timeFinish || !timeStart) {
      responseBotMessage(
        "Thông tin ngày đi và về cần thiết cho một chuyến đi."
      );
      responseBotMessage(
        "Bạn cung cấp đầy đủ thông tin này cho tôi được không."
      );
      let rep = [
        {
          title: "😋 Hủy lịch trình này",
          value: "Time cancel",
        },
        {
          title: "Okey",
          value: "Time update",
        },
      ];
      replyOnBot(rep);
    } else {
      calculateNumberSessions(timeStart, timeFinish).then((value) => {
        checkTime(places, value).then((value) => {
          if (value) {
            responseUserMessage("Ngày đi: " + formatDateTime(timeStart));
            responseUserMessage("Ngày về: " + formatDateTime(timeFinish));
          } else {
            responseUserMessage(
              "Lưu ý: thời gian cho chuyến đi của bạn không đảm bảo.\nBạn có thể thay đổi nó lại hoặc giảm số địa điểm."
            );
          }
          if (places.length === 0) {
            responseBotMessage(
              "Cuối cùng, bạn cần phải chọn các địa điểm để đi. Hãy chọn nơi bạn đến đầu tiên."
            );
            choosePlaces();
          } else {
            replyAfterGenerate();
          }
        });
      });
    }
  }

  function choosePlaces() {
    responseBotMessage(
      "Tôi sẽ gợi ý cho bạn một số địa điểm sau, hãy chọn nó cho chuyến du lịch của bạn nhé: "
    );
    let rep = getRandom(placeArray, 6);
    replyOnBot(rep);
  }

  function changeTimeStart(date) {
    setTimeStart(date);
    if (timeFinish && timeFinish.getTime() < addHours(date, 5).getTime()) {
      alertFinishTime(date);
    }
  }

  function changeTimeFinish(date) {
    if (!timeStart) {
      Alert.alert("Bạn cần chọn thời gian đi trước");
    } else if (date.getTime() < addHours(timeStart, 5).getTime()) {
      alertFinishTime(timeStart);
    } else {
      setTimeFinish(date);
    }
  }

  function alertFinishTime(time) {
    Alert.alert("Thời gian về phải sau thời gian đi tối thiểu 5 giờ");
    setTimeFinish(addHours(time, 5));
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton}>
        <MaterialCommunityIcons
          name="keyboard-backspace"
          color={"#6646ee"}
          size={30}
          onPress={() => navigation.goBack()}
        />
      </TouchableOpacity>
      <View style={styles.speech}>
        <MaterialCommunityIcons
          name="text-to-speech"
          color={"#fff"}
          size={30}
          onPress={() => changeSpeechBot()}
        />
      </View>

      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
        placeholder="Type your message..."
        scrollToBottom
        onQuickReply={(quickReply) => onQuickReply(quickReply)}
        renderSend={(props) => renderSend(props)}
        renderBubble={(props) => renderBubble(props)}
        renderInputToolbar={(props) => customtInputToolbar(props)}
        renderMessage={(props) => customMessage(props)}
        scrollToBottomComponent={scrollToBottomComponent}
      />
      <Modal
        animationType="slide"
        transparent={false}
        visible={isSpeech}
        onRequestClose={() => {
          changeSpeechBot();
        }}
      >
        <View style={styles.speechContainer}>
          <View style={styles.speechBg}>
            <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }}>
              <TouchableOpacity style={styles.backButton}>
                <MaterialCommunityIcons
                  name="keyboard-backspace"
                  color={"#6646ee"}
                  size={30}
                  onPress={() => {
                    changeSpeechBot();
                  }}
                />
              </TouchableOpacity>
              <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                accessible={false}
              >
                <View style={styles.viewBot}>
                  <TouchableOpacity onPress={() => stopVoice()}>
                    <Image style={styles.bot} source={{ uri: botImage }} />
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
              <View style={styles.inputContainer}>
                <STTButton handleClick={(text) => sendSpeech(text)} />
              </View>
            </KeyboardAvoidingView>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isTimeModal}
        onRequestClose={() => {
          closeTimeModal();
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.text_box_code}>
              <Text style={styles.tiltle}>Lựa chọn thời gian du lịch</Text>
            </View>

            <Text style={styles.modal_text}>
              Thời gian xuất phát: {formatDateTime(timeStart)}
            </Text>
            <ChooseDateTime
              getDateTime={(date) => {
                changeTimeStart(date);
              }}
              minimumDate={new Date()}
              date={timeStart}
            />

            <Text style={styles.modal_text}>
              Thời gian trở về: {formatDateTime(timeFinish)}
            </Text>
            <ChooseDateTime
              getDateTime={(date) => {
                changeTimeFinish(date);
              }}
              minimumDate={timeStart}
              date={timeFinish}
            />
            <View style={styles.btn_okey_datetime}>
              <TouchableOpacity
                onPress={closeTimeModal}
                style={styles.button_okey}
              >
                <Text style={styles.tiltle}>Okey</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // rest remains same
  container: {
    width: "100%",
    height: "100%",
    flex: 1,
    backgroundColor: "#fff",
  },
  bottomComponentContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    marginTop: vh(4),
    marginLeft: vw(5),
    width: 30,
    zIndex: 2,
    position: "relative",
  },
  speechContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  speechBg: {
    width: vw(100),
    height: vh(100),
  },
  speech: {
    marginTop: vh(4),
    width: vh(7),
    height: vh(4),
    marginLeft: vw(79),
    backgroundColor: "#3498db",
    position: "absolute",
    borderRadius: 20,
    justifyContent: "center",
    padding: 5,
  },
  viewBot: {
    width: vw(70),
    marginTop: vh(10),
    height: vh(70),
    marginLeft: vw(15),
    padding: 20,
  },
  bot: {
    width: "auto",
    height: vh(40),
  },
  input: {
    margin: 2,
    paddingLeft: 15,
    flex: 1,
    height: 40,
    padding: 10,
    fontSize: 14,
    fontWeight: "400",
    borderWidth: 1,
    borderColor: "#cccccc",
  },

  inputContainer: {
    minWidth: "100%",
    marginTop: -100,
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
  },

  submitButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    padding: 10,
  },

  submitButton: {
    backgroundColor: "#0a9ffc",
    padding: 10,
    margin: 2,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  tiltle: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
    paddingHorizontal: 15,
  },
  modal_text: {
    color: "#fff",
    fontSize: 15,
    paddingHorizontal: 15,
    marginLeft: vw(1),
    marginTop: vh(2),
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: vw(90),
    backgroundColor: "#555",
    borderRadius: 50,
    padding: 20,
    paddingLeft: 0,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  button_okey: {
    width: "40%",
    marginLeft: "35%",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    borderRadius: 999,
    alignItems: "center",
    backgroundColor: "#e17055",
  },
});

export default ChatbotScreen;
AppRegistry.registerComponent("VoiceNative", () => VoiceNative);
