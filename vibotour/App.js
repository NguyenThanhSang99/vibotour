import TabNavigation from "./components/TabNavigation";
import React from "react";
import * as firebase from "firebase";
import { FIREBASE_CONFIG } from "./config/FirebaseConfig";

try {
  if (FIREBASE_CONFIG.apiKey) {
    firebase.initializeApp(FIREBASE_CONFIG);
  }
} catch (err) {
  // ignore app already initialized error on snack
}

export default function App() {
  return <TabNavigation />;
}
