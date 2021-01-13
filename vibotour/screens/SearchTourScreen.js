import React, { useState, useEffect } from "react";

import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { vh, vw } from "react-native-expo-viewport-units";
import { Ionicons } from "@expo/vector-icons";
import { SearchBar } from "react-native-elements";

const SearchTourScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);

  useEffect(() => {
    fetch(process.env.SERVER_IP + "/api/v1/getAllCurrentTours")
      .then((response) => response.json())
      .then((responseJson) => {
        setFilteredDataSource(responseJson);
        setMasterDataSource(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.tour_name
          ? item.tour_name.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  const Item = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Details", {
            itemId: item.tour_id,
          });
        }}
      >
        <View style={styles.listItem}>
          <Image
            source={{
              uri: process.env.SERVER_IP + "/vibotour/images/" + item.image,
            }}
            style={{ width: 150, height: 150 }}
          />
          <View style={{ flex: 1, marginLeft: 20 }}>
            <Text style={{ fontWeight: "bold" }}>{item.tour_name}</Text>
            <Text>{item.tour_cost + " VND"}</Text>
            <Text>
              {item.number_day + " ngày, " + item.number_night + " đêm"}
            </Text>
            <View style={styles.tourRating}>
              <Ionicons name="md-star" size={vh(3)} color="#fff200" />
              <Text style={styles.ratting}>{item.rate}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const ItemSeparatorView = () => {
    return (
      <View
        style={{
          height: 0.5,
          width: "100%",
          backgroundColor: "#FFFFFF",
        }}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <SearchBar
          round
          showLoading
          searchIcon={{ size: 24 }}
          onChangeText={(text) => searchFilterFunction(text)}
          onClear={() => searchFilterFunction("")}
          onCancel={() => navigation.goBack()}
          placeholder="Type Here..."
          value={search}
          showLoading={false}
          platform={Platform.OS}
          clearIcon={true}
          autoFocus={true}
        />
        <FlatList
          data={filteredDataSource}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={Item}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: vh(3),
    height: vh(100),
    backgroundColor: "#eee",
    borderRadius: 6,
    paddingBottom: 50,
  },
  image: {
    height: "20%",
    borderRadius: 4,
  },
  itemStyle: {
    padding: 10,
  },
  container1: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    marginTop: 60,
  },
  listItem: {
    marginBottom: 10,
    marginTop: 10,
    padding: 10,
    backgroundColor: "#FFFFFF",
    width: "90%",
    flex: 1,
    alignSelf: "center",
    flexDirection: "row",
    borderRadius: 5,
    borderWidth: 0,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: "#009688",
    backgroundColor: "#FFFFFF",
  },
  tourRating: {
    flexDirection: "row",
    marginTop: "30%",
    marginLeft: "60%",
  },
  ratting: {
    marginLeft: vh(1),
    color: "#000",
    fontSize: vh(2.5),
  },
});

export default SearchTourScreen;
