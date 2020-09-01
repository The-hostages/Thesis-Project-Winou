import React from "react";
import { StyleSheet, View, Text } from "react-native";

class Line extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.navigation = this.props.navigation;
  }

  render() {
    return (
      <View>
        <Text
          style={styles.button}
          onPress={() => this.navigation.navigate("Map", { line: 1 })}
        >
          Metro 1
        </Text>
        <Text
          style={styles.button}
          onPress={() => this.navigation.navigate("Map", { line: 2 })}
        >
          Metro 2
        </Text>
        <Text
          style={styles.button}
          onPress={() => this.navigation.navigate("Map", { line: 3 })}
        >
          Metro 3
        </Text>
        <Text
          style={styles.button}
          onPress={() => this.navigation.navigate("Map", { line: 4 })}
        >
          Metro 4
        </Text>
        <Text
          style={styles.button}
          onPress={() => this.navigation.navigate("Map", { line: 5 })}
        >
          Metro 5
        </Text>
        <Text
          style={styles.button}
          onPress={() => this.navigation.navigate("Map", { line: 6 })}
        >
          Metro 6
        </Text>
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
