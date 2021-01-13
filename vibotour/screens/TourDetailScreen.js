import React, { useState, useEffect } from "react";
import TouristAttraction from "../components/TouristAttraction";
import PlaceSchedule from "../components/PlaceSchedule";
import PlaceSlide from "../components/PlaceSlide";
import { formatDateTime, getDay } from "../utils/DateUtil";
import { bookTour } from "../utils/BookTourUtil";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { vw, vh } from "react-native-expo-viewport-units";
import { AppLoading } from "expo";
import { useFonts } from "expo-font";
import { getToken } from "../utils/StorageUtil";
import { requestLogin } from "../utils/AccountUtil";

const TourDetailScreen = ({ route, navigation }) => {
  const { itemId } = route.params;
  const [tourName, setTourName] = useState("");
  const [description, setDescription] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [departureLocation, setDepartureLocation] = useState("");
  const [tourCost, setTourCost] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [duration, setDuration] = useState("");
  const [rate, setRate] = useState(0);
  const [note, setNote] = useState("");
  const [tourDetail, setTourDetail] = useState([]);
  const [persons, setPersons] = useState([
    "https://firebasestorage.googleapis.com/v0/b/vibotour-f4715.appspot.com/o/user-image%2Fperson1.jpeg?alt=media&token=a6d4145e-59a7-4a94-8705-e3dc3d8e6122",
    "https://firebasestorage.googleapis.com/v0/b/vibotour-f4715.appspot.com/o/user-image%2Fperson2.jpg?alt=media&token=269e9dee-df0c-4b2d-8409-b02ba9a26d2d",
    "https://firebasestorage.googleapis.com/v0/b/vibotour-f4715.appspot.com/o/user-image%2Fperson4.jpg?alt=media&token=368a79fd-e0cc-46b9-83cc-5733a6a199ec",
  ]);
  const [slide, setSlide] = useState(<View />);

  useEffect(() => {
    if (!tourName) {
      fetchTourData(itemId);
      fetchTourDetail(itemId);
    }
  }, []);

  let [fontsLoaded] = useFonts({
    "openSans-600": require("../assets/fonts/OpenSans-SemiBold.ttf"),
    "openSans-700": require("../assets/fonts/OpenSans-Bold.ttf"),
  });
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  function fetchTourData(tour_id) {
    fetch(process.env.SERVER_IP + "/api/v1/tour", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({ tour_id }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          setTourName(result[0].tour_name);
          var rating = result[0].total_vote / result[0].number_vote;
          if (!rating) {
            rating = 4.0;
          }
          setRate(rating.toFixed(1));
          setTourCost(
            "Giá: " + getValueExceptNull(result[0].tour_cost) + " VND"
          );
          setDescription(getValueExceptNull(result[0].description));
          setVehicle("Phương tiện: " + getValueExceptNull(result[0].vehicle));
          setDepartureLocation(
            "Xuất phát: " + getValueExceptNull(result[0].departure_location)
          );
          setTimeStart("Khởi hành: " + formatDateTime(result[0].time_start));
          setDuration(
            "Thời gian: " + getDay(result[0].number_day, result[0].number_night)
          );
          setNote(result[0].note);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  function getValueExceptNull(value) {
    return value ? value : "";
  }

  function fetchTourDetail(tour_id) {
    fetch(process.env.SERVER_IP + "/api/v1/tourDetail", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({ tour_id }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (!result) {
          //todo
        } else {
          console.log(result);
          setTourDetail(result);
          setSlide(<PlaceSlide places={result} />);
        }
      })
      .catch((error) => console.log(error));
  }

  function clickEventListener(e) {
    getToken().then((userId) => {
      if (userId) {
        bookTour(userId, itemId).then((result) => {
          Alert.alert(result);
        });
      } else {
        requestLogin(navigation);
      }
    });
  }
  let tour_list = tourDetail.map((tour) => {
    return <TouristAttraction key={tour.tourist_attraction_id} tour={tour} />;
  });

  let schedules = tourDetail.map((tour) => {
    return <PlaceSchedule key={tour.tourist_attraction_id} tour={tour} />;
  });

  let listPersons = persons.map((person) => {
    return (
      <Image key={person} style={styles.person} source={{ uri: person }} />
    );
  });

  return (
    <View style={styles.container}>
      <ScrollView>
        <TouchableOpacity style={styles.backButton}>
          <MaterialCommunityIcons
            name="keyboard-backspace"
            color={"#fff"}
            size={30}
            onPress={() => navigation.goBack()}
          />
          <View style={styles.rate}>
            <MaterialCommunityIcons name="star" color={"#fff"} size={25} />
            <Text style={styles.rateText}>{rate}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.tourImg}>{slide}</View>
        <View style={styles.content}>
          <View style={styles.headerContent}>
            <Text style={styles.name}>{tourName}</Text>
            <Text style={styles.price}>{tourCost}</Text>
            <Text style={styles.departure}>{duration}</Text>
            <Text style={styles.departure}>{vehicle}</Text>
            <Text style={styles.departure}>{timeStart}</Text>
            <Text style={styles.departure}>{departureLocation}</Text>
          </View>
          <View style={styles.tourContent}>
            <Text style={styles.description}>{description}</Text>
            <View>
              <Text style={styles.tiltle}>Địa điểm</Text>
              {tour_list}
            </View>
            <View>
              <Text style={styles.tiltle}>Lịch trình</Text>
              {schedules}
            </View>
            <View>
              <Text style={styles.tiltle}>Ghi chú</Text>
              <Text style={styles.note}>{note}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.end}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ReviewTour", { itemId, tourName })
          }
        >
          <View style={styles.reviewer}>
            {listPersons}
            <Text style={styles.allReview}>Tất cả nhận xét</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={clickEventListener}
        >
          <Text style={styles.bookButtonText}>Đặt Ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    marginTop: vh(4),
    marginLeft: vw(5),
    width: 30,
    zIndex: 2,
    position: "relative",
  },
  tourImg: {
    width: vw(100),
    height: vh(50),
    marginTop: -vh(8),
    zIndex: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  rate: {
    width: vh(10),
    height: vh(5),
    marginLeft: vw(70),
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "absolute",
    borderRadius: 20,
    justifyContent: "center",
    padding: 5,
  },
  rateText: {
    color: "#fff",
    fontSize: 20,
    position: "absolute",
    marginLeft: vh(4),
  },
  content: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -vh(10),
    backgroundColor: "#eee",
    zIndex: 2,
    flex: 1,
  },
  headerContent: {
    padding: 20,
    width: vw(90),
  },
  tourContent: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: "#fff",
    padding: 20,
    flex: 1,
  },
  name: {
    fontSize: 20,
    color: "#696969",
    fontWeight: "bold",
    width: vw(70),
  },
  price: {
    marginTop: 10,
    width: vw(70),
    fontSize: 18,
  },
  departure: {
    width: vw(90),
    fontSize: 18,
  },
  note: {
    marginTop: 10,
    fontSize: 18,
  },
  end: {
    width: vw(100),
    height: vw(15),
    flexDirection: "row",
  },
  reviewer: {
    width: vw(50),
    flex: 1,
    flexDirection: "row",
    marginLeft: vw(10),
    alignItems: "center",
  },
  allReview: {
    marginLeft: 10,
    fontStyle: "italic",
  },
  person: {
    width: vw(15),
    height: vw(15),
    borderRadius: 50,
    backgroundColor: "#ccc",
    marginLeft: -vw(8),
    borderWidth: 1,
    borderColor: "#20232a",
  },
  bookButton: {
    width: vw(40),
    height: vw(15),
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "rgba(52, 152, 219, 0.9)",
    flex: 1,
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
  },
  starIcon: {
    width: 50,
    height: 50,
    flex: 1,
    marginLeft: vw(70),
    marginTop: -vh(7),
    backgroundColor: "#777",
    borderRadius: 50,
  },
  description: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 18,
    color: "#696969",
  },
  star: {
    width: 40,
    height: 40,
  },
  tiltle: {
    backgroundColor: "#ccc",
    fontWeight: "bold",
    fontSize: 40,
    marginTop: vh(6),
    textAlign: "center",
    width: vw(90),
    height: vh(10),
    lineHeight: vh(10),
    borderRadius: 20,
  },
  btnColor: {
    height: 30,
    width: 30,
    borderRadius: 30,
    marginHorizontal: 3,
  },
  starContainer: {
    justifyContent: "center",
    marginHorizontal: 30,
    flexDirection: "row",
    marginTop: 20,
  },
  separator: {
    height: 2,
    backgroundColor: "#eeeeee",
    marginTop: 20,
    marginHorizontal: 30,
  },
});

export default TourDetailScreen;
