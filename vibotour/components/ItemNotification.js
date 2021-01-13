import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import { timeSince } from "../utils/DateUtil";
import { MaterialIcons } from "@expo/vector-icons";
import { removeNotification } from "../utils/StorageUtil";

export default function ItemNotification(props) {
  const [notificationId, setNotificationId] = useState();
  const [content, setContent] = useState();
  const [time, setTime] = useState();
  const [image, setImage] = useState();

  useEffect(() => {
    setNotificationId(props.dataFromParent.item.id);
    setContent(props.dataFromParent.item.content);
    setTime(timeSince(props.dataFromParent.item.time));
    setImage(props.dataFromParent.item.image);
  }, [timeSince(props.dataFromParent.item.time)]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconCancel}
        onPress={() => removeNotification(notificationId)}
      >
        <MaterialIcons name="cancel" size={29} color="red" />
      </TouchableOpacity>
      <Image
        source={{
          uri: image,
        }}
        style={styles.image}
      />
      <View style={styles.informationContain}>
        <Text style={styles.contentText}>{content}</Text>
        <View style={styles.itemBottom}>
          <Text style={styles.timeText}>{time} </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    margin: 10,

    backgroundColor: "rgba(0,0,0,0.6)",
    color: "#fff",
    height: vh(13),
    width: "95%",
    borderWidth: 0,
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  informationContain: {
    marginLeft: vh(1),
    marginTop: vh(1),
    flexDirection: "column",
    justifyContent: "space-between",
    height: vh(10),
  },
  image: {
    marginLeft: vh(1.5),
    marginRight: vh(1.5),
    marginTop: vh(1.5),
    width: vh(10),
    height: vh(10),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  contentText: {
    fontSize: vh(2),
    color: "#fff",
    width: vw(51),
  },
  itemBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeText: {
    fontSize: vw(3),
    color: "#fff",
  },
  iconCancel: {
    position: "absolute",
    right: -vw(2),
    top: vh(-1.3),
  },
});
