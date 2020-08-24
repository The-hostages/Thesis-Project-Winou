import Login from "./components/Login";
import SignUp from "./components/SignUp";
import React from "react";
import { StyleSheet, View, StatusBar } from "react-native";

export default function App() {
  return (
    <View style={styles.signup}>
      <StatusBar style="auto" />
      {/* <SignUp /> */}
      <Login />
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
