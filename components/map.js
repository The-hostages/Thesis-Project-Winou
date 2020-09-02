import * as React from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import axios from "axios";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import Polyline from "@mapbox/polyline";
import key from "../key";
import { db } from "../config";
// import { NavigationContainer } from "@react-navigation/native";

const locations = require("../locations.json");
const trainligne = require("../encodedPoly.json");

const { width, height } = Dimensions.get("window");
const SCREEN_HEIGHT = height;
const SCREEN_WIDTH = width;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      line: this?.props?.route?.params?.line || -1,
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
      trainligne: trainligne,
      longitudeStation: 0,
      latitudeStation: 0,
      allCoordsTrain: [],
      oneLigne: this?.props?.route?.params?.line || -1,
      oneCoords: [],
    };
  }
  async getLocationAsync() {
    try {
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
      await this._getNearestStation(region.latitude, region.longitude);
      this.setState(
        {
          positionState: region,
        },
        this.mergeCoords
      );
    } catch (e) {
      console.error("error", e);
    }
  }
  async trainLocationMovement() {
    const firebaseData = await db
      .ref("/locations")
      .once("value")
      .then((x) => console.log(x[0]));
  }
  async componentDidMount() {
    await db.ref("/locations").on("value", (x) => {
      const valueofFire = x.val();
      this.setState({
        metroLatitude: Object.values(valueofFire)[
          Object.values(valueofFire).length - 3
        ].loc.coords.latitude,
        metroLongitude: Object.values(valueofFire)[
          Object.values(valueofFire).length - 3
        ].loc.coords.longitude,
      });
    });

    await this.AlltrainItenerary();
    await this.getLocationAsync();
  }

  async getDirections(startLoc, desLoc) {
    try {
      const resp = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${desLoc}&key=${key}&mode=walking`
      );

      const response = await resp.data.routes[0];
      const distanceTime = response.legs[0];
      const distance = distanceTime.distance.text;
      const time = distanceTime.duration.text;
      const points = Polyline.decode(response.overview_polyline.points);
      const coords = points.map((point) => {
        return {
          latitude: point[0],
          longitude: point[1],
        };
      });
      this.setState({ coords, distance, time });
    } catch (e) {
      console.error("error", e);
    }
  }
  _getNearestStation = async (lat, long) => {
    try {
      const { locations, oneLigne } = this.state;
      const current = { lat, long };
      const specificLocation =
        oneLigne !== -1 ? locations[oneLigne] : locations.flat();
      const stationstring1 = specificLocation
        .map((location) =>
          [location.coords.latitude, location.coords.longitude].join("%2C")
        )
        .slice(0, 25)
        .join("%7C");
      const stationstring2 = specificLocation
        .map((location) =>
          [location.coords.latitude, location.coords.longitude].join("%2C")
        )
        .slice(25)
        .join("%7C");

      const response1 = await axios.get(
        `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&mode=walking&origins=${current.lat},${current.long}&destinations=${stationstring1}&key=${key}`
      );
      if (!!stationstring2.length) {
        var response2 = await axios.get(
          `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&mode=walking&origins=${current.lat},${current.long}&destinations=${stationstring2}&key=${key}`
        );
      } else {
        var response2 = {};
      }
      const response = { ...response1, ...response2 };
      const res = response.data.rows[0].elements.map((ele, i) => {
        return {
          ...ele,
          destination_addresses: response.data.destination_addresses[i],
          coords: specificLocation[i].coords,
        };
      });
      const sort = function (prop, arr) {
        prop = prop.split(".");
        var len = prop.length;
        arr.sort(function (a, b) {
          var i = 0;
          while (i < len) {
            a = a[prop[i]];
            b = b[prop[i]];
            i++;
          }
          if (a < b) {
            return -1;
          } else if (a > b) {
            return 1;
          } else {
            return 0;
          }
        });
        return arr;
      };
      const sortedRes = sort("distance.value", res)[0];
      // .sort((a, b) => {
      //   a.distance.value - b.distance.value;
      // })[0];
      this.setState({
        latitudeStation: sortedRes.coords.latitude,
        longitudeStation: sortedRes.coords.longitude,
      });
    } catch (e) {
      console.error("error", e);
    }
  };

  async AlltrainItenerary() {
    try {
      const { trainligne } = this.state;
      const add = await Object.values(trainligne).map((ligne) =>
        ligne.map((ougabouga) => Polyline.decode(ougabouga))
      );
      const allCoordsTrain = add
        .map((poly) => poly.flat())
        .map((point) =>
          point.map((pis) => ({
            latitude: pis[0],
            longitude: pis[1],
          }))
        );
      this.setState({ allCoordsTrain });
    } catch (e) {
      console.error("error", e);
    }
  }

  mergeCoords = async () => {
    const { positionState, latitudeStation, longitudeStation } = this.state;
    const hasStartAndEnd =
      positionState.latitude !== null && latitudeStation !== null;

    if (hasStartAndEnd) {
      const concatStart = `${positionState.latitude},${positionState.longitude}`;
      const concatEnd = `${latitudeStation},${longitudeStation}`;
      await this.getDirections(concatStart, concatEnd);
    }
  };
  //till here

  componentDidUpdate() {
    const { positionState, oneLigne, allCoordsTrain } = this.state;
    if (positionState.latitude !== 0) {
      this.state.loadingMap = true;
      this.state.loading = false;
    }
    if (oneLigne !== -1) {
      this.state.oneCoords = [allCoordsTrain[oneLigne - 1]];
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
              image={require("../assets/station2.png")}
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
      coords,
      loadingMap,
      longitudeStation,
      latitudeStation,
      allCoordsTrain,
      oneLigne,
      oneCoords,
      time,
      distance,
      metroLatitude,
      metroLongitude,
    } = this.state;
    const data = oneLigne != -1 ? oneCoords : allCoordsTrain;
    return (
      <View style={Styles.container}>
        {loadingMap && (
          <MapView
            style={Styles.map}
            initialRegion={positionState}
            showsUserLocation
            rotateEnabled={false}
          >
            {/* {this.renderMarkers()} */}
            <MapView.Polyline
              strokeWidth={4}
              strokeColor="rgba(255,140,0,0.8)"
              coordinates={coords}
            />
            {data.map((ligne, idx) => (
              <MapView.Polyline
                key={idx}
                strokeWidth={4}
                strokeColor="rgba(22,140,0,0.7)"
                coordinates={ligne}
              />
            ))}

            {/* <MapView.Polyline
              strokeWidth={4}
              strokeColor="rgba(22,140,0,0.7)"
              coordinates={coordsTrain}
            /> */}

            <Marker
              coordinate={{
                latitude: latitudeStation,
                longitude: longitudeStation,
              }}
              image={require("../assets/station3.png")}
            />
            <Marker
              coordinate={{
                latitude: metroLatitude,
                longitude: metroLongitude,
              }}
              image={require("../assets/station3.png")}
            />
          </MapView>
        )}
        <View
          style={{
            width,
            paddingTop: 10,
            paddingBottom: 10,
            alignSelf: "center",
            alignItems: "center",
            height: height * 0.05,
            backgroundColor: "white",
            justifyContent: "flex-end",
            position: "absolute",
            top: 0,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>
            {" "}
            {time} ({distance})
          </Text>
        </View>
        {/* <MyTabs /> */}
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
    // left: 0,
    // right: 0,
    // top: 0,
    // bottom: 0,
    // position: "absolute",
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
