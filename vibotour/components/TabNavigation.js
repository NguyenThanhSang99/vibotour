import React from "react";
import { Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

// Icon
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Screen
import AccountScreen from "../screens/AccountScreen";
import CartScreen from "../screens/CartScreen";
import ChatbotScreen from "../screens/ChatBotScreen";
import HomeScreen from "../screens/HomeScreen";
import NotificationScreen from "../screens/NotificationScreen";
import TourDetailScreen from "../screens/TourDetailScreen";
import SigninScreen from "../screens/SigninScreen";
import SignupScreen from "../screens/SignupScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import ForgotPassScreen from "../screens/ForgotPassScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SearchTourScreen from "../screens/SearchTourScreen";
import PaidHistoryScreen from "../screens/PaidHistoryScreen";
import ListReviewScreen from "../screens/ListReviewScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={TourDetailScreen} />
      <Stack.Screen name="ReviewTour" component={ListReviewScreen} />
      <Stack.Screen name="Search" component={SearchTourScreen} />
      <Stack.Screen name="Login" component={SigninScreen} />
    </Stack.Navigator>
  );
}

function BagStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Bag" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Login" component={SigninScreen} />
    </Stack.Navigator>
  );
}

function ChatbotStack({ navigation }) {
  navigation.setOptions({ tabBarVisible: false });
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatBot" component={ChatbotScreen} />
      <Stack.Screen name="Login" component={SigninScreen} />
    </Stack.Navigator>
  );
}

function NotificationStack({ navigation }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="Login" component={SigninScreen} />
      <Stack.Screen name="History" component={PaidHistoryScreen} />
    </Stack.Navigator>
  );
}

function AccountStack() {
  return (
    <Stack.Navigator
      initialRouteName="Account"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="Account"
        component={AccountScreen}
        initialParams={{ name: "" }}
      />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="PaidHistory" component={PaidHistoryScreen} />
      <Stack.Screen name="Login" component={SigninScreen} />
      <Stack.Screen name="ForgotPass" component={ForgotPassScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export default class TabNavigation extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              if (route.name === "HomeStack") {
                return focused ? (
                  <AntDesign name="home" size={29} color="rgba(52,63,75,0.8)" />
                ) : (
                  <AntDesign
                    name="home"
                    size={25}
                    color="rgba(150,159,170,0.9)"
                  />
                );
              } else if (route.name === "Bag") {
                return focused ? (
                  <Feather
                    name="shopping-bag"
                    size={29}
                    color="rgba(52,63,75,0.8)"
                  />
                ) : (
                  <Feather
                    name="shopping-bag"
                    size={25}
                    color="rgba(150,159,170,0.9)"
                  />
                );
              } else if (route.name === "ChatBot") {
                return (
                  <Image source={require("../assets/image/chatbot.gif")} />
                );
              } else if (route.name === "Notification") {
                return focused ? (
                  <MaterialIcons
                    name="notifications-none"
                    size={29}
                    color="rgba(52,63,75,0.8)"
                  />
                ) : (
                  <MaterialIcons
                    name="notifications-none"
                    size={25}
                    color="rgba(150,159,170,0.9)"
                  />
                );
              } else if (route.name === "Account") {
                return focused ? (
                  <MaterialCommunityIcons
                    name="account-outline"
                    size={29}
                    color="rgba(52,63,75,0.8)"
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="account-outline"
                    size={25}
                    color="rgba(150,159,170,0.9)"
                  />
                );
              }
            },
          })}
          tabBarOptions={{
            activeTintColor: "tomato",
            inactiveTintColor: "gray",
            showLabel: false,
          }}
        >
          <Tab.Screen name="HomeStack" component={HomeStack} />
          <Tab.Screen name="Bag" component={BagStack} />
          <Tab.Screen name="ChatBot" component={ChatbotStack} />
          <Tab.Screen name="Notification" component={NotificationStack} />
          <Tab.Screen name="Account" component={AccountStack} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}
