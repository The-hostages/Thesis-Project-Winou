import React from "react";
import { StyleSheet, View, Text } from "react-native";

class Line extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        <Text style={styles.button}>Metro 1</Text>
        <Text style={styles.button}>Metro 2</Text>
        <Text style={styles.button}>Metro 3</Text>
        <Text style={styles.button}>Metro 4</Text>
        <Text style={styles.button}>Metro 5</Text>
        <Text style={styles.button}>Metro 6</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderColor: "green",
    width: 240,
    height: 45,
    textAlign: "center",
    marginTop: 5,
  },
});

export default Line;
