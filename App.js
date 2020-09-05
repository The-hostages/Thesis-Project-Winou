import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaView, StatusBar, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Map from "./components/map";
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { YellowBox } from "react-native";
import MyTabs from "./components/NavComponent";
import Line from "./components/Lines";

YellowBox.ignoreWarnings([
  "Non-serializable values were found in the navigation state",
  "Setting a timer for a long period of time",
]);
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
        name="Map"
        component={Map}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyTabs"
        component={MyTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar hidden />
      <StackNavigator />
    </NavigationContainer>
  );
}
