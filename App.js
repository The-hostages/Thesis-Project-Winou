import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Map from './components/map'

import React from "react";
import { StyleSheet, View, StatusBar } from "react-native";


export default function App() {
  return (
    <View style={styles.signup}>
      <StatusBar style="auto" />
      {/* <SignUp /> */}
      {/* <Login /> */}
      <Map/>
    </View>
  );
}

const styles = StyleSheet.create({
  signup: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
