import React from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  StatusBar,
} from "react-native";
import AppButton from "./AppButton";

function Homepage({ navigation }) {
  return (
    <ImageBackground
      style={styles.imageback}
      source={require("../assets/1.jpg")}
    >
      <View style={styles.buttonContainer}>
        <View style={styles.loginButton}>
          <AppButton title="Login" navigation={navigation} />
        </View>
        <View style={styles.registerButton}>
          <AppButton title="SignUp" navigation={navigation} />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  imageback: {
    alignItems: "center",
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "flex-end",
  },
  loginButton: {
    width: "100%",
    height: 70,
    marginBottom: 20,
  },
  registerButton: {
    width: "100%",
    height: 70,
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 180,
  },
});

export default Homepage;
