import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image, Alert} from 'react-native';

class SignUp extends React.Component {

  constructor(props) {
    super(props);
  }

  render(){
      return (
        <View >
            <TextInput placeholder = "First name"  style={styles.input} ></TextInput>
            <TextInput placeholder = "last name" style={styles.input}></TextInput>
            <TextInput placeholder = "Email" style={styles.input}></TextInput>
            <TextInput placeholder = "password" style={styles.input}></TextInput>
            <Text style={styles.button} >Sign up</Text>
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
    }
  });

 
export default SignUp;