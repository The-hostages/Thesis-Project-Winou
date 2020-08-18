import React from "react";
import { View, Text, TextInput, Button } from "react-native";


class Login extends React.Component {

    constructor(props){
        super(props);
    }
    render (){
        return (
            <View>
                <TextInput placeholder ="Email"></TextInput>
                <TextInput placeholder ="Password"></TextInput>
                <Button  title="Login"/>
            </View>
          );
    }
}
export default Login;