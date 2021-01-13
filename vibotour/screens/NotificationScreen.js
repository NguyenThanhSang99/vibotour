import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import ItemNotification from "../components/ItemNotification";
import { getNotification } from "../utils/StorageUtil";
import UserLogin from "../components/UserLogin";
import { getToken } from "../utils/StorageUtil";
import { useFocusEffect } from "@react-navigation/native";

export default function NotificaitionScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [checkLogin, setCheckLogin] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      getToken().then((result) => {
        if (result) {
          setCheckLogin(true);
        } else {
          setCheckLogin(false);
        }
        getNotification().then((data) => {
          setData(data);
        });
      });
    }, [data])
  );

  const renderItem = (element) => {
    return (
      <View>
        <TouchableOpacity onPress={() => navigation.navigate("History")}>
          <ItemNotification dataFromParent={element} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text_header}>Thông báo</Text>
      </View>
      {checkLogin ? (
        <SafeAreaView style={styles.scroll}>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => {
              return item.id;
            }}
          />
        </SafeAreaView>
      ) : (
        <View style={styles.loginView}>
          <UserLogin navigation={navigation} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: vh(3),
  },
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginTop: 5,
  },
  text_header: {
    fontWeight: "bold",
    fontSize: 22,
    width: vw(75),
    color: "#000",
    marginLeft: 10,
  },
  scroll: {
    backgroundColor: "rgba(127, 140, 141,0.1)",
    height: vh(90),
    paddingBottom: vh(3),
  },
  loginView: {
    width: vw(100),
    marginTop: vh(28),
  },
});
