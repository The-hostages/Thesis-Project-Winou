import React from "react";
import { StyleSheet, Text, View, TextInput, Alert } from "react-native";
import axios from "axios";

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      error: "",
    };
    this.path = "http://10.0.2.2:3000/user/register";
    this.signUp = this.signUp.bind(this);
  }

  signUp(e) {
    e.preventDefault();
    const user = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      password: this.state.password,
    };
    axios
      .post(this.path, user)
      .then(() => {
        console.log("success");
      })
      .catch((err) => {
        this.setState({ error: err.response.data });
      });
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text id="error" style={styles.error}>
          {this.state.error}
        </Text>
        <TextInput
          placeholder="First name"
          style={styles.input}
          onChangeText={(first_name) => {
            this.setState({ first_name });
          }}
        ></TextInput>
        <TextInput
          placeholder="last name"
          style={styles.input}
          onChangeText={(last_name) => {
            this.setState({ last_name });
          }}
        ></TextInput>
        <TextInput
          placeholder="Email"
          style={styles.input}
          onChangeText={(email) => {
            this.setState({ email });
          }}
        ></TextInput>
        <TextInput
          placeholder="password"
          style={styles.input}
          onChangeText={(password) => {
            this.setState({ password });
          }}
        ></TextInput>
        <Text style={styles.button} onPress={this.signUp}>
          Sign up
        </Text>
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
  error: {
    color: "red",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SignUp;
