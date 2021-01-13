import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Text,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { vw } from "react-native-expo-viewport-units";

export default function ChooseDateTime(props) {
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    setShow(Platform.OS === "ios");
    props.getDateTime(selectedDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  return (
    <View>
      <View style={styles.btn_date_time}>
        <TouchableOpacity style={styles.btn_date} onPress={showDatepicker}>
          <Text style={styles.txt_btn}>Chọn ngày</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={showTimepicker} style={styles.btn_date}>
          <Text style={styles.txt_btn}>Chọn giờ</Text>
        </TouchableOpacity>
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={props.date ? props.date : new Date()}
          minimumDate={props.minimumDate}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  btn_date_time: {
    flexDirection: "row",
    alignItems: "center",
    width: vw(100),
    marginTop: 10,
    marginBottom: 10,
  },
  btn_date: {
    marginLeft: vw(5),
    width: vw(38),
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    borderRadius: 999,
    alignItems: "center",
    backgroundColor: "#4834d4",
  },
  txt_btn: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    paddingHorizontal: 15,
  },
});
