import * as React from "react";
import { Text, View } from "react-native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Map from "./map";
import Line from "./Lines";

function Profile(props) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Map />
    </View>
  );
}
function Feed(props) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Line navigation={props.navigation} />
    </View>
  );
}

const Tab = createMaterialBottomTabNavigator();

function MyTabs(props) {
  return (
    <Tab.Navigator
      shifting={true}
      labeled={true}
      sceneAnimationEnabled={true}
      activeColor="#00aea2"
      inactiveColor="#95a5a6"
      barStyle={{ backgroundColor: "#ffff" }}
      initialRouteName="Profile"
      labelStyle={{ fontSize: 12 }}
    >
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Map",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="map" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarLabel: "Lines",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="subway" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default MyTabs;
