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
                <TextInput placeholder ="Email" style={styles.input}></TextInput>
                <TextInput placeholder ="Password" style={styles.input}></TextInput>
                <Text style={styles.button} >Login</Text>
                <Text style={styles.buttonSignUp} >Sign Up</Text>
            </View>
          );
    }
}

const styles = StyleSheet.create({
  input: {
      
      borderRadius: 20,
      borderWidth:2,
      borderColor: '#000',
      width:240,
      height:45,
     textAlign: 'center',
     marginTop:10

  
  },

  button : {
      height:45,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop:20,
      width:240,
      height:45,
      borderRadius:30,
      backgroundColor: "#9F4DFF",
      textAlign: 'center',
      textAlignVertical: 'center'
  },
  
  buttonSignUp : {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:20,
    width:240,
    height:45,
    borderRadius:30,
    borderWidth:2,
    borderColor: "#9F4DFF",
    backgroundColor: "#ffffff",
    textAlign: 'center',
    textAlignVertical: 'center'
}
});

export default Login;