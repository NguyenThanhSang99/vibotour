import React from "react";
import { WebView } from "react-native-webview";
import { ToastAndroid, Alert } from "react-native";
import { cancelTicket, sendEmailTicket } from "../utils/BookTourUtil";
import { addNotification } from "../utils/StorageUtil";

function CheckoutWebViewScreen(props) {
  const handleChange = async (e) => {
    if (
      !e.loading &&
      e.url === `${process.env.SERVER_IP}/api/v1/payment/success`
    ) {
      clearTimeout(props.timeId);
      props.items.forEach((item) => {
        addNotification(
          item.bookedTourId,
          "Bạn đã mua thành công " + item.count + " vé tour " + item.tourName,
          "https://firebasestorage.googleapis.com/v0/b/vibotour-f4715.appspot.com/o/notification%2Fnotification.gif?alt=media&token=6df9283a-90c0-4eb2-8abb-9282be1d50bb"
        );
      });
      await sendEmailTicket(
        props.items,
        props.firstName,
        props.lastName,
        props.email
      );
      Alert.alert(
        "Giao dịch thành công",
        "Kiểm tra email của bạn để nhận thông tin vé",
        [{ text: "OK", onPress: () => props.navigation.goBack() }],
        { cancelable: false }
      );
    } else if (
      !e.loading &&
      e.url === `${process.env.SERVER_IP}/api/v1/payment/cancel`
    ) {
      clearTimeout(props.timeId);
      cancelTickets();
      props.navigation.goBack();
      ToastAndroid.show("Payment Cancelled.", ToastAndroid.SHORT);
    }
  };

  function cancelTickets() {
    cancelTicket(props.items, props.userId)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <WebView
      originWhitelist={["*"]}
      source={{
        uri: `${process.env.SERVER_IP}/api/v1/web/checkout/redirect?sessionId=${props.sessionId}`,
      }}
      onNavigationStateChange={handleChange}
    />
  );
}

export default CheckoutWebViewScreen;
