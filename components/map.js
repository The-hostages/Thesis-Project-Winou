import React from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, Dimensions } from "react-native";

import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

import Polyline from "@mapbox/polyline";

const locations = require("../locations.json");

const { width, height } = Dimensions.get("window");

const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class Map extends React.Component {
  state = {
    positionState: {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0,
      longitudeDelta: 0,
    },
    markerPosition: {
      latitude: 0,
      longitude: 0,
    },
    loading: true,
    loadingMap: false,
    locations: locations,
    onetoTwo:
      "ed~_Fkuf}@`GApGdBlEpCpFtA`UPjHvAlFvB|CjD~CxGxBtH|BdMbDfRlAfH`AbD|DlAtOnCvKZzKfAxFdArD?zBaDpA_DdJ{S`MkXnDmC`z_@bAz@`TlTpIjGzNoPpLuArEnBjZvKrIjBlDz@fUuA~oCLvBlBG",
  };

  async getLocationAsync() {
    const { status } = await Permissions.getAsync(Permissions.LOCATION);
    if (status !== "granted") {
      const response = await Permissions.askAsync(Permissions.LOCATION);
    }
    var place = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });
    this.setState({ place });
    var lat = parseFloat(place.coords.latitude);
    var long = parseFloat(place.coords.longitude);

    var region = {
      latitude: lat,
      longitude: long,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };
    // this.setState({ positionState: region });
    // this.setState({ markerPosition: region });

    const {
      locations: [sampleLocation],
    } = this.state;

    this.setState(
      {
        positionState: region,
        desLatitude: sampleLocation.coords.latitude,
        desLongitude: sampleLocation.coords.longitude,
      },
      this.mergeCoords
    );
  }
  async componentDidMount() {
    await this.trainItenerary();
    await this.getLocationAsync();
  }

  async getDirections(startLoc, desLoc) {
    try {
      console.log("executing");

      const resp = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${desLoc}&key=AIzaSyAXcO-TwBc8G8_ktmHpTZZx4KdBeWnKdmE`
      );
      const respJson = await resp.json();
      const response = await respJson.routes[0];
      const distanceTime = response.legs[0];
      // const distance =  distanceTime.distance.text
      // const time = distanceTime.duration.text

      const points = Polyline.decode(response.overview_polyline.points);
      const coords = points.map((point) => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });
      this.setState({ coords });
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  async trainItenerary() {
    const { onetoTwo } = this.state;
    const points = await Polyline.decode(onetoTwo);
    console.log("trainItenerary", points);
    const coordsTrain = points.map((point) => {
      return {
        latitude: point[0],
        longitude: point[1],
      };
    });
    this.setState({ coordsTrain });
  }

  mergeCoords = async () => {
    const { positionState, desLatitude, desLongitude } = this.state;

    const hasStartAndEnd =
      positionState.latitude !== null && desLatitude !== null;

    if (hasStartAndEnd) {
      const concatStart = `${positionState.latitude},${positionState.longitude}`;
      const concatEnd = `${desLatitude},${desLongitude}`;
      await this.getDirections(concatStart, concatEnd);
    }
  };
  //till here

  componentDidUpdate() {
    if (this.state.positionState.latitude !== 0) {
      this.state.loadingMap = true;
      this.state.loading = false;
    }
  }
  onMarkerPress = (location) => async () => {
    const {
      coords: { latitude, longitude },
    } = location;
    this.setState(
      {
        destination: location,
        desLatitude: latitude,
        desLongitude: longitude,
      },
      this.mergeCoords
    );
  };
  renderMarkers = () => {
    const { locations } = this.state;
    return (
      <View>
        {locations.map((location, idx) => {
          const {
            coords: { latitude, longitude },
          } = location;
          return (
            <Marker
              key={idx}
              coordinate={{ latitude, longitude }}
              onPress={this.onMarkerPress(location)}
            />
          );
        })}
      </View>
    );
  };
  render() {
    let {
      positionState,
      markerPosition,
      coords,
      loadingMap,
      coordsTrain,
    } = this.state;
    console.log("position state on render ", positionState.latitude);
    return (
      <View style={Styles.container}>
        {loadingMap && (
          <MapView
            style={Styles.map}
            initialRegion={positionState}
            showsUserLocation
          >
            {this.renderMarkers()}
            <MapView.Polyline
              strokeWidth={4}
              strokeColor="rgba(255,140,0,0.8)"
              coordinates={coords}
            />
            <MapView.Polyline
              strokeWidth={4}
              strokeColor="rgba(22,140,0,0.7)"
              coordinates={coordsTrain}
            />
          </MapView>
        )}
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  radius: {
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
    overflow: "hidden",
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(0, 112, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    height: 20,
    width: 20,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 20 / 2,
    overflow: "hidden",
    backgroundColor: "#007AFF",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },

  map: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    //   left: 0,
    //   right: 0,
    //   top: 0,
    //   bottom: 0,
    //   position: "absolute"
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
