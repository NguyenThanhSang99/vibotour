import React, { useState } from "react";
import {
  Text,
  View,
  ImageBackground,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";
import { vh, vw } from "react-native-expo-viewport-units";
import { FontAwesome } from "@expo/vector-icons";
import SegmentedControlTab from "react-native-segmented-control-tab";

import Carousel from "../components/Carousel";
import ListTour from "../components/ListTour";
import ListTrendingTour from "../components/ListTrendingTour";

const HomeScreen = ({ navigation }) => {
  const [days, setDays] = useState(7);
  const [selectedIndex, setSelectedIndex] = useState(0);
  let [fontsLoaded] = useFonts({
    "openSans-600": require("../assets/fonts/OpenSans-SemiBold.ttf"),
    "openSans-700": require("../assets/fonts/OpenSans-Bold.ttf"),
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }
  function handleIndexChange(index) {
    setSelectedIndex(index);
    if (index === 0) {
      setDays(7);
    } else {
      setDays(30);
    }
  }
  return (
    <ScrollView horizontal={false}>
      <View style={styles.container}>
        <View style={styles.appHeader}>
          <ImageBackground
            source={require("../assets/image/bg.jpg")}
            style={styles.imageBackground}
          />
          <View style={styles.containerHeader}>
            <Text style={styles.bigTitle}>Đi cùng</Text>
            <Text style={styles.smallTitle}>viBOTour</Text>
            <View style={styles.searchBar}>
              <FontAwesome
                name="search"
                size={24}
                color="#8492A6"
                style={styles.iconSearch}
              />
              <TextInput
                style={styles.textSearch}
                onTouchStart={() => navigation.navigate("Search")}
                placeholder="Search"
                placeholderTextColor="rgba(71,82,94,0.8)"
              ></TextInput>
            </View>
            <Carousel />
          </View>
        </View>

        <View style={styles.listTour}>
          <Text style={styles.titleListTour}>Trải nghiệm các chuyến đi</Text>
          <ListTour nav={navigation} />
        </View>
        <View>
          <Text style={styles.titleListTour}>Xu hướng</Text>
          <View>
            <SegmentedControlTab
              tabsContainerStyle={styles.menuTrend}
              values={["Tuần", "Tháng"]}
              selectedIndex={selectedIndex}
              onTabPress={(index) => handleIndexChange(index)}
            />
          </View>
          <View style={styles.listTourTrend}>
            <ListTrendingTour nav={navigation} days={days} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    color: "#47525E",
  },
  appHeader: {
    flex: 1,
    height: vh(50),
  },
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    position: "relative",
  },
  bluBackground: {
    width: vw(100),
    height: vh(100),
    position: "absolute",
  },
  containerHeader: {
    top: vh(10),
    marginLeft: vh(2.5),
    position: "absolute",
    width: vw(95),
  },
  bigTitle: {
    fontSize: vh(5),
    color: "#303942",
    fontFamily: "openSans-700",
  },
  smallTitle: {
    fontSize: vh(4),
    color: "#303942",
    fontFamily: "openSans-600",
  },
  menuTrend: {
    left: vw(5),
    width: vw(90),
    marginBottom: 20,
    height: 40,
  },
  searchBar: {
    height: vh(5),
    borderWidth: 1,
    marginTop: vh(6),
    width: vw(90),
    borderColor: "#8492A6",
    borderRadius: 20,
    backgroundColor: "rgba(150,159,170,0.2)",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconSearch: {
    marginRight: 25,
  },
  textSearch: {
    width: vw(70),
    height: 24,
    fontSize: 17,
    fontFamily: "openSans-600",
  },
  listTour: {
    marginTop: vh(20),
  },
  titleListTour: {
    fontSize: vh(3),
    fontFamily: "openSans-600",
    marginLeft: 30,
    marginBottom: 10,
    marginTop: vh(4),
  },
  listTourTrend: {
    marginBottom: vh(10),
  },
});

export default HomeScreen;
