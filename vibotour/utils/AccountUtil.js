import { Alert } from "react-native";
const checkEmailExist = (email) => {
  return new Promise((resolve) => {
    fetch(process.env.SERVER_IP + "/api/v1/user", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (Object.keys(result).length === 0) {
          resolve(false);
        } else {
          resolve(true);
        }
      })
      .catch((error) => console.log(error));
  });
};

const getTouristData = (bookedTourId) => {
  return new Promise((resolve, reject) => {
    fetch(process.env.SERVER_IP + "/api/v1/touristInfo", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        bookedTourId: bookedTourId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (Object.keys(result).length === 0) reject(null);
        else resolve(result[0]);
      })
      .catch((error) => {
        console.error("AccountUtil: " + error);
        reject(error);
      });
  });
};

const getUserData = (userId) => {
  return new Promise((resolve, reject) => {
    fetch(process.env.SERVER_IP + "/api/v1/getUserById", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (Object.keys(result).length === 0) reject(null);
        else resolve(result[0]);
      })
      .catch((error) => {
        console.error("AccountUtil: " + error);
        reject(error);
      });
  });
};

const requestLogin = (navigation) => {
  Alert.alert(
    "Yêu cầu đăng nhập",
    "Vui lòng đăng nhập để sử dụng chức năng này!",
    [
      {
        text: "OK",
        onPress: () => {
          navigation.navigate("Login");
        },
      },
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
    ],
    { cancelable: false }
  );
};

export { checkEmailExist, getTouristData, getUserData, requestLogin };
