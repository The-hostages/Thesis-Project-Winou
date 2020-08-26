import React from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import axios from "axios";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: "",
    };
    this.login = this.login.bind(this);
    this.path = "http://10.0.2.2:3000/user/login";
  }

  login(e) {
    e.preventDefault();
    axios
      .post(this.path, { email: this.state.email })
      .then(() => console.log("success"))
      .catch((err) => {
        console.log(err.response.data);
        this.setState({ error: err.response.data });
      });
  }
  render() {
    return (
      <View style={{}}>
        <Text style={styles.error}>{this.state.error}</Text>
        <TextInput
          placeholder="Your Email"
          style={styles.input}
          onChangeText={(email) => {
            this.setState({ email });
          }}
        ></TextInput>
        <TextInput
          placeholder="Your Password"
          style={styles.input}
          onChangeText={(password) => {
            this.setState({ password });
          }}
        ></TextInput>
        <Text style={styles.button} onPress={this.login}>
          Login
        </Text>
        <Text style={styles.buttonSignUp}>Sign Up</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#000",
    width: 240,
    height: 45,
    textAlign: "center",
    marginTop: 10,
  },

  button: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    width: 240,
    height: 45,
    borderRadius: 30,
    backgroundColor: "#9F4DFF",
    textAlign: "center",
    textAlignVertical: "center",
  },

  buttonSignUp: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    width: 240,
    height: 45,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#9F4DFF",
    backgroundColor: "#ffffff",
    textAlign: "center",
    textAlignVertical: "center",
  },
  error: {
    color: "red",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Login;
