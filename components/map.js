import * as React from "react";
import MapView, { Marker } from "react-native-maps";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import axios from "axios";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import Polyline from "@mapbox/polyline";
import key from "../key";
import { db } from "../config";
// import { NavigationContainer } from "@react-navigation/native";
import Communications from "react-native-communications";
import * as TaskManager from "expo-task-manager";
import mapStyle from "./mapstyle.json";
import { getDistance, findNearest, getCenter } from "geolib";

const locations = require("../locations.json");
const trainligne = require("../encodedPoly.json");

const LOCATION_TASK_NAME = "background-location-task";
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
      station: "",
      metro: "",
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
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
      locationGiven: false,
    };
  }
  async getLocationAsync() {
    try {
      const { status } = await Permissions.getAsync(Permissions.LOCATION);
      if (status !== "granted") {
        const response = await Permissions.askAsync(Permissions.LOCATION);
        this.setState({
          locationGiven: false,
        });
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
      // await Location.watchPositionAsync(
      //   {
      //     enableHighAccuracy: true,
      //     timeInterval: 1000,
      //     distanceInterval: 2,
      //   },
      //   (position) => {
      //     const { latitude, longitude } = position.coords;
      //     const { routeCoordinates, distanceTravelled } = this.state;
      //     const newCoordinate = { latitude, longitude };
      //     console.log("ok", newCoordinate);
      //     this.setState({
      //       latitude,
      //       longitude,
      //       distanceTravelled:
      //         distanceTravelled + this.calcDistance(newCoordinate),
      //       routeCoordinates: routeCoordinates.concat([newCoordinate]),
      //       prevLatLng: newCoordinate,
      //     });
      //     console.log("dist", this.state);
      //     setTimeout(() => {
      //       console.log("time out", this.state);
      //     }, 2000);
      //   }
      // );
    } catch (e) {
      console.error("error", e);
    }
  }

  // async timeCalculator(station, train) {
  //   try {
  //     const resp = await axios.get(
  //       `https://maps.googleapis.com/maps/api/directions/json?origin=${station}&destination=${train}&key=${key}&mode=walking`
  //     );
  //     const response = resp.data.routes[0];
  //     const {
  //       distance: { text: distance },
  //       duration: { text: time },
  //     } = response.legs[0];
  //     this.setState({ distanceTrain: distance, timeTrain: time });
  //   } catch (e) {
  //     console.error("error", e);
  //   }
  // }
  // showdistance() {
  //   const { allCoordsTrain, metroLatitude, metroLongitude } = this.state;
  //   console.log(allCoordsTrain[0]);
  //   const findnearest = getCenter(
  //     // { latitude: metroLatitude, longitude: metroLongitude },
  //     allCoordsTrain[0]
  //   );
  //   this.setState({
  //     distancePoints: findnearest,
  //   });
  // }
  async trainLocationMovement() {
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
  }
  async componentDidMount() {
    await this.trainLocationMovement();
    await this.AlltrainItenerary();
    await this.getLocationAsync();
    //await this.showdistance();
  }

  async getDirections(startLoc, desLoc) {
    try {
      const axiosResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${desLoc}&key=${key}&mode=cycling`
      );
      const response = axiosResponse.data.routes[0];
      const {
        distance: { text: distance },
        duration: { text: time },
      } = response.legs[0];
      const coords = Polyline.decode(response.overview_polyline.points).map(
        (point) => ({
          latitude: point[0],
          longitude: point[1],
        })
      );
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
      const stations = specificLocation
        .map((location) =>
          [location.coords.latitude, location.coords.longitude].join("%2C")
        )
        .reduce((acc, cur, index) => {
          if (!(index % 25)) {
            return [...acc, [cur]];
          }
          acc[acc.length - 1].push(cur);
          return acc;
        }, [])
        .map(async (arr) =>
          axios.get(
            `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&mode=walking&origins=${
              current.lat
            },${current.long}&destinations=${arr.join("%7C")}&key=${key}`
          )
        );

      const response = await Promise.all(stations);
      const ress = response.map((res) => res.data);

      //it goes only throw 25 fix this SHITTTTTTTTTTTTTTTTTT

      const res = ress[0].rows[0].elements.map((ele, i) => ({
        ...ele,
        destination_addresses: ress[0].destination_addresses[i],
        coords: specificLocation[i].coords,
      }));
      const sortedRes = this.sorting("distance.value", res)[0];

      this.setState({
        latitudeStation: sortedRes.coords.latitude,
        longitudeStation: sortedRes.coords.longitude,
      });
      const Station = `${this.state.latitudeStation},${this.state.longitudeStation}`;
      const Metro = `${this.state.metroLatitude},${this.state.metroLongitude}`;
      this.setState({ station: Station, metro: Metro });
      // this.timeCalculator(Station, Metro);
    } catch (e) {
      console.error("error", e);
    }
  };
  sorting = (prop, arr) => {
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
    // this.timeCalculator(this.state.metro, this.state.station);
    const { positionState, oneLigne, allCoordsTrain } = this.state;
    if (positionState.latitude !== 0) {
      this.state.loadingMap = true;
      this.state.loading = false;
    }
    if (oneLigne !== -1) {
      this.state.oneCoords = [allCoordsTrain[oneLigne - 1]];
    }
  }

  // onMarkerPress = (location) => async () => {
  //   const {
  //     coords: { latitude, longitude },
  //   } = location;
  //   this.setState(
  //     {
  //       destination: location,
  //       desLatitude: latitude,
  //       desLongitude: longitude,
  //     },
  //     this.mergeCoords
  //   );
  // };
  /*** Getting the new Coordinate distance !!! function  */

  gettingNewCoordinates = async () => {
    await Location.requestPermissionsAsync();
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      enableHighAccuracy: true,
      distanceInterval: 1,
      timeInterval: 5000,
    });
    await Location.watchPositionAsync(
      {
        enableHighAccuracy: true,
        timeInterval: 20000,
        distanceInterval: 2,
      },
      (position) => {
        var { latitude, longitude } = position.coords;
        var region = {
          latitude,
          longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
        this.setState(
          {
            positionState: region,
          },
          this.mergeCoords
        );
      }
    );
  };
  async sendingSms() {
    console.log("executed");
    const { positionState } = this.state;

    await Communications.text(
      "0021692007369",
      `Emergency http://maps.google.com/?q=${positionState.latitude},${positionState.longitude}`
    );
  }

  trainPosition = () => {};
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
      distanceTrain,
      timeTrain,
      locations,
      distancePoints,
    } = this.state;

    const data = oneLigne != -1 ? oneCoords : allCoordsTrain;
    const specificLocation =
      oneLigne !== -1 ? locations[oneLigne] : locations.flat();

    // console.log(distancePoints);

    return (
      <View style={Styles.container}>
        {/* {loadingMap === false && (
          <MapView
            style={Styles.map}
            initialRegion={{
              latitude: 36.797756,
              longitude: 10.169566,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
            rotateEnabled={false}
          >
            {data.map((ligne, idx) => (
              <MapView.Polyline
                key={idx}
                strokeWidth={4}
                strokeColor="rgba(22,140,0,0.7)"
                coordinates={ligne}
              />
            ))}
          </MapView>
        )} */}
        {loadingMap && (
          <View>
            <MapView
              style={Styles.map}
              customMapStyle={mapStyle}
              initialRegion={positionState}
              showsUserLocation
              rotateEnabled={false}
            >
              <MapView.Polyline
                strokeWidth={4}
                strokeColor="rgba(255,140,0,0.8)"
                coordinates={coords}
              />
              {data.map((ligne, idx) => (
                <MapView.Polyline
                  key={idx}
                  strokeWidth={5}
                  strokeColor="rgba(181,0,71,0.7)"
                  coordinates={ligne}
                />
              ))}
              {specificLocation

                .map((location) => {
                  return {
                    coords: {
                      latitude: location.coords.latitude,
                      longitude: location.coords.longitude,
                    },
                    name: location.name,
                  };
                })
                .map((station, idx) => (
                  <View key={`a${idx}`}>
                    <Marker
                      key={`b${idx}`}
                      coordinate={station.coords}
                      image={require("../assets/stations1.png")}
                    ></Marker>
                    <Marker
                      key={`c${idx}`}
                      style={{
                        top: 0,
                        right: 200,
                        zIndex: 2,
                        position: "relative",
                        width: 100,
                      }}
                      coordinate={station.coords}
                    >
                      <View
                        style={{
                          width: 100,
                          height: 10,
                          zIndex: 2,
                          position: "absolute",
                          top: 0,
                          right: 0,
                        }}
                      >
                        <Text style={{ fontSize: 12 }}>{station.name}</Text>
                      </View>
                    </Marker>
                  </View>
                ))}

              <Marker
                coordinate={{
                  latitude: metroLatitude,
                  longitude: metroLongitude,
                }}
                image={require("../assets/metro.png")}
              />
            </MapView>
            <View
              style={{
                backgroundColor: "#fff",
                width: 150,
                paddingTop: 10,
                paddingBottom: 10,
                alignSelf: "center",
                alignItems: "center",
                height: height * 0.15,
                borderBottomRightRadius: 25,
                justifyContent: "flex-end",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              <Text>
                <Image
                  source={require("../assets/persontostation.png")}
                  style={{ width: 80, height: 80 }}
                />
              </Text>
              <Text style={{ fontWeight: "bold", color: "grey" }}>
                {time} ({distance})
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "#fff",
                width: 150,
                paddingTop: 10,
                paddingBottom: 10,
                alignSelf: "center",
                alignItems: "center",
                height: height * 0.15,
                borderBottomLeftRadius: 25,
                justifyContent: "flex-end",
                position: "absolute",
                top: 0,
                right: 0,
              }}
            >
              <Text>
                <Image
                  source={require("../assets/metrotoStation.png")}
                  style={{ width: 80, height: 80 }}
                />
              </Text>
              <Text style={{ fontWeight: "bold", color: "grey" }}>
                {" "}
                {timeTrain} ({distanceTrain})
              </Text>
            </View>
          </View>
        )}
        {/* <View
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
        </View> */}
        {/* <MyTabs /> */}
        <TouchableOpacity style={Styles.ButtonContainer}>
          <Text
            style={Styles.SOSbutton}
            onPress={() => {
              this.sendingSms();
            }}
          >
            ALERT
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    return;
  }
  if (data) {
    const { locations } = data;
    // do something with the locations captured in the background
  }
});

const Styles = StyleSheet.create({
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 20,
    backgroundColor: "transparent",
  },
  bubble: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
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

  ButtonContainer: {
    elevation: 8,
    backgroundColor: "#fff",
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    position: "absolute",
    top: 100,
    left: 0,
  },
  SOSbutton: {
    fontSize: 18,
    color: "#FF0000",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
});
