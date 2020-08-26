import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
function AppButton({ title, navigation }) {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(title);
      }}
    >
      <View style={styles.button}>
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: "cadetblue",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "100%",
  },
  text: {
    color: "white",
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});
export default AppButton;
