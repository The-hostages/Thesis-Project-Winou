import React from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";


class Login extends React.Component {

    constructor(props){
        super(props);
    }
    render (){
        return (
            <View style={styles.container}>
                <Text></Text>
                <TextInput placeholder ="Email"></TextInput>
                <TextInput placeholder ="Password"></TextInput>
                <Button  title="Login"/>
            </View>
          );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
export default Login;