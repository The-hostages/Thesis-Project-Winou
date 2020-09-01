import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

class Line extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.navigation = this.props.navigation;
  }

  render() {
    return (
      <View>
        <TouchableOpacity style={styles.appButtonContainer}>
          <Text
            style={styles.button}
            onPress={() => this.navigation.navigate("Map", { line: 1 })}
          >
            Metro 1
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.appButtonContainer}>
          <Text
            style={styles.button}
            onPress={() => this.navigation.navigate("Map", { line: 2 })}
          >
            Metro 2
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.appButtonContainer}>
          <Text
            style={styles.button}
            onPress={() => this.navigation.navigate("Map", { line: 3 })}
          >
            Metro 3
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.appButtonContainer}>
          <Text
            style={styles.button}
            onPress={() => this.navigation.navigate("Map", { line: 4 })}
          >
            Metro 4
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.appButtonContainer}>
          <Text
            style={styles.button}
            onPress={() => this.navigation.navigate("Map", { line: 5 })}
          >
            Metro 5
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.appButtonContainer}>
          <Text
            style={styles.button}
            onPress={() => this.navigation.navigate("Map", { line: 6 })}
          >
            Metro 6
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  button: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
});

export default Line;
