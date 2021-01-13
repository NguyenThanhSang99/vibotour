import { AsyncStorage } from "react-native";
import { Alert } from "react-native";
const storeToken = async (user) => {
  try {
    await AsyncStorage.setItem("userData", JSON.stringify(user));
  } catch (error) {
    console.log("Something went wrong", error);
  }
};
const getToken = async () => {
  try {
    let userData = await AsyncStorage.getItem("userData");
    let data = JSON.parse(userData);
    return data;
  } catch (error) {
    console.log("Something went wrong", error);
  }
};

const storeNotification = async (data) => {
  try {
    await AsyncStorage.setItem("Notification", JSON.stringify(data));
  } catch (error) {
    console.log("Something went wrong", error);
  }
};

const getNotification = async () => {
  try {
    let notificationData = await AsyncStorage.getItem("Notification");
    let data = JSON.parse(notificationData);
    return data;
  } catch (error) {
    console.log("Something went wrong", error);
  }
};

const addNotification = async (id, content, image) => {
  try {
    const promise = new Promise(async (resolve) => {
      let notificationData = await AsyncStorage.getItem("Notification");
      let data = [];
      if (notificationData) {
        data = JSON.parse(notificationData);
      }
      data.unshift({
        id: id,
        content: content,
        time: new Date(),
        image: image,
      });
      resolve(data);
    });
    promise.then((data) => {
      storeNotification(data);
    });
  } catch (error) {
    console.log("Something went wrong", error);
  }
};

const removeNotification = async (id) => {
  try {
    const promise = new Promise(async (resolve) => {
      let notificationData = await AsyncStorage.getItem("Notification");
      let data = JSON.parse(notificationData);
      data.forEach(function (value, index) {
        if (data[index].id === id) {
          data.splice(index, 1);
        }
      });
      resolve(data);
    });
    promise.then((data) => {
      storeNotification(data);
    });
  } catch (error) {
    console.log("Something went wrong", error);
  }
};

const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    // clear error
  }
  Alert.alert("Đăng xuất thành công!");
};

export {
  storeToken,
  getToken,
  storeNotification,
  getNotification,
  clearAll,
  addNotification,
  removeNotification,
};
