import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaView, StatusBar, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Map from "./components/map";
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
const Stack = createStackNavigator();
const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="homepage"
        component={Homepage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Map}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={SignUp}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      >
        <StackNavigator />
      </SafeAreaView>
    </NavigationContainer>
  );
}
